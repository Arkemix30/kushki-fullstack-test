"""Unit tests for ImaggaAdapter — mocks HTTP calls to Imagga API."""

from unittest.mock import patch, MagicMock

import pytest

from app.adapters.imagga.imagga_adapter import ImaggaAdapter, ExternalServiceError


MOCK_IMAGGA_RESPONSE = {
    "result": {
        "tags": [
            {"confidence": 98.5, "tag": {"en": "Dog"}},
            {"confidence": 85.2, "tag": {"en": "Animal"}},
            {"confidence": 72.1, "tag": {"en": "Pet"}},
        ]
    },
    "status": {"text": "", "type": "success"},
}


class TestImaggaAdapter:
    """Test suite for the Imagga driven adapter."""

    @patch("app.adapters.imagga.imagga_adapter.requests.post")
    def test_successful_tag_extraction(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = MOCK_IMAGGA_RESPONSE
        mock_post.return_value = mock_response

        adapter = ImaggaAdapter(api_key="key", api_secret="secret")
        tags = adapter.get_tags(b"fake-image", "image/jpeg")

        assert len(tags) == 3
        assert tags[0].label == "Dog"
        assert tags[0].confidence == 98.5
        assert tags[2].label == "Pet"

    @patch("app.adapters.imagga.imagga_adapter.requests.post")
    def test_api_error_raises_external_service_error(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_post.return_value = mock_response

        adapter = ImaggaAdapter(api_key="key", api_secret="secret")

        with pytest.raises(ExternalServiceError) as exc_info:
            adapter.get_tags(b"fake-image", "image/jpeg")

        assert "status 500" in exc_info.value.message

    @patch("app.adapters.imagga.imagga_adapter.requests.post")
    def test_timeout_raises_external_service_error(self, mock_post):
        import requests
        mock_post.side_effect = requests.Timeout()

        adapter = ImaggaAdapter(api_key="key", api_secret="secret")

        with pytest.raises(ExternalServiceError) as exc_info:
            adapter.get_tags(b"fake-image", "image/jpeg")

        assert "timed out" in exc_info.value.message

    @patch("app.adapters.imagga.imagga_adapter.requests.post")
    def test_connection_error_raises_external_service_error(self, mock_post):
        import requests
        mock_post.side_effect = requests.ConnectionError()

        adapter = ImaggaAdapter(api_key="key", api_secret="secret")

        with pytest.raises(ExternalServiceError) as exc_info:
            adapter.get_tags(b"fake-image", "image/jpeg")

        assert "connect" in exc_info.value.message.lower()

    @patch("app.adapters.imagga.imagga_adapter.requests.post")
    def test_malformed_response_raises_external_service_error(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"unexpected": "format"}
        mock_post.return_value = mock_response

        adapter = ImaggaAdapter(api_key="key", api_secret="secret")

        with pytest.raises(ExternalServiceError) as exc_info:
            adapter.get_tags(b"fake-image", "image/jpeg")

        assert "Unexpected response" in exc_info.value.message
