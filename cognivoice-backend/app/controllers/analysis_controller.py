import requests
from flask import request, jsonify, Response, g
from ..services.analysis_service import AnalysisService

def predict():
    if 'audio' not in request.files or 'requestId' not in request.form:
        return jsonify({'error': 'Missing audio file or requestId'}), 400
    audio_file = request.files['audio']
    request_id = request.form['requestId']
    user_id = g.current_user.id
    try:
        resp = AnalysisService.forward_predict(audio_file, request_id, user_id)
        payload = resp.json()
        payload['requestId'] = request_id
        return payload, resp.status_code
    except requests.RequestException:
        return jsonify({"message": "The AI analysis service is currently unavailable. Please try again later."}), 503

def sse_progress(sse_service, request_id: str):
    def stream():
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
