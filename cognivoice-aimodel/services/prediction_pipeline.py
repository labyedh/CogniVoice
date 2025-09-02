import os
import logging
import time
import torch
import numpy as np
import librosa
import librosa.display
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from collections import Counter
from .model_architecture import CNN_LSTM_Architecture

logger = logging.getLogger(__name__)

def load_model_from_checkpoint(checkpoint_path,model_config, device):
    logger.info(f"Loading checkpoint from: {checkpoint_path}")
    
    
    # Load the new architecture
    model = CNN_LSTM_Architecture(num_classes=model_config["num_classes"])
    
    
    checkpoint = torch.load(checkpoint_path, map_location=device,weights_only=False)
    model.load_state_dict(checkpoint if isinstance(checkpoint, dict) and 'model_state_dict' not in checkpoint else checkpoint['model_state_dict'])

    model.to(device)
    model.eval()
    logger.info("New Log-Mel CNN-LSTM model loaded successfully.")
    return model

def process_audio_to_logmel_segments(audio_path,features_config):
    """
    Extracts log-Mel features from an audio file and splits them into segments.
    """
    try:
        # 1. Extract raw log-Mel features
        
        sample_rate = features_config['sample_rate']
        n_mels = features_config['n_mels']
        
        y, sr = librosa.load(audio_path, sr=sample_rate)

        mel_spec = librosa.feature.melspectrogram(
            y=y, sr=sr, n_fft=2048, hop_length=512, win_length=2048, n_mels=n_mels, window='hann'
        )
        log_mel = librosa.power_to_db(mel_spec, ref=np.max)
        delta = librosa.feature.delta(log_mel)
        delta2 = librosa.feature.delta(log_mel, order=2)
        
        features = np.stack([log_mel, delta, delta2], axis=0)

        # 2. Segment the raw features into chunks
        segment_length = features_config['segment_length']
        if features.shape[2] < segment_length:
            logger.warning("Audio is too short to create a full segment.")
            return None

        segments = []
        for start in range(0, features.shape[2] - segment_length + 1, segment_length):
            segments.append(features[:, :, start:start + segment_length])
        
        return np.array(segments) if segments else None

    except Exception as e:
        logger.error(f"Error processing audio to log-mel segments: {e}", exc_info=True)
        return None
    
def predict_from_audio(audio_path, model, scaler,model_config, features_config, static_folder,device):
    # 1. Get all the unscaled segments in one step.
    segments = process_audio_to_logmel_segments(audio_path,features_config)
    
    if segments is None or len(segments) == 0:
        return {'error': 'Could not create valid feature segments from audio.'}

    
    segment_predictions, segment_probabilities = [], []
    
    with torch.no_grad():
        # 2. Loop through each segment, scale it, and predict.
        for segment in segments:
            # `segment` has shape (3, 224, 224)
            
            # Reshape for the scaler: (1, 150528)
            flat_segment = segment.reshape(1, -1)
            
            # Use the pre-trained scaler to transform this single segment
            scaled_segment_flat = scaler.transform(flat_segment)
            
            # Reshape for the model: (3, 224, 224)
            scaled_segment = scaled_segment_flat.reshape(model_config["input_shape"])

            # Create the tensor and predict
            segment_tensor = torch.FloatTensor(scaled_segment).unsqueeze(0).to(device)
            output_logit = model(segment_tensor)
            prob_dementia = torch.sigmoid(output_logit).item()
            
            segment_probabilities.append(prob_dementia)
            segment_predictions.append(1 if prob_dementia > 0.5 else 0)

    if not segment_predictions:
        return {'error': 'No predictions were made.'}
        
    # The rest of the function (voting, confidence, visualization) is the same and correct.
    final_vote = Counter(segment_predictions).most_common(1)[0][0]
    
    if final_vote == 1: # Dementia
        winning_probs = [p for p, pred in zip(segment_probabilities, segment_predictions) if pred == 1]
        confidence = np.mean(winning_probs) if winning_probs else 0
    else: # Control
        winning_probs = [1 - p for p, pred in zip(segment_probabilities, segment_predictions) if pred == 0]
        confidence = np.mean(winning_probs) if winning_probs else 0

    viz_url = save_visualization(audio_path, segment_predictions, final_vote,static_folder, features_config)

    return {
        'fileName': os.path.basename(audio_path),
        'finalPrediction': model_config["class_names"][final_vote],
        'confidence': f"{confidence:.2f}",
        'voteCounts': {model_config["class_names"][i]: Counter(segment_predictions).get(i, 0) for i in range(len(model_config["class_names"]))},
        'visualizationUrl': viz_url
    }

def save_visualization(audio_path, predictions, final_vote,static_folder, features_config):
    try:
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8), gridspec_kw={'height_ratios': [2, 1]})
        y, sr = librosa.load(audio_path, sr=features_config["sample_rate"])
        D = librosa.stft(y)
        S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)
        librosa.display.specshow(S_db, sr=sr, x_axis='time', y_axis='log', ax=ax1)
        ax1.set_title('Spectrogram')
        colors = ['#1f77b4' if p == final_vote else '#d62728' for p in predictions]
        ax2.bar(range(len(predictions)), [1]*len(predictions), color=colors)
        ax2.set_yticks([]); ax2.set_title(f'Segment Predictions (Blue = Final Vote)')
        plt.tight_layout()
        
        img_name = os.path.splitext(os.path.basename(audio_path))[0] + '_analysis.png'
        os.makedirs(static_folder, exist_ok=True)

        img_path = os.path.join(static_folder, img_name)
        plt.savefig(img_path)
        plt.close(fig)
        
        # This will be accessed via a static route if you set one up, or served directly.
        # For simplicity, we return a path the frontend can use.
        return f'/static_predictions/{img_name}' 
    except Exception as e:
        logger.error(f"Failed to save visualization: {e}")
        return ""