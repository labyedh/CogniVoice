from flask import Blueprint
from ..controllers import internal_controller

internal_bp = Blueprint('internal', __name__, url_prefix='/internal')

@internal_bp.route('/progress-update', methods=['POST'])
def progress_update():
    return internal_controller.progress_update()
