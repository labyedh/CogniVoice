from flask import Blueprint
from ..controllers import public_controller

public_bp = Blueprint('public', __name__)

@public_bp.route('/partners', methods=['GET'])
def partners_public():
    return public_controller.list_public_partners()
