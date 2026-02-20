"""Domain models — pure data structures, no external dependencies."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Tag:
    """A single image tag with its confidence score."""

    label: str
    confidence: float

    def to_dict(self) -> dict:
        return {"label": self.label, "confidence": round(self.confidence, 2)}


@dataclass(frozen=True)
class AnalysisResult:
    """The result of analyzing an image."""

    tags: list[Tag]

    def to_dict(self) -> dict:
        return {"tags": [tag.to_dict() for tag in self.tags]}
