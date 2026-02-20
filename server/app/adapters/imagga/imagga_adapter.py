"""Imagga driven adapter — implements ImageTagger port via Imagga REST API."""

import requests
from requests.auth import HTTPBasicAuth

from app.domain.models import Tag


class ExternalServiceError(Exception):
    """Raised when the external IA service fails."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class ImaggaAdapter:
    """Driven adapter that communicates with the Imagga API.

    Implements the ImageTagger protocol.
    """

    BASE_URL = "https://api.imagga.com/v2"
    TIMEOUT_SECONDS = 30

    def __init__(self, api_key: str, api_secret: str):
        self._auth = HTTPBasicAuth(api_key, api_secret)

    def get_tags(self, image_bytes: bytes, content_type: str) -> list[Tag]:
        """Send image to Imagga and return mapped Tag objects."""
        try:
            response = requests.post(
                f"{self.BASE_URL}/tags",
                auth=self._auth,
                files={"image": ("image", image_bytes, content_type)},
                timeout=self.TIMEOUT_SECONDS,
            )
        except requests.Timeout:
            raise ExternalServiceError("Image analysis timed out. Please try again.")
        except requests.ConnectionError:
            raise ExternalServiceError("Could not connect to image analysis service.")

        if response.status_code != 200:
            raise ExternalServiceError(
                f"Image analysis service returned status {response.status_code}."
            )

        return self._parse_response(response.json())

    def _parse_response(self, data: dict) -> list[Tag]:
        """Map Imagga API response to domain Tag models."""
        try:
            raw_tags = data["result"]["tags"]
        except (KeyError, TypeError):
            raise ExternalServiceError("Unexpected response format from analysis service.")

        return [
            Tag(
                label=item["tag"]["en"],
                confidence=item["confidence"],
            )
            for item in raw_tags
            if "tag" in item and "confidence" in item
        ]
