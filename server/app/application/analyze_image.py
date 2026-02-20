"""AnalyzeImage use case — core business logic for image analysis."""

from app.domain.models import AnalysisResult
from app.domain.ports import ImageTagger


class InvalidFileError(Exception):
    """Raised when the uploaded file is invalid."""

    def __init__(self, message: str, code: int = 400):
        self.message = message
        self.code = code
        super().__init__(self.message)


class AnalyzeImageUseCase:
    """Orchestrates image validation and tag extraction.

    Depends on an ImageTagger port — no knowledge of HTTP or external APIs.
    """

    ALLOWED_MIME_TYPES = {"image/jpeg", "image/png"}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

    def __init__(self, tagger: ImageTagger):
        self._tagger = tagger

    def execute(self, file_bytes: bytes, content_type: str) -> AnalysisResult:
        """Validate image and extract tags.

        Args:
            file_bytes: Raw bytes of the uploaded file.
            content_type: MIME type of the file.

        Returns:
            AnalysisResult with sorted tags.

        Raises:
            InvalidFileError: If file type or size is invalid.
        """
        self._validate(file_bytes, content_type)
        tags = self._tagger.get_tags(file_bytes, content_type)
        sorted_tags = sorted(tags, key=lambda t: t.confidence, reverse=True)
        return AnalysisResult(tags=sorted_tags)

    def _validate(self, file_bytes: bytes, content_type: str) -> None:
        if content_type not in self.ALLOWED_MIME_TYPES:
            raise InvalidFileError(
                f"Invalid file type '{content_type}'. "
                f"Allowed: {', '.join(self.ALLOWED_MIME_TYPES)}",
                code=400,
            )

        if len(file_bytes) > self.MAX_FILE_SIZE:
            max_mb = self.MAX_FILE_SIZE // (1024 * 1024)
            raise InvalidFileError(
                f"File size exceeds {max_mb}MB limit.",
                code=413,
            )
