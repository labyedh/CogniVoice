import requests
from flask import current_app
from ..services.sse_service import sse_service
from ..repositories.analysis_repository import AnalysisRepository
from ..models import Analysis

class AnalysisService:
    @staticmethod
    def forward_predict(audio_file, request_id: str, user_id: int):
        ai_service_url = current_app.config['AI_SERVICE_URL']
        files = {'audio': (audio_file.filename, audio_file.read(), audio_file.mimetype)}
        payload = {'request_id': request_id, 'user_id': user_id}
        resp = requests.post(f"{ai_service_url}/predict", files=files, data=payload, timeout=10)
        resp.raise_for_status()
        return resp

    @staticmethod
    def handle_progress_update(secret_ok: bool, request_id: str, user_id: int, update: dict):
        if not secret_ok:
            return ('Forbidden', 403)

        if not (request_id and user_id and update):
            return ('Invalid payload', 400)

        sse_service.publish(request_id, update)

        if update.get('is_final') and update.get('result') and not update['result'].get('error'):
            try:
                r = update['result']
                entity = Analysis(
                    user_id=user_id,
                    risk_level=r.get('riskLevel'),
                    final_prediction=r.get('finalPrediction'),
                    confidence=float(r.get('confidence', 0)),
                    file_name=r.get('fileName'),
                    pause_frequency=r.get('speechfeatures', {}).get('pauseFrequency'),
                    speech_rate=r.get('speechfeatures', {}).get('speechRate'),
                    vocabulary_complexity=r.get('speechfeatures', {}).get('vocabularyComplexity'),
                    semantic_fluency=r.get('speechfeatures', {}).get('semanticFluency'),
                )
                AnalysisRepository.create(entity)
            except Exception:
                # repo handles rollback if needed; keep log in controller
                raise
        return ('Update received', 200)
