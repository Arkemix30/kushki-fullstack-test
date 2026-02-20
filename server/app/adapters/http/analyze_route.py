"""HTTP driving adapter — Flask blueprint for the /api/analyze endpoint."""

from flask import Blueprint, jsonify, request

from app.application.analyze_image import AnalyzeImageUseCase, InvalidFileError


def create_analyze_blueprint(use_case: AnalyzeImageUseCase) -> Blueprint:
    """Factory that creates the analyze blueprint with injected use case."""

    bp = Blueprint("analyze", __name__)

    @bp.route("/analyze", methods=["POST"])
    def analyze():
        if "image" not in request.files:
            return jsonify({"error": {"code": 400, "message": "No image file provided."}}), 400

        file = request.files["image"]
        if not file.filename:
            return jsonify({"error": {"code": 400, "message": "Empty filename."}}), 400

        file_bytes = file.read()
        content_type = file.content_type or ""

        try:
            result = use_case.execute(file_bytes, content_type)
            return jsonify(result.to_dict()), 200
        except InvalidFileError as e:
            return jsonify({"error": {"code": e.code, "message": e.message}}), e.code

    return bp
