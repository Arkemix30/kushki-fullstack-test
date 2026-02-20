"""Ports — contracts that the domain expects from the outside world."""

from typing import Protocol

from app.domain.models import Tag


class ImageTagger(Protocol):
    """Driven port: any service that can analyze an image and return tags."""

    def get_tags(self, image_bytes: bytes, content_type: str) -> list[Tag]:
        """Analyze an image and return descriptive tags.

        Args:
            image_bytes: Raw image bytes.
            content_type: MIME type of the image (e.g. 'image/jpeg').

        Returns:
            A list of Tag objects sorted by confidence descending.

        Raises:
            ExternalServiceError: If the external service fails.
        """
        ...
