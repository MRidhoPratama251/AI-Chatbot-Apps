```markdown
# 🧠 AI Chatbot MVP (Frontend)

A modern, minimalist AI chatbot frontend built with **React**, **TypeScript**, and **Vite**.  
This frontend connects to either a **mockup server** (for local development) or the real **backend service** once it’s ready.  

![AI Chatbot Interface](https://img.shields.io/badge/Status-Active-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)

---

## 🚀 Features

- **Real-time Conversations**: Multiple conversations with AI  
- **AI Personality Modes**: Default, Robot, Cynic, Expert  
- **Conversation Management**: Pin, delete, and search chats  
- **Message Actions**: Copy, edit, regenerate, download as file  
- **Responsive UI**: Desktop & mobile ready  
- **Token Usage Analytics**: Charts to track daily AI usage  
- **Profile & Preferences**: Avatar, theme, AI style, etc.  

---

## 🏗️ Frontend Architecture

### Folder Structure
```

frontend/
│
├── src/
│   ├── components/     # UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities (http.ts helpers, constants)
│   ├── pages/          # Page-level components
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx        # App entrypoint
│
├── index.html          # Main HTML template
│
├── server/                 # Mockup server (development only)
│   ├── index.ts            # Express server setup
│   ├── vite.ts             # Vite middleware integration
│   ├── storage.ts          # Mockup storage (using only temporary memory)
│   └── routes.ts           # Mockup API routes
│
├── shared/                 # Shared schemas (frontend ↔ mockup server)
│   └── schema.ts           # Data types (User, Message, etc.)
│
├── public/                 # Static assets
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
└── package.json

```

---

## 🔄 Mockup Server vs Backend

During development, the **frontend can run using the mockup server** (inside `frontend/server`) which uses in-memory data and the `shared/schema.ts` file.  

When the real **backend (FastAPI)** is built:
- The mockup server (`frontend/server/*`) will no longer be needed  
- The `shared/schema.ts` will be replaced by `backend/app/models/schema.py`  
- The API base URL will switch from mockup to backend via `.env`  

### Switching API Targets
- **Development (mockup server)**:
```

NEXT\_PUBLIC\_API\_BASE=[http://localhost:5000](http://localhost:5000)

```
- **Production (real backend)**:
```

NEXT\_PUBLIC\_API\_BASE=[http://localhost:8000](http://localhost:8000)

````

This is set inside `frontend/.env`.

---

## ⚙️ Environment Variables

Create a `.env` file in `frontend/`:

```env
# API endpoint (switch between mock server and backend)
NEXT_PUBLIC_API_BASE=http://localhost:5000
````

---

## 🛠️ Installation & Setup

### Prerequisites

* Node.js 18+
* npm or yarn

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-chatbot-mvp/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file**

   ```bash
   cp .env.example .env
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   * Opens app at `http://localhost:5000`
   * Uses **mockup server** by default

5. **Switch to backend later**

   * Update `.env` → `NEXT_PUBLIC_API_BASE=http://localhost:8000`
   * Remove/ignore `frontend/server` and `frontend/shared`

---

## 🖥️ Development Notes

* `frontend/server/index.ts` runs an Express server with Vite middleware.
* `frontend/server/vite.ts` handles serving `index.html` and hot reloading.
* If `src/main.tsx` is not found, check that `vite.config.ts` has the correct `root` set to `client`.
* The mockup server is temporary — once backend is ready, you can delete:

  * `frontend/server/*`
  * `frontend/shared/schema.ts`

---

## 🎨 Technology Stack

* **React 18** + TypeScript
* **Vite** for fast builds
* **TailwindCSS** + `shadcn/ui`
* **TanStack Query** for API state
* **Framer Motion** for animations
* **Recharts** for analytics

---

## 📖 Usage

### Conversations

* Create, pin, delete conversations
* Search past chats

### Messages

* Send user messages
* AI replies with personality (Default, Robot, Cynic, Expert)
* Edit, copy, download, or regenerate messages

### Settings

* Profile info (username, avatar, email, role)
* AI preferences (tokens, style, personality)
* Theme switch (light/dark/system)
* Token usage analytics

---

## 🔧 Migration Path

1. **Now (development)** → Uses **mockup server + shared schema.ts**
2. **Later (backend ready)** → Switch `.env` to backend API, remove mock files
3. **Final** → Frontend consumes FastAPI backend directly

---

## 📄 License

This project is licensed under the MIT License.
See [LICENSE](LICENSE) for details.

---

## 🙋 Support

* Documentation in this README
* Report issues in GitHub
* Ask questions in Discussions

---
