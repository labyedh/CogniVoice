from flask import Blueprint, request, jsonify, current_app
from app.services.sse_service import sse_service
from app.models import Analysis
from app.extensions import db

internal_bp = Blueprint('internal', __name__, url_prefix='/internal')

@internal_bp.route('/progress-update', methods=['POST'])
def receive_progress_update():
    data = request.get_json()
    if not data or data.get('secret_key') != current_app.config['INTERNAL_API_SECRET']:
        return jsonify({"message": "Forbidden"}), 403
        
    request_id = data.get('request_id')
    user_id = data.get('user_id') # <-- Get the user_id from the webhook
    update = data.get('update')

    if not all([request_id, user_id, update]):
        return jsonify({"message": "Invalid payload"}), 400
        
    sse_service.publish(request_id, update)
    
    if update.get('is_final') and update.get('result') and not update['result'].get('error'):
        try:
            result_data = update['result']
            
            # --- THIS IS THE FIX ---
            # Manually map the dictionary keys to the model's attributes
            new_analysis = Analysis(
                user_id=user_id,
                risk_level=result_data.get('riskLevel'),
                final_prediction=result_data.get('finalPrediction'),
                confidence=float(result_data.get('confidence', 0)),
                file_name=result_data.get('fileName'), # <-- Maps 'fileName' to 'file_name'
                pause_frequency=result_data.get('speechfeatures', {}).get('pauseFrequency'),
                speech_rate=result_data.get('speechfeatures', {}).get('speechRate'),
                vocabulary_complexity=result_data.get('speechfeatures', {}).get('vocabularyComplexity'),
                semantic_fluency=result_data.get('speechfeatures', {}).get('semanticFluency')
            )
            # --- END OF FIX ---

            db.session.add(new_analysis)
            db.session.commit()
            print(f"[{request_id}] Final result saved to database for user {user_id}.")
        except Exception as e:
            db.session.rollback() # Rollback on error
            print(f"[{request_id}] CRITICAL: Failed to save final result to database. Error: {e}")

    return jsonify({"message": "Update received"}), 200