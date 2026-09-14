from flask import request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user import User
from werkzeug.security import check_password_hash
import datetime

def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    # SECURITY: never trust a client-supplied role. Everyone registers as a
    # normal 'user'; admins are created server-side only (see create_admin.py).
    role = 'user'

    if not email or not password or not name:
        return jsonify({"msg": "Missing required fields"}), 400

    if User.find_by_email(email):
        return jsonify({"msg": "Email already exists"}), 400

    User.create_user(email, password, name, role)
    return jsonify({"msg": "User registered successfully"}), 201

def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.find_by_email(email)
    if not user or not check_password_hash(user['password'], password):
        return jsonify({"msg": "Invalid email or password"}), 401

    access_token = create_access_token(
        identity=str(user['_id']),
        additional_claims={"role": user['role'], "name": user['name']}
    )
    
    return jsonify({
        "access_token": access_token,
        "user": {
            "id": str(user['_id']),
            "email": user['email'],
            "name": user['name'],
            "role": user['role']
        }
    }), 200
