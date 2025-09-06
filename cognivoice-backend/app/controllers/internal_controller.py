from flask import request, jsonify, current_app
from ..services.analysis_service import AnalysisService

def progress_update():
    data = request.get_json() or {}
    secret_ok = (data.get('secret_key') == current_app.config['INTERNAL_API_SECRET'])
    request_id = data.get('request_id')
    user_id = data.get('user_id')
    update = data.get('update')
    try:
        msg, code = AnalysisService.handle_progress_update(secret_ok, request_id, user_id, update)
        if code != 200:
            return jsonify({"message": msg}), code
        return jsonify({"message": msg}), 200
    except Exception as e:
        # logged here to avoid silent failures
        print(f"[{request_id}] CRITICAL: Failed to save final result. Error: {e}")
        return jsonify({"message": "Internal error"}), 500
