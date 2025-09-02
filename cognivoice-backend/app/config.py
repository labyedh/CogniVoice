import os
import torch
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    # --- Flask & General App Config ---
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'instance', 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    INSTANCE_FOLDER = os.path.join(basedir, 'instance')

    UPLOAD_FOLDER = os.path.join(INSTANCE_FOLDER, 'uploads')
    TEMP_PROCESSING_FOLDER = os.path.join(INSTANCE_FOLDER, 'temp_processing')
    STATIC_PREDICTIONS_FOLDER = os.path.join(INSTANCE_FOLDER, 'static_predictions')

    # --- Single Admin Account Config ---
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
    ADMIN_FIRST_NAME = os.environ.get('ADMIN_FIRST_NAME')
    ADMIN_LAST_NAME = os.environ.get('ADMIN_LAST_NAME')

    # --- ML & Audio Config (from your original config.py) ---
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    HF_AUTH_TOKEN = os.environ.get('HF_AUTH_TOKEN') # IMPORTANT: Add your token to .env
    AI_SERVICE_URL = os.environ.get('AI_SERVICE_URL')
    INTERNAL_API_SECRET = os.environ.get('INTERNAL_API_SECRET')
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
