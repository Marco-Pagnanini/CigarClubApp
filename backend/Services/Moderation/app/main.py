from fastapi import FastAPI
from .models import ModerationRequest, ModerationResponse
from .moderation import moderate
import uvicorn

app = FastAPI(title="CigarClub - Moderation Service", version="1.0.0")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/moderate", response_model=ModerationResponse)
def moderate_content(request: ModerationRequest):
    return moderate(request)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)