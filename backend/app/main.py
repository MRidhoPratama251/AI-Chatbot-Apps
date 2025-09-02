# File: backend/app/main.py

from fastapi import FastAPI
from app.api import routes_chat, routes_user

app = FastAPI(title="AI Chatbot Backend")

# Register routers with the correct /api prefix
app.include_router(routes_chat.router, prefix="/api", tags=["chat"])
app.include_router(routes_user.router, prefix="/api", tags=["user"])

# Define the root endpoint
@app.get("/")
def root():
    return {"message": "AI Chatbot Backend running 🚀"}