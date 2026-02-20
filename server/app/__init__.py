"""Flask application factory."""

from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.middleware.error_handler import register_error_handlers


def create_app(config_class=Config):
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": config_class.CORS_ORIGINS}})

    register_error_handlers(app)

    from app.domain.ports import ImageTagger
    from app.adapters.imagga.imagga_adapter import ImaggaAdapter
    from app.application.analyze_image import AnalyzeImageUseCase
    from app.adapters.http.analyze_route import create_analyze_blueprint

    tagger: ImageTagger = ImaggaAdapter(
        api_key=app.config["IMAGGA_API_KEY"],
        api_secret=app.config["IMAGGA_API_SECRET"],
    )
    use_case = AnalyzeImageUseCase(tagger=tagger)

    analyze_bp = create_analyze_blueprint(use_case)
    app.register_blueprint(analyze_bp, url_prefix="/api")

    return app
