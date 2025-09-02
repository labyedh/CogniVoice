import os
import shutil
import logging
import joblib
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Form, HTTPException
from dotenv import load_dotenv
from contextlib import asynccontextmanager # 1. Import the context manager

# Import your config and services
from config_ai import MODEL, FEATURES, PREPROCESSING, DEVICE, HF_AUTH_TOKEN
from services.preprocessing_pipeline import Preprocessor
from services.prediction_pipeline import load_model_from_checkpoint
from services.analysis_service_ai import run_analysis_pipeline_ai

load_dotenv('.env_ai')

# This dictionary will hold our models after they are loaded.
ml_models = {}

# 2. Define the lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This block of code runs ONCE, on startup
    print("--- AI Service Lifespan Event: Startup ---")
    os.makedirs('uploads_ai', exist_ok=True)
    os.makedirs('temp_processing_ai', exist_ok=True)
    
    # Load all the models into the global dictionary
    ml_models["predictor"] = load_model_from_checkpoint(MODEL["checkpoint_path"], MODEL, DEVICE)
    ml_models["scaler"] = joblib.load(MODEL["scaler_path"])
    ml_models["preprocessor"] = Preprocessor(HF_AUTH_TOKEN, DEVICE, PREPROCESSING)
    logging.info("--- AI Service: Models loaded successfully. ---")
    
    # The 'yield' signals that the startup is complete and the app can start accepting requests.
    yield
    
    

# 3. Attach the lifespan manager to the FastAPI app
app = FastAPI(title="CogniVoice AI Service", lifespan=lifespan)

# REMOVED: The old @app.on_event("startup") decorator and load_models function are gone.

@app.post("/predict")
async def create_prediction_job(
    background_tasks: BackgroundTasks,
    request_id: str = Form(...),
    user_id: int = Form(...), 
    audio: UploadFile = File(...)
):
    upload_folder = 'uploads_ai'
    file_path = os.path.join(upload_folder, f"{request_id}_{audio.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(audio.file, buffer)

    background_tasks.add_task(
        run_analysis_pipeline_ai, 
        file_path, 
        request_id, 
        user_id, # <-- Pass user_id to the background task
        ml_models
    )
    return {"message": "AI analysis job queued", "request_id": request_id}

    return {"message": "AI analysis job queued", "request_id": request_id}