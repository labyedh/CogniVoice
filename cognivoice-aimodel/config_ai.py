import os
import torch
from dotenv import load_dotenv
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env_ai'))
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
HF_AUTH_TOKEN = os.environ.get('HF_AUTH_TOKEN') # IMPORTANT: Add your token to .env

PREPROCESSING = {
        "denoiser_model_path": "htdemucs",
        "num_diarization_speakers": 2, 
        "silence_top_db": 30, # Log-mel is sensitive, a lower dB might be better
        "normalization_type": "rms"
    }
    
FEATURES = {
        # Log-mel feature settings are now mostly inside the extraction function
        "sample_rate": 16000, 
        "n_mels": 224,
        "segment_length": 224
    }

MODEL = {
        # IMPORTANT: Replace with the actual path to your new model file
        "checkpoint_path": os.path.join(basedir, "models/prediction_models/cnn_lstm_logmel.pth"), 
        # You may or may not need a scaler with this new feature extraction
        "scaler_path": os.path.join(basedir, "preprocessors/min_max_scaler.pkl"), # This might be unused now
        "class_names": ['Control', 'Dementia'],
        # The input shape for the new model
        "input_shape": (3, FEATURES['n_mels'], FEATURES['segment_length']), 
        "num_classes": 1
    }
