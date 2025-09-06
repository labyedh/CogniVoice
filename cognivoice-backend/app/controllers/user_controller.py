import os, io, csv
from flask import jsonify, request, g, current_app, Response
from werkzeug.utils import secure_filename
from ..extensions import db
from ..models import User

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(fname):
    return '.' in fname and fname.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def history():
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
            'speechfeatures': {
                'pauseFrequency': a.pause_frequency, 'speechRate': a.speech_rate,
                'vocabularyComplexity': a.vocabulary_complexity, 'semanticFluency': a.semantic_fluency
            }
        }
    } for a in analyses])

def update_profile():
    user = g.current_user
    data = request.get_json() or {}
    user.first_name = data.get('firstName', user.first_name)
    user.last_name  = data.get('lastName',  user.last_name)
    user.email      = data.get('email',     user.email)
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})

def change_password():
    user = g.current_user
    data = request.get_json() or {}
    if not data.get('currentPassword') or not user.check_password(data['currentPassword']):
        return jsonify({'message': 'Incorrect current password'}), 400
    if data.get('newPassword') != data.get('confirmPassword'):
        return jsonify({'message': 'New passwords do not match'}), 400
    user.set_password(data['newPassword'])
    db.session.commit()
    return jsonify({'message': 'Password updated successfully'})

def upload_avatar():
    if 'avatar' not in request.files:
        return jsonify({'message': 'No file part in the request'}), 400
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique = f"user_{g.current_user.id}_{filename}"
        avatar_folder = os.path.join(current_app.config['INSTANCE_FOLDER'], 'avatars')
        os.makedirs(avatar_folder, exist_ok=True)
        path = os.path.join(avatar_folder, unique)
        file.save(path)
        url_path = f'/avatars/{unique}'
        user = g.current_user
        user.avatar_url = url_path
        db.session.commit()
        return jsonify({'message': 'Avatar updated successfully', 'avatarUrl': url_path}), 200
    return jsonify({'message': 'File type not allowed'}), 400

def export_history_csv():
    user = g.current_user
    analyses = user.analyses.order_by(db.desc('timestamp')).all()

    buf = io.StringIO()
    headers = ['analysis_id','timestamp','risk_level','final_prediction','confidence',
               'pause_frequency','speech_rate','vocabulary_complexity','semantic_fluency']
    writer = csv.DictWriter(buf, fieldnames=headers)
    writer.writeheader()
    for a in analyses:
        writer.writerow({
            'analysis_id': a.id,
            'timestamp': a.timestamp.isoformat(),
            'risk_level': a.risk_level,
            'final_prediction': a.final_prediction,
            'confidence': a.confidence,
            'pause_frequency': a.pause_frequency,
            'speech_rate': a.speech_rate,
            'vocabulary_complexity': a.vocabulary_complexity,
            'semantic_fluency': a.semantic_fluency
        })
    mem = io.BytesIO(buf.getvalue().encode('utf-8'))
    mem.seek(0); buf.close()
    return Response(mem, mimetype='text/csv',
        headers={"Content-Disposition": "attachment;filename=cognivoice_history.csv"})
