from .models import ModerationRequest, ModerationResponse

BANNED_WORDS: list[str] = [
    "violenza"
]


def moderate(request: ModerationRequest) -> ModerationResponse:
    for word in BANNED_WORDS:
        if word in request.content:
            return ModerationResponse(approved=False, reason=word)
        if word in request.title:
            return ModerationResponse(approved=False, reason=word)
    return ModerationResponse(approved=True)
