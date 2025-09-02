import jwt
from datetime import datetime, timedelta, timezone
from flask import Blueprint, request, jsonify, current_app
from ..extensions import db
from ..models import User

auth_bp = Blueprint('auth', __name__)

def generate_token_and_user_data(user):
    token = jwt.encode({'user_id': user.id, 'exp': datetime.now(timezone.utc) + timedelta(hours=24)},
                       current_app.config['SECRET_KEY'], "HS256")
    return {'token': token, 'user': {
        'id': str(user.id), 'email': user.email, 'firstName': user.first_name,
        'lastName': user.last_name, 'role': user.role, 'createdAt': user.created_at.isoformat() + "Z",
        'avatarUrl': user.avatar_url 
    }}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(k in data for k in ['email', 'password', 'firstName', 'lastName']):
        return jsonify({'message': 'Missing data'}), 400
    if data['email'] == current_app.config['ADMIN_EMAIL']:
        return jsonify({'message': 'This email address is reserved.'}), 403
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User with this email already exists'}), 409

    user = User(email=data['email'], first_name=data['firstName'], last_name=data['lastName'], is_active=True)
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(generate_token_and_user_data(user)), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Could not verify'}), 401

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    if not user.is_active:
        return jsonify({'message': 'Account is inactive'}), 403

    user.last_login = datetime.utcnow()
    db.session.commit()
    return jsonify(generate_token_and_user_data(user))