from .models import ModerationRequest, ModerationResponse
import nh3

BANNED_WORDS: list[str] = [
    "violenza"
]


def moderate(request: ModerationRequest) -> ModerationResponse:
    if nh3.clean(request.title) != request.title:
        return ModerationResponse(approved=False, reason="Rilevato codice HTML o caratteri non ammessi nel titolo")

    if nh3.clean(request.content) != request.content:
        return ModerationResponse(approved=False, reason="Rilevato codice HTML o caratteri non ammessi nel contenuto")

    title_lower = request.title.lower()
    content_lower = request.content.lower()

    for word in BANNED_WORDS:
        if word in content_lower:
            return ModerationResponse(approved=False, reason=word)
        if word in title_lower:
            return ModerationResponse(approved=False, reason=word)
    return ModerationResponse(approved=True)
