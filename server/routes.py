from flask import Blueprint, request, jsonify
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from app import db
from models import User
home_bp = Blueprint('home', __name__)
@home_bp.route('/', methods=['GET'])
def handle_home():
    return 'Hello World!'


user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['POST'], strict_slashes=False)
def add_user():
    data = request.get_json()

    # Check for required fields
    required_fields = ['username', 'password', 'role']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Check if the username is unique
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400

    # Sanitize inputs and set defaults
    created_at = data.get('created_at')
    if not created_at:
        created_at = datetime.utcnow()  # Default to the current timestamp
    else:
        try:
            created_at = datetime.fromisoformat(created_at)  # Convert ISO 8601 string to datetime
        except ValueError:
            return jsonify({"error": "Invalid date format for 'created_at'"}), 400

    status = data.get('status', True)  # Default to True if not provided
    if isinstance(status, str):
        status = status.lower() in ['true', '1', 'yes']  # Convert strings to boolean

    # Create a new User instance
    new_user = User(
        username=data['username'],
        password=data['password'],  # Ensure passwords are hashed in production
        role=data['role'],
        created_at=created_at,
        status=status
    )

    try:
        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()

        # Return the newly created user's information
        return jsonify({
            "id": new_user.id,
            "username": new_user.username,
            "role": new_user.role,
            "created_at": new_user.created_at.isoformat(),
            "status": new_user.status
        }), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500