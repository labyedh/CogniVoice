from flask import Blueprint
from app.utils.decorators import token_required
from ..controllers import user_controller

user_bp = Blueprint('user', __name__)

@user_bp.route('/history', methods=['GET'])
@token_required
def history():
    return user_controller.history()

@user_bp.route('/history/export', methods=['GET'])
@token_required
def export_history():
    return user_controller.export_history_csv()

@user_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    return user_controller.update_profile()

@user_bp.route('/profile/password', methods=['PUT'])
@token_required
def change_password():
    return user_controller.change_password()

@user_bp.route('/profile/avatar', methods=['POST'])
@token_required
def upload_avatar():
    return user_controller.upload_avatar()
