"""Unit tests for AnalyzeImageUseCase — tests the domain logic with a mock adapter."""

import pytest

from app.application.analyze_image import AnalyzeImageUseCase, InvalidFileError
from app.domain.models import Tag


class FakeTagger:
    """Test double that implements ImageTagger protocol."""

    def __init__(self, tags: list[Tag] | None = None, error: Exception | None = None):
        self.tags = tags or [
            Tag(label="Dog", confidence=0.98),
            Tag(label="Golden Retriever", confidence=0.95),
            Tag(label="Animal", confidence=0.90),
        ]
        self.error = error
        self.called_with: tuple[bytes, str] | None = None

    def get_tags(self, image_bytes: bytes, content_type: str) -> list[Tag]:
        self.called_with = (image_bytes, content_type)
        if self.error:
            raise self.error
        return self.tags


class TestAnalyzeImageUseCase:
    """Test suite for the core use case."""

    def test_valid_image_returns_sorted_tags(self):
        tagger = FakeTagger(tags=[
            Tag(label="Animal", confidence=0.80),
            Tag(label="Dog", confidence=0.98),
        ])
        use_case = AnalyzeImageUseCase(tagger=tagger)

        result = use_case.execute(b"fake-image-bytes", "image/jpeg")

        assert len(result.tags) == 2
        assert result.tags[0].label == "Dog"
        assert result.tags[0].confidence == 0.98
        assert result.tags[1].label == "Animal"

    def test_valid_png_accepted(self):
        tagger = FakeTagger()
        use_case = AnalyzeImageUseCase(tagger=tagger)

        result = use_case.execute(b"fake-png", "image/png")

        assert len(result.tags) == 3
        assert tagger.called_with == (b"fake-png", "image/png")

    def test_invalid_mime_type_raises_400(self):
        use_case = AnalyzeImageUseCase(tagger=FakeTagger())

        with pytest.raises(InvalidFileError) as exc_info:
            use_case.execute(b"fake-file", "text/plain")

        assert exc_info.value.code == 400
        assert "Invalid file type" in exc_info.value.message

    def test_file_too_large_raises_413(self):
        use_case = AnalyzeImageUseCase(tagger=FakeTagger())
        large_file = b"x" * (6 * 1024 * 1024)  # 6 MB

        with pytest.raises(InvalidFileError) as exc_info:
            use_case.execute(large_file, "image/jpeg")

        assert exc_info.value.code == 413
        assert "exceeds" in exc_info.value.message

    def test_tagger_called_with_correct_args(self):
        tagger = FakeTagger()
        use_case = AnalyzeImageUseCase(tagger=tagger)

        use_case.execute(b"my-image", "image/jpeg")

        assert tagger.called_with == (b"my-image", "image/jpeg")

    def test_result_to_dict_format(self):
        tagger = FakeTagger(tags=[Tag(label="Cat", confidence=0.95)])
        use_case = AnalyzeImageUseCase(tagger=tagger)

        result = use_case.execute(b"fake", "image/jpeg")

        assert result.model_dump() == {"tags": [{"label": "Cat", "confidence": 0.95}]}
