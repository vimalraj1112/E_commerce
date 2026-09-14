#!/usr/bin/env python
"""Create (or update to) an admin user. Run with:
   ADMIN_EMAIL=... ADMIN_PASSWORD=... python create_admin.py
Uses the same Atlas DB as the app, so the admin works on both local and Render.
Password is taken from the environment — never hardcode secrets here."""
import os
import sys
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

email = os.environ.get('ADMIN_EMAIL')
password = os.environ.get('ADMIN_PASSWORD')
name = os.environ.get('ADMIN_NAME', 'Administrator')

if not email or not password:
    sys.exit('Usage: set ADMIN_EMAIL and ADMIN_PASSWORD env vars, then rerun.')

# Reuse the app's own DB + hashing so credentials work identically.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.models.user import User
from werkzeug.security import generate_password_hash

if User.find_by_email(email):
    User.collection.update_one(
        {"email": email},
        {"$set": {"password": generate_password_hash(password), "role": "admin", "name": name}},
    )
    print(f"Updated existing '{email}' to admin role.")
else:
    User.create_user(email, password, name, role='admin')
    print(f"Created admin '{email}'.")
print("Done.")