#!/usr/bin/env bash
# Render build script — runs from the repo root.
set -e

echo ">> Installing backend dependencies..."
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
cd ..

echo ">> Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo ">> Build complete."