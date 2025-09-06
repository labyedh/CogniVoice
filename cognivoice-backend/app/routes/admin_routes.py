from flask import Blueprint
from app.utils.decorators import  admin_required
from ..controllers import admin_controller

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def stats():
    return admin_controller.stats()

@admin_bp.route('/users', methods=['GET'])
@admin_required
def list_users():
    return admin_controller.list_users()

@admin_bp.route('/users', methods=['POST'])
@admin_required
def create_user():
    return admin_controller.create_user()

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    return admin_controller.update_user(user_id)

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    return admin_controller.delete_user(user_id)

@admin_bp.route('/partners', methods=['GET'])
@admin_required
def partners_list():
    return admin_controller.list_partners()

@admin_bp.route('/partners', methods=['POST'])
@admin_required
def partners_create():
    return admin_controller.create_partner()

@admin_bp.route('/partners/<int:partner_id>', methods=['PUT'])
@admin_required
def partners_update(partner_id):
    return admin_controller.update_partner(partner_id)

@admin_bp.route('/partners/<int:partner_id>', methods=['DELETE'])
@admin_required
def partners_delete(partner_id):
    return admin_controller.delete_partner(partner_id)
@admin_bp.route('/activity/recent', methods=['GET'])
@admin_required
def recent_activity():
    return admin_controller.recent_activity()
@admin_bp.route('/users/export', methods=['GET'])
@admin_required
def users_export():
    return admin_controller.export_users_csv()