from flask import Blueprint
from app.utils.decorators import token_required
from ..controllers import analysis_controller
from ..services.sse_service import sse_service

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/predict', methods=['POST'])
@token_required
def predict():
    return analysis_controller.predict()

@analysis_bp.route('/progress/<request_id>', methods=['GET'])
def progress(request_id):
    return analysis_controller.sse_progress(sse_service, request_id)
