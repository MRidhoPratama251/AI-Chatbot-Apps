from fastapi import FastAPI
from app.api import routes_chat

app = FastAPI(title="AI Chatbot Backend")

# Register routers
app.include_router(routes_chat.router, prefix="/chat", tags=["chat"])


@app.get("/")
def root():
    return {"message": "AI Chatbot Backend running 🚀"}
