from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# ----- User Schemas -----
class UserCreate(BaseModel):
    username: str
    password: str
    email: Optional[str] = None


class UserOut(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    role: Optional[str] = "user"


# ----- Chat / Conversation Schemas -----
class MessageCreate(BaseModel):
    conversation_id: Optional[int] = None
    role: str  # "user" | "assistant"
    content: str
    attachments: Optional[List[str]] = None


class MessageOut(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime


class ChatResponse(BaseModel):
    conversation_id: int
    user_message: str
    ai_response: str


# Tambahkan model ini ke dalam file schema.py Anda
class ConversationCreate(BaseModel):
    title: str

class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    is_pinned: Optional[bool] = None

class ConversationOut(BaseModel):
    id: int
    user_id: int
    title: str
    is_pinned: bool
    created_at: datetime
    updated_at: datetime

class MessageOut(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime
