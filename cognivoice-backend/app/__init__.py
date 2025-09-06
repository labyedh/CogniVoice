import os
import shutil
from flask import Flask
from .config import Config
from .extensions import db, migrate, bcrypt
from flask_cors import CORS

def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)
    from flask_cors import CORS

    CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173", "https://yourdomain.com"]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )


    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    print("--- Initializing: Cleaning and creating directories ---")
    for d in [app.config['UPLOAD_FOLDER'], app.config['TEMP_PROCESSING_FOLDER'], app.config['STATIC_PREDICTIONS_FOLDER']]:
        if os.path.exists(d): shutil.rmtree(d)
        os.makedirs(d, exist_ok=True)

    with app.app_context():
        from .routes import auth_bp, analysis_bp, admin_bp, user_bp, public_bp,internal_bp  # <-- 1. IMPORT IT
        app.register_blueprint(auth_bp)
        app.register_blueprint(analysis_bp)
        app.register_blueprint(user_bp)
        app.register_blueprint(admin_bp, url_prefix='/admin')
        app.register_blueprint(public_bp) # <-- 2. REGISTER IT
        app.register_blueprint(internal_bp)
        from .commands import init_db_command
        app.cli.add_command(init_db_command)
        
        
    from flask import send_from_directory

    @app.route('/avatars/<filename>')
    def uploaded_avatars(filename):
        avatar_folder = os.path.join(app.config['INSTANCE_FOLDER'], 'avatars')
        return send_from_directory(avatar_folder, filename)
    return app