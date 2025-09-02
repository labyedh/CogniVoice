import logging
import shutil
import requests
import os
import librosa
import numpy as np
from config_ai import MODEL, FEATURES, PREPROCESSING, DEVICE # <-- Import config
from .prediction_pipeline import predict_from_audio
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def calculate_speech_features_from_audio(audio_path):
    try:
        y, sr = librosa.load(audio_path, sr=22050)
        intervals = librosa.effects.split(y, top_db=20)
        
        # Pause Frequency
        if len(intervals) > 1:
            pauses = [ (intervals[i+1][0] - intervals[i][1]) / sr for i in range(len(intervals)-1) if (intervals[i+1][0] - intervals[i][1]) / sr > 0.15 ]
            total_duration = len(y) / sr
            pause_freq = len(pauses) / (total_duration / 60) if total_duration > 0 else 0
            pause_freq_norm = min(pause_freq / 40, 1.0)
        else:
            pause_freq_norm = 0.1
        
        # Speech Rate
        speech_duration = sum((e - s) / sr for s, e in librosa.effects.split(y, top_db=25))
        if speech_duration > 0:
            onsets = librosa.onset.onset_detect(y=y, sr=sr, units='frames')
            words = len(onsets) / 1.4
            wpm = (words / speech_duration) * 60
            speech_rate_norm = min((wpm - 50) / 200, 1.0) if wpm >= 100 else wpm / 200
        else:
            speech_rate_norm = 0.3
            
        # Vocabulary & Fluency Proxies
        centroid_var = np.var(librosa.feature.spectral_centroid(y=y, sr=sr)[0])
        mfcc_var = np.mean(np.var(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13), axis=1))
        vocab_complexity_norm = np.clip((centroid_var / 1000000 + mfcc_var / 50) / 3, 0, 1)
        
        zcr_stability = 1 - np.std(librosa.feature.zero_crossing_rate(y)[0])
        flux = np.sum(np.diff(np.abs(librosa.stft(y)), axis=1)**2, axis=0)
        flux_smoothness = 1 - (np.std(flux) / (np.mean(flux) + 1e-8))
        semantic_fluency_norm = np.clip((max(zcr_stability, 0) + max(flux_smoothness, 0)) / 2, 0, 1)

        features = {
            'pauseFrequency': float(round(np.clip(pause_freq_norm, 0.1, 0.9), 2)),
            'speechRate': float(round(np.clip(speech_rate_norm, 0.2, 0.9), 2)),
            'vocabularyComplexity': float(round(np.clip(vocab_complexity_norm, 0.3, 0.8), 2)),
            'semanticFluency': float(round(np.clip(semantic_fluency_norm, 0.3, 0.9), 2))
        }
        logging.info(f"Calculated speech features: {features}")
        return features
    except Exception as e:
        logging.error(f"Error in calculate_speech_features: {e}")
        return {'pauseFrequency': 0.45, 'speechRate': 0.65, 'vocabularyComplexity': 0.55, 'semanticFluency': 0.62}


def send_progress_update(request_id: str, user_id: int, step: int, message: str, is_final: bool = False, result: dict = None): # <-- Accept user_id
    webhook_url = f"{os.getenv('FLASK_BACKEND_URL')}/internal/progress-update"
    payload = {
        "request_id": request_id,
        "user_id": user_id, # <-- Include user_id in the webhook
        "secret_key": os.getenv('INTERNAL_API_SECRET'),
        "update": {"step": step, "message": message, "is_final": is_final, "result": result}
    }
    try:
        requests.post(webhook_url, json=payload, timeout=5)
    except requests.RequestException as e:
        logging.error(f"[{request_id}] CRITICAL: Could not send webhook to Flask! Error: {e}")

# This is your run_analysis_pipeline, refactored for FastAPI
def run_analysis_pipeline_ai(audio_path, request_id,user_id, ml_models):
    try:
        send_progress_update(request_id,user_id, 0, "Preprocessing audio...")
        temp_folder_path = 'temp_processing_ai'
        clean_audio_path = ml_models["preprocessor"].run_full_pipeline(audio_path,temp_folder_path)
        
        send_progress_update(request_id,user_id, 1, "Feature extraction...")
        speech_features = calculate_speech_features_from_audio(audio_path) 
        
        send_progress_update(request_id,user_id, 2, "Speech pattern analysis...")
        result = predict_from_audio(
            clean_audio_path,
            ml_models["predictor"],
            ml_models["scaler"],
            MODEL,
            FEATURES,
            'static_predictions_ai', # Define a folder for visualization images
            DEVICE
        )
        if 'error' in result: raise Exception(result['error'])
        
        send_progress_update(request_id,user_id, 3, "Generating insights...")
        result["speechfeatures"] = speech_features
        risk_level = 'low'
        if result['finalPrediction'] == 'Dementia':
                confidence = float(result.get('confidence', 0))
                if confidence > 0.75: risk_level = 'high'
                elif confidence >= 0.5: risk_level = 'moderate'
        result['riskLevel'] = risk_level
        
        send_progress_update(request_id,user_id, 4, "Complete", is_final=True, result=result)
        logging.info(f"[{request_id}] AI pipeline completed successfully.")
    except Exception as e:
        logging.error(f"[{request_id}] AI Pipeline error: {e}", exc_info=True)
        error_result = {"error": str(e)}
        send_progress_update(request_id, 99, "Error", is_final=True, result=error_result)
    finally:
        # This cleanup is important for a long-running service
        if os.path.exists(audio_path):
            os.remove(audio_path)
        if 'clean_audio_path' in locals() and os.path.exists(clean_audio_path):
            shutil.rmtree(os.path.dirname(clean_audio_path), ignore_errors=True)