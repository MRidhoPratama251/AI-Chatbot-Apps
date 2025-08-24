# AI Chatbot MVP

## Overview

A modern, full-stack AI chatbot application built with React, TypeScript, and Express.js. The system provides a clean, minimalist interface for AI conversations with comprehensive user management, conversation organization, and AI personality customization. The architecture supports both real-time chat interactions and persistent data storage with PostgreSQL.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: TailwindCSS with custom CSS variables for theming (light/dark mode support)
- **State Management**: TanStack Query for server state management and React Context for theme state
- **Routing**: Wouter for lightweight client-side routing
- **Component Structure**: Modular architecture with organized folders:
  - `Chat/` - Main chat interface components (ChatArea, UserBubble, AIBubble, PromptInput)
  - `Sidebar/` - Navigation and conversation management
  - `Settings/` - User configuration dialogs with tabbed interface
  - `Common/` - Reusable components (EmptyState, FilePicker)

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **Mock Development**: In-memory storage implementation for development without database dependency
- **Build System**: ESBuild for production bundling with TypeScript compilation

### Database Schema Design
- **Users Table**: Stores user authentication, profile data, and AI preferences (personality, token limits, address style)
- **Conversations Table**: Manages chat sessions with titles, pinning status, and timestamps
- **Messages Table**: Stores individual chat messages with role-based content (user/assistant)
- **Token Usage Table**: Tracks daily AI token consumption for analytics and limits

### Authentication & Security
- **Session Management**: Built-in support for session-based authentication
- **Password Security**: Secure password hashing implementation ready
- **CORS Configuration**: Proper cross-origin request handling

### Real-time Features
- **Message Processing**: Asynchronous message handling with loading states
- **Live Updates**: Real-time conversation updates and message status
- **File Attachments**: Support for document and image uploads with validation

### AI Integration Architecture
- **Provider Abstraction**: Flexible AI model integration design
- **Personality System**: Configurable AI behavior modes (default, robot, cynic, expert)
- **Token Management**: Usage tracking and limit enforcement
- **Response Processing**: Message regeneration and editing capabilities

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe PostgreSQL ORM with migration support
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **wouter**: Lightweight React routing

### UI Component Libraries
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives (dialogs, dropdowns, forms, navigation)
- **lucide-react**: Modern icon library for consistent iconography
- **recharts**: Chart library for token usage analytics and visualizations

### Development & Build Tools
- **vite**: Fast build tool with HMR support
- **typescript**: Type safety across frontend and backend
- **tailwindcss**: Utility-first CSS framework
- **esbuild**: Fast JavaScript bundler for production builds

### Form & Validation
- **react-hook-form**: Performant form handling with minimal re-renders
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Runtime type validation and schema definition

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class composition
- **class-variance-authority**: Type-safe CSS variant management

### Backend-Specific Dependencies
- **express**: Web application framework
- **connect-pg-simple**: PostgreSQL session store
- **drizzle-kit**: Database migration and introspection tools