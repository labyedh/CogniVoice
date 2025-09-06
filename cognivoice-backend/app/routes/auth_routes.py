from flask import Blueprint
from ..controllers import auth_controller

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    return auth_controller.register()

@auth_bp.route('/login', methods=['POST'])
def login():
    return auth_controller.login()
