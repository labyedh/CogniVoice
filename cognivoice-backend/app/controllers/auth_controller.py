from flask import request, jsonify, current_app
from ..services.auth_service import AuthService

def register():
    data = request.get_json() or {}
    required = ['email', 'password', 'firstName', 'lastName']
    if not all(k in data for k in required):
        return jsonify({'message': 'Missing data'}), 400
    user, err = AuthService.register_user(
        data['email'], data['password'], data['firstName'], data['lastName'],
        current_app.config['ADMIN_EMAIL']
    )
    if err:
        msg, code = err
        return jsonify({'message': msg}), code
    return jsonify(AuthService.generate_token_and_payload(user)), 201

def login():
    data = request.get_json() or {}
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Could not verify'}), 401
    user, err = AuthService.login(data['email'], data['password'])
    if err:
        msg, code = err
        return jsonify({'message': msg}), code
    return jsonify(AuthService.generate_token_and_payload(user))
