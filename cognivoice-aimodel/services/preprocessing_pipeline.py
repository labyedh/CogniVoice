import os
import subprocess
import logging
import shutil
from pydub import AudioSegment
import librosa
import soundfile as sf
import numpy as np
from pyannote.audio import Pipeline

logger = logging.getLogger(__name__)

class Preprocessor:
    def __init__(self, hf_token, device,pp_config):
        logger.info("Initializing Speaker Diarization pipeline...")
        # Use config from the Flask application context
        self.diarization_pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            use_auth_token=hf_token
        )
        self.diarization_pipeline.to(device)
        logger.info("Diarization pipeline loaded.")
        self.pp_config = pp_config
    def denoise(self, input_path, output_dir):
        logger.info(f"Step 1: Denoising {input_path}")
        model_name = self.pp_config["denoiser_model_path"]
        cmd = ['python', '-m', 'demucs.separate', '--out', output_dir, '-n', model_name, input_path]
        
        try:
            subprocess.run(cmd, check=True, capture_output=True, text=True)
            input_filename_without_ext = os.path.splitext(os.path.basename(input_path))[0]
            demucs_output_path = os.path.join(output_dir, model_name, input_filename_without_ext, "vocals.wav")

            if not os.path.exists(demucs_output_path):
                raise FileNotFoundError(f"Denoised file not found: {demucs_output_path}")

            final_denoised_path = os.path.join(output_dir, f"{input_filename_without_ext}_denoised.wav")
            shutil.move(demucs_output_path, final_denoised_path)
            shutil.rmtree(os.path.join(output_dir, model_name))
            
            logger.info(f"Denoising successful. Output: {final_denoised_path}")
            return final_denoised_path
        except subprocess.CalledProcessError as e:
            logger.error(f"Demucs execution failed. Stderr: {e.stderr}")
            raise

    """def diarize(self, input_path, output_path,pp_config):
        logger.info(f"Step 2: Diarizing {input_path}")
        num_speakers = self.pp_config["num_diarization_speakers"]
        diarization = self.diarization_pipeline(input_path, num_speakers=num_speakers)
        
        dominant_speaker = max(diarization.labels(), key=lambda s: sum(turn.end - turn.start for turn, _, spk in diarization.itertracks(yield_label=True) if spk == s))
        
        audio = AudioSegment.from_wav(input_path)
        dominant_audio = sum([audio[int(t.start*1000):int(t.end*1000)] for t, _, s in diarization.itertracks(yield_label=True) if s == dominant_speaker], AudioSegment.empty())
        dominant_audio.export(output_path, format="wav")
        logger.info(f"Diarization successful. Saved to {output_path}")
        return output_path"""

    def remove_silence(self, input_path, output_path):
        logger.info(f"Step 3: Removing silence from {input_path}")
        audio, sr = librosa.load(input_path, sr=None)
        top_db = self.pp_config["silence_top_db"]
        intervals = librosa.effects.split(audio, top_db=top_db)
        non_silent_audio = np.concatenate([audio[s:e] for s, e in intervals]) if len(intervals) > 0 else audio
        sf.write(output_path, non_silent_audio, sr)
        logger.info(f"Silence removal successful. Saved to {output_path}")
        return output_path

    def normalize(self, input_path, output_path):
        logger.info(f"Step 4: Normalizing {input_path}")
        y, sr = librosa.load(input_path, sr=None)
        norm_type = self.pp_config["normalization_type"]
        if norm_type == "rms":
            rms = np.sqrt(np.mean(y**2))
            y_norm = y / (rms + 1e-8) * 0.1
        else: # max
            y_norm = y / (np.max(np.abs(y)) + 1e-8)
        sf.write(output_path, y_norm, sr)
        logger.info(f"Normalization successful. Saved to {output_path}")
        return output_path

    def run_full_pipeline(self, input_path,temp_folder):
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        processing_dir = os.path.join(temp_folder, base_name)
        os.makedirs(processing_dir, exist_ok=True)

        # Step 1: Denoise
        denoised_path = self.denoise(input_path, processing_dir)
        
        # Step 2: Remove Silence (now acts on the denoised path)
        silence_removed_path = self.remove_silence(denoised_path, os.path.join(processing_dir, f"{base_name}_silence_removed.wav"))
        
        # Step 3: Normalize
        final_path = self.normalize(silence_removed_path, os.path.join(processing_dir, f"{base_name}_final.wav"))
        
        logger.info(f"Preprocessing pipeline (without diarization) complete. Final file: {final_path}")
        return final_path