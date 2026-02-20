"""Domain models — pure data structures, no external dependencies."""

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Tag(BaseModel):
    """A single image tag with its confidence score."""

    model_config = ConfigDict(frozen=True)

    label: str
    confidence: float

    @field_validator("confidence")
    @classmethod
    def round_confidence(cls, v: float) -> float:
        """Round confidence to 2 decimal places."""
        return round(v, 2)


class AnalysisResult(BaseModel):
    """The result of analyzing an image."""

    model_config = ConfigDict(frozen=True)

    tags: list[Tag]
