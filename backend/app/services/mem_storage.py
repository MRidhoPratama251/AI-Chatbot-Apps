from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel

# Definisikan model data untuk penyimpanan in-memory
class UserData(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    role: str = "user"

class ConversationData(BaseModel):
    id: int
    user_id: int
    title: str
    is_pinned: bool = False
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

class MessageData(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime = datetime.now()

class MemStorage:
    def __init__(self):
        self.users: Dict[int, UserData] = {}
        self.conversations: Dict[int, ConversationData] = {}
        self.messages: Dict[int, MessageData] = {}
        self.next_user_id = 1
        self.next_conversation_id = 1
        self.next_message_id = 1
        self.init_sample_data()

    def init_sample_data(self):
        # Tambahkan pengguna contoh
        user = self.create_user("demo_user", "demo@example.com")
        
        # Tambahkan percakapan contoh
        conv1 = self.create_conversation(user.id, "Crude apa saja yang diolah pa...")

        # Tambahkan pesan contoh
        self.create_message(conv1.id, "user", "Crude apa saja yang diolah pada bulan Mei 2025 ?")
        self.create_message(conv1.id, "assistant", "Pada bulan Mei 2025, unit pengolahan di Kilang Cilacap...")

    # --- User Methods ---
    def get_user(self, user_id: int) -> Optional[UserData]:
        return self.users.get(user_id)

    def create_user(self, username: str, email: Optional[str] = None) -> UserData:
        user_id = self.next_user_id
        self.next_user_id += 1
        user = UserData(id=user_id, username=username, email=email)
        self.users[user_id] = user
        return user

    # --- Conversation Methods ---
    def get_conversations(self, user_id: int) -> List[ConversationData]:
        # Filter berdasarkan user_id dan urutkan
        return sorted(
            [conv for conv in self.conversations.values() if conv.user_id == user_id],
            key=lambda x: x.updated_at,
            reverse=True
        )

    def create_conversation(self, user_id: int, title: str) -> ConversationData:
        conv_id = self.next_conversation_id
        self.next_conversation_id += 1
        conversation = ConversationData(id=conv_id, user_id=user_id, title=title)
        self.conversations[conv_id] = conversation
        return conversation

    def update_conversation(self, conv_id: int, title: Optional[str] = None, is_pinned: Optional[bool] = None):
        conversation = self.conversations.get(conv_id)
        if conversation:
            if title is not None:
                conversation.title = title
            if is_pinned is not None:
                conversation.is_pinned = is_pinned
            conversation.updated_at = datetime.now()

    def delete_conversation(self, conv_id: int):
        if conv_id in self.conversations:
            # Hapus pesan yang terkait
            self.messages = {msg_id: msg for msg_id, msg in self.messages.items() if msg.conversation_id != conv_id}
            # Hapus percakapan
            del self.conversations[conv_id]
            return True
        return False

    # --- Message Methods ---
    def get_messages(self, conv_id: int) -> List[MessageData]:
        # Filter berdasarkan conversation_id dan urutkan
        return sorted(
            [msg for msg in self.messages.values() if msg.conversation_id == conv_id],
            key=lambda x: x.created_at
        )

    def create_message(self, conv_id: int, role: str, content: str) -> MessageData:
        msg_id = self.next_message_id
        self.next_message_id += 1
        message = MessageData(id=msg_id, conversation_id=conv_id, role=role, content=content)
        self.messages[msg_id] = message

        # Perbarui timestamp percakapan
        self.update_conversation(conv_id, None, None)

        # Tambahkan logika ini: Perbarui judul jika ini adalah pesan pertama pengguna
        # dan judulnya masih default.
        conversation = self.conversations.get(conv_id)
        if conversation and conversation.title == "New Conversation" and role == "user":
            # Potong judul menjadi 25 karakter
            new_title = content[:25]
            if len(content) > 25:
                new_title += "..."
            conversation.title = new_title
            
        return message

# Buat instance tunggal untuk digunakan di seluruh aplikasi
storage = MemStorage()