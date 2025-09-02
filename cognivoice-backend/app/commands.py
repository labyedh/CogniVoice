import click
from flask.cli import with_appcontext
from .extensions import db
from .models import User
from flask import current_app

@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clears existing data and creates new tables and the default admin user."""
    click.confirm('This will delete all existing data. Are you sure?', abort=True)
    
    db.drop_all()
    db.create_all()
    
    admin_email = current_app.config['ADMIN_EMAIL']
    if User.query.filter_by(email=admin_email).first() is None:
        admin_user = User(
            email=admin_email,
            first_name=current_app.config['ADMIN_FIRST_NAME'],
            last_name=current_app.config['ADMIN_LAST_NAME'],
            role='admin',
            is_active=True
        )
        admin_user.set_password(current_app.config['ADMIN_PASSWORD'])
        db.session.add(admin_user)
        db.session.commit()
        click.echo(f'Initialized the database and created admin user: {admin_email}')
    else:
        click.echo('Database already initialized.')