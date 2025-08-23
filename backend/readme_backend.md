# 🚀 AI Chatbot Backend

This is the **backend service** for the AI Chatbot MVP.  
It provides authentication, conversation management, message handling, AI model integration, and token usage tracking.  

The backend is built using **FastAPI** and follows a modular, clean-architecture folder structure.  

---

## 📂 Project Structure

```

backend/
├── app/
│   ├── __init__.py
│   ├── main.py               # Application entrypoint (FastAPI instance)
│   ├── api/
│   │   ├── routes_chat.py    # Endpoints for chat messages (send/receive)
│   │   ├── routes_auth.py    # Endpoints for authentication (signup/login)
│   │   └── routes_user.py    # Endpoints for user profile & preferences
│   │
│   ├── core/
│   │   ├── config.py         # Configuration (ENV variables, DB settings)
│   │   └── dependencies.py   # Shared dependencies (DB session, auth middleware)
│   │
│   ├── models/
│   │   ├── schema.py         # Pydantic models (request/response validation)
│   │   └── db_models.py      # SQLAlchemy ORM models (tables)
│   │
│   ├── services/
│   │   ├── chat_service.py   # Core chatbot logic (calls AI model, saves msg)
│   │   ├── user_service.py   # Business logic for users
│   │   └── usage_service.py  # Token usage tracking
│   │
│   ├── storage/
│   │   └── database.py       # Database connection & session management
│   │
│   └── utils/
│       └── security.py       # Password hashing, JWT auth utils
│
├── tests/                    # Unit and integration tests
│   ├── test_auth.py
│   ├── test_chat.py
│   └── test_user.py
│
├── requirements.txt          # Python dependencies
├── alembic/                  # (Optional) Migrations if using Alembic
└── README.md                 # Documentation (this file)

````

---

## 📖 File Explanations

### `app/main.py`
- Entrypoint of the application.  
- Creates FastAPI app, registers routes, configures middleware (CORS, logging, etc.).  
- Example:
  ```python
  from fastapi import FastAPI
  from app.api import routes_auth, routes_chat, routes_user

  app = FastAPI(title="AI Chatbot Backend")

  app.include_router(routes_auth.router, prefix="/auth", tags=["auth"])
  app.include_router(routes_user.router, prefix="/users", tags=["users"])
  app.include_router(routes_chat.router, prefix="/chat", tags=["chat"])
````

---

### `app/api/`

Contains all API routes (controllers).

* **routes\_auth.py**

  * `/auth/signup` → register a user
  * `/auth/login` → authenticate & return JWT token

* **routes\_user.py**

  * `/users/me` → get current user info
  * `/users/preferences` → update AI preferences

* **routes\_chat.py**

  * `/chat/send` → send user message, call AI, save & return response
  * `/chat/history/{conversation_id}` → fetch conversation messages

---

### `app/core/`

* **config.py**

  * Loads environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.).
* **dependencies.py**

  * Provides reusable dependencies for DB session, auth, etc.

---

### `app/models/`

* **schema.py** (Pydantic models for request/response)
  Example:

  ```python
  from pydantic import BaseModel
  from typing import Optional, List

  class UserCreate(BaseModel):
      username: str
      password: str
      email: Optional[str]

  class Message(BaseModel):
      role: str  # "user" | "assistant"
      content: str
      attachments: Optional[List[str]] = None
  ```

* **db\_models.py** (SQLAlchemy ORM)

  * Defines actual database tables (users, conversations, messages, token\_usage).

---

### `app/services/`

* **chat\_service.py**

  * Handles chat logic: save user message, call AI engine, save AI reply, track tokens.
* **user\_service.py**

  * Handles user operations: create user, update profile, fetch user by ID.
* **usage\_service.py**

  * Records and reports token usage.

---

### `app/storage/database.py`

* Manages database connection (PostgreSQL, SQLite, etc.).
* Provides SQLAlchemy session.

---

### `app/utils/security.py`

* Password hashing (bcrypt).
* JWT token creation & verification.

---

### `tests/`

* Unit tests for routes and services.
* Example: `test_chat.py` ensures `/chat/send` stores messages and calls AI correctly.

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/`:

```
DATABASE_URL=postgresql+asyncpg://user:password@localhost/chatbot
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
AI_MODEL_ENDPOINT=http://localhost:8001/generate  # or OpenAI API
```

---

## ▶️ Running the Backend

1. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server**

   ```bash
   uvicorn app.main:app --reload
   ```

3. **Access API docs**

   ```
   http://localhost:8000/docs
   ```

---

## 🔄 Transition from Mockup Server

Once this backend is running:

* Frontend should switch API base URL from the **mockup server** (`frontend/server/index.ts`) to the **Python backend** (`http://localhost:8000`).
* Old mockup files (`frontend/server/*`, `frontend/shared/schema.ts`) can be removed.
* Only `backend/app/models/schema.py` will define the schemas.