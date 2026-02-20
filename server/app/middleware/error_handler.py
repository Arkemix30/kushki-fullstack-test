"""Global error handlers for the Flask application."""

from flask import Flask, jsonify

from app.adapters.imagga.imagga_adapter import ExternalServiceError


def register_error_handlers(app: Flask) -> None:
    """Register global error handlers on the Flask app."""

    @app.errorhandler(ExternalServiceError)
    def handle_external_service_error(error: ExternalServiceError):
        return jsonify({"error": {"code": 502, "message": error.message}}), 502

    @app.errorhandler(413)
    def handle_payload_too_large(_error):
        return jsonify({"error": {"code": 413, "message": "File size exceeds limit."}}), 413

    @app.errorhandler(404)
    def handle_not_found(_error):
        return jsonify({"error": {"code": 404, "message": "Resource not found."}}), 404

    @app.errorhandler(500)
    def handle_internal_error(_error):
        return jsonify({"error": {"code": 500, "message": "Internal server error."}}), 500
