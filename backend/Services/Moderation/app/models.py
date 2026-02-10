from pydantic import BaseModel


class ModerationRequest(BaseModel):
    title: str
    content: str


class ModerationResponse(BaseModel):
    approved: bool
    reason: str | None = None
    flags: list[str] = []
