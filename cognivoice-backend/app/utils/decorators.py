from functools import wraps
from flask import request, jsonify, g, current_app
from app.models import User
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # --- THIS IS THE FINAL CORS FIX (PART 2) ---
        # Allow all OPTIONS requests to pass through for CORS preflight.
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)
        # --- END OF FIX ---

        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
            g.current_user = current_user
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except Exception as e:
            return jsonify({'message': f'Token is invalid: {e}'}), 401

        return f(*args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    @token_required # This decorator already includes the token_required logic
    def decorated(*args, **kwargs):
        # We need to handle the OPTIONS case here too, because decorators are chained.
        if request.method == 'OPTIONS':
            return f(*args, **kwargs)

            
        if g.current_user.role != 'admin':
            return jsonify({'message': 'Admin access required!'}), 403
        return f(*args, **kwargs)
    return decorated