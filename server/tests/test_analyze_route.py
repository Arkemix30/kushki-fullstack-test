"""Integration tests for the /api/analyze endpoint using Flask test client."""

import io

import pytest
from flask import Flask
from flask_cors import CORS

from app.config import TestConfig
from app.domain.models import Tag
from app.application.analyze_image import AnalyzeImageUseCase
from app.adapters.http.analyze_route import create_analyze_blueprint
from app.middleware.error_handler import register_error_handlers


class FakeTagger:
    """Test double for integration tests."""

    def get_tags(self, image_bytes: bytes, content_type: str) -> list[Tag]:
        return [
            Tag(label="Dog", confidence=0.98),
            Tag(label="Animal", confidence=0.85),
        ]


class FailingTagger:
    """Test double that simulates an external service failure."""

    def get_tags(self, image_bytes: bytes, content_type: str) -> list[Tag]:
        from app.adapters.imagga.imagga_adapter import ExternalServiceError

        raise ExternalServiceError("Service unavailable")


def _create_test_app(tagger):
    """Build a minimal Flask app with the given tagger injected."""
    app = Flask(__name__)
    app.config.from_object(TestConfig)
    CORS(app)
    register_error_handlers(app)

    use_case = AnalyzeImageUseCase(tagger=tagger)
    bp = create_analyze_blueprint(use_case)
    app.register_blueprint(bp, url_prefix="/api")

    return app


@pytest.fixture
def client():
    """Flask test client with fake tagger."""
    app = _create_test_app(FakeTagger())
    with app.test_client() as test_client:
        yield test_client


@pytest.fixture
def failing_client():
    """Flask test client with failing tagger."""
    app = _create_test_app(FailingTagger())
    with app.test_client() as test_client:
        yield test_client


def _make_image(filename="test.jpg", content_type="image/jpeg", size=1024):
    """Helper to create a fake image file for upload."""
    data = b"x" * size
    return (io.BytesIO(data), filename, content_type)


class TestAnalyzeRoute:
    """Integration tests for POST /api/analyze."""

    def test_valid_image_returns_200_with_tags(self, client):
        stream, filename, content_type = _make_image()
        response = client.post(
            "/api/analyze",
            data={"image": (stream, filename, content_type)},
            content_type="multipart/form-data",
        )

        assert response.status_code == 200
        data = response.get_json()
        assert "tags" in data
        assert len(data["tags"]) == 2
        assert data["tags"][0]["label"] == "Dog"
        assert data["tags"][0]["confidence"] == 0.98

    def test_no_file_returns_400(self, client):
        response = client.post("/api/analyze", content_type="multipart/form-data")

        assert response.status_code == 400
        data = response.get_json()
        assert data["error"]["code"] == 400

    def test_invalid_mime_returns_400(self, client):
        stream, filename, _ = _make_image(filename="test.txt", content_type="text/plain")
        response = client.post(
            "/api/analyze",
            data={"image": (stream, filename, "text/plain")},
            content_type="multipart/form-data",
        )

        assert response.status_code == 400

    def test_file_too_large_returns_413(self, client):
        stream, filename, content_type = _make_image(size=6 * 1024 * 1024)
        response = client.post(
            "/api/analyze",
            data={"image": (stream, filename, content_type)},
            content_type="multipart/form-data",
        )

        assert response.status_code == 413

    def test_external_service_failure_returns_502(self, failing_client):
        stream, filename, content_type = _make_image()
        response = failing_client.post(
            "/api/analyze",
            data={"image": (stream, filename, content_type)},
            content_type="multipart/form-data",
        )

        assert response.status_code == 502
        data = response.get_json()
        assert data["error"]["code"] == 502
