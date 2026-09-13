from flask import Flask, send_from_directory, send_file, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config.config import Config
import os

# Absolute path to the compiled React app (frontend/dist). Used only in
# production so Flask serves the whole site on one origin (no CORS/proxy).
FRONTEND_DIST = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), '..', 'frontend', 'dist'
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Extensions
    CORS(app)
    jwt = JWTManager(app)

    # Ensure upload folder exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Register Blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.cart import cart_bp
    from app.routes.orders import orders_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(cart_bp, url_prefix='/api/cart')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')

    @app.route('/backend/app/uploads/<path:filename>')
    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        # Extract just the filename if it's a full path
        clean_filename = filename.split('/')[-1]
        upload_dir = os.path.join(app.root_path, 'app', 'uploads')
        return send_from_directory(upload_dir, clean_filename)

    # ---- Production: serve the compiled React SPA from the same Flask process ----
    if os.path.isdir(os.path.join(FRONTEND_DIST, 'assets')):
        @app.route('/')
        def index():
            return send_file(os.path.join(FRONTEND_DIST, 'index.html'))

        @app.route('/assets/<path:filename>')
        def assets(filename):
            return send_from_directory(os.path.join(FRONTEND_DIST, 'assets'), filename)

        # SPA fallback: any non-API path returns the app shell (React Router handles it)
        @app.errorhandler(404)
        def spa_fallback(e):
            if request.path.startswith(('/api', '/uploads', '/backend')):
                return jsonify(msg='Not found'), 404
            if os.path.exists(os.path.join(FRONTEND_DIST, 'index.html')):
                return send_file(os.path.join(FRONTEND_DIST, 'index.html'))
            return jsonify(msg='Not found'), 404
    else:
        # Local dev (no build): keep the plain JSON root
        @app.route('/')
        def index():
            return {"message": "Mini E-commerce API is running"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
