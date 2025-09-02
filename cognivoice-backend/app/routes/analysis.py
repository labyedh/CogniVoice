import os
# --- CHANGE: Import gevent ---
import gevent
import requests
from flask import Blueprint, request, jsonify, Response, current_app, g
from app.services.sse_service import sse_service
from app.utils.decorators import token_required

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/predict', methods=['POST'])
@token_required
def predict():
    if 'audio' not in request.files or 'requestId' not in request.form:
        return jsonify({'error': 'Missing audio file or requestId'}), 400
    
    audio_file = request.files['audio']
    
    # IMPORTANT: We need to pass the user_id to the AI service so it can be
    # sent back in the webhook for saving to the database. We'll embed it in the request_id.
    audio_file = request.files['audio']
    request_id = request.form['requestId'] # This is the simple ID from the frontend
    user_id = g.current_user.id


    try:
        ai_service_url = current_app.config['AI_SERVICE_URL']
        files = {'audio': (audio_file.filename, audio_file.read(), audio_file.mimetype)}
        payload = {'request_id': request_id,'user_id': user_id}
        
        response = requests.post(f"{ai_service_url}/predict", files=files, data=payload, timeout=10)
        response.raise_for_status()

        # We return the original requestId to the frontend
        api_response = response.json()
        api_response['requestId'] = request_id
        # The response from the AI service is just a confirmation, which we forward
        return response.json(), response.status_code
        
    except requests.RequestException as e:
        return jsonify({"message": f"The AI analysis service is currently unavailable. Please try again later."}), 503

# The /progress route is correct and does not need changes
@analysis_bp.route('/progress/<request_id>')
def progress(request_id):
    def stream():
        # We need to use the modified service_request_id for the SSE subscription
        
        q = sse_service.subscribe(request_id)
        try:
            while True:
                data = q.get()
                yield f'data: {data}\n\n'
        finally:
            sse_service.unsubscribe(request_id, q)
            
    response = Response(stream(), mimetype='text/event-stream')
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['Connection'] = 'keep-alive'
    response.headers['X-Accel-Buffering'] = 'no'
    return response