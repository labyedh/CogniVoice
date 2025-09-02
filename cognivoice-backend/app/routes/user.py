import os
from flask import Blueprint, jsonify, request, g, current_app,Response
import io
import csv
from werkzeug.utils import secure_filename
from ..extensions import db
from ..utils.decorators import token_required
from ..models import User # <-- Added missing model import

user_bp = Blueprint('user', __name__)

@user_bp.route('/history', methods=['GET'])
@token_required
def get_history():
    user = g.current_user
    analyses = user.analyses.order_by(db.desc('timestamp')).all()
    return jsonify([{
        'id': f'analysis_{a.id}', 'riskLevel': a.risk_level,
        'recommendations': [
            'Consider consulting with a healthcare professional for further evaluation.',
            'Regular cognitive exercises may be beneficial for maintaining brain health.',
            'Maintain social engagement and mental stimulation through hobbies and activities.'
        ],
        'timestamp': a.timestamp.isoformat() + "Z",
        'backendData': {
            'fileName': a.file_name, 'finalPrediction': a.final_prediction,
            'confidence': str(a.confidence), 'voteCounts': {'Control': 0, 'Dementia': 0},
            'speechfeatures': { 'pauseFrequency': a.pause_frequency, 'speechRate': a.speech_rate,
                                'vocabularyComplexity': a.vocabulary_complexity, 'semanticFluency': a.semantic_fluency }
        }
    } for a in analyses])

@user_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    user = g.current_user
    data = request.get_json()
    user.first_name = data.get('firstName', user.first_name)
    user.last_name = data.get('lastName', user.last_name)
    user.email = data.get('email', user.email)
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})

@user_bp.route('/profile/password', methods=['PUT'])
@token_required
def change_password():
    user = g.current_user
    data = request.get_json()
    if not data.get('currentPassword') or not user.check_password(data['currentPassword']):
        return jsonify({'message': 'Incorrect current password'}), 400
    if data.get('newPassword') != data.get('confirmPassword'):
        return jsonify({'message': 'New passwords do not match'}), 400
    user.set_password(data['newPassword'])
    db.session.commit()
    return jsonify({'message': 'Password updated successfully'})

# --- AVATAR UPLOAD LOGIC ---
# The letter 'A' before this line was a syntax error and has been removed.
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@user_bp.route('/profile/avatar', methods=['POST'])
@token_required
def upload_avatar():
    if 'avatar' not in request.files:
        return jsonify({'message': 'No file part in the request'}), 400
    
    file = request.files['avatar']
    
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"user_{g.current_user.id}_{filename}"
        
        avatar_folder = os.path.join(current_app.config['INSTANCE_FOLDER'], 'avatars')
        os.makedirs(avatar_folder, exist_ok=True)
        filepath = os.path.join(avatar_folder, unique_filename)
        file.save(filepath)

        avatar_url_path = f'/avatars/{unique_filename}'
        user = g.current_user
        user.avatar_url = avatar_url_path
        db.session.commit()
        
        return jsonify({'message': 'Avatar updated successfully', 'avatarUrl': avatar_url_path}), 200
    else:
        return jsonify({'message': 'File type not allowed'}), 400
    
@user_bp.route('/history/export', methods=['GET'])
@token_required
def export_user_history():
    """
    Fetches the current user's entire analysis history and returns it
    as a CSV file for download.
    """
    try:
        # 1. Get the current user from the request context
        user = g.current_user
        # Fetch all analyses for this user
        analyses = user.analyses.order_by(db.desc('timestamp')).all()

        # 2. Create a CSV file in memory
        string_io = io.StringIO()
        
        headers = [
            'analysis_id', 'timestamp', 'risk_level', 'final_prediction', 'confidence',
            'pause_frequency', 'speech_rate', 'vocabulary_complexity', 'semantic_fluency'
        ]
        
        writer = csv.DictWriter(string_io, fieldnames=headers)
        writer.writeheader()

        # 3. Write each analysis as a row in the CSV
        for analysis in analyses:
            writer.writerow({
                'analysis_id': analysis.id,
                'timestamp': analysis.timestamp.isoformat(),
                'risk_level': analysis.risk_level,
                'final_prediction': analysis.final_prediction,
                'confidence': analysis.confidence,
                'pause_frequency': analysis.pause_frequency,
                'speech_rate': analysis.speech_rate,
                'vocabulary_complexity': analysis.vocabulary_complexity,
                'semantic_fluency': analysis.semantic_fluency
            })

        # 4. Prepare the HTTP response for file download
        mem = io.BytesIO()
        mem.write(string_io.getvalue().encode('utf-8'))
        mem.seek(0)
        string_io.close()

        return Response(
            mem,
            mimetype='text/csv',
            headers={
                "Content-Disposition": "attachment;filename=cognivoice_history.csv"
            }
        )
    except Exception as e:
        print(f"Error exporting user history for user {g.current_user.id}: {e}")
        return jsonify({"message": "Failed to export history."}), 500
