# AI Chatbot MVP

## Overview

A modern, full-stack AI chatbot application built with React, TypeScript, and Express.js. The system provides a clean, minimalist interface for AI conversations with comprehensive user management, conversation organization, and AI personality customization. The application features real-time messaging, file attachments, token usage tracking, and a responsive design optimized for both desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript and Vite as the build tool for fast development and optimized production builds
- **UI Components**: Radix UI primitives with shadcn/ui component library providing accessible, customizable components with consistent design patterns
- **Styling**: TailwindCSS with CSS custom properties for theming, supporting both light and dark modes with persistent user preferences
- **State Management**: TanStack Query for server state management, caching, and synchronization, with React Context for client-side theme state
- **Routing**: Wouter for lightweight client-side routing with minimal bundle impact
- **Component Architecture**: Modular design with organized folders - Chat components for messaging interface, Sidebar for navigation, Settings for configuration dialogs, and Common for reusable utilities

### Backend Architecture
- **Development Stack**: Express.js server with TypeScript for type safety and development efficiency
- **API Design**: RESTful endpoints following standard HTTP conventions with proper status codes and error handling
- **Development Mode**: In-memory storage implementation for rapid prototyping without database dependencies
- **Production Ready**: Drizzle ORM integration prepared for PostgreSQL with type-safe database operations
- **Build System**: ESBuild for fast production bundling with TypeScript compilation
- **Development Tools**: Vite middleware integration for hot module replacement and seamless frontend-backend development

### Database Schema Design
- **Users Table**: Comprehensive user management with authentication fields, profile customization (photo, role), and AI preferences (personality modes, token limits, communication style)
- **Conversations Table**: Chat session management with titles, pinning functionality, and timestamp tracking for organization
- **Messages Table**: Individual message storage with role-based content (user/assistant), file attachment support, and chronological ordering
- **Token Usage Table**: Daily consumption tracking for analytics, usage limits, and billing integration

### Authentication & Security
- **Session Management**: Built-in Express session support with configurable storage backends
- **Password Security**: Secure hashing implementation with industry-standard practices
- **API Security**: Request validation, CORS configuration, and proper error handling
- **Database Security**: Prepared statements through Drizzle ORM preventing SQL injection

### AI Integration Architecture
- **Provider Abstraction**: Flexible design supporting multiple AI model providers (OpenRouter, OpenAI, etc.)
- **Personality System**: Configurable AI behavior modes including default, robot, cynic, and expert personalities
- **Token Management**: Usage tracking, limit enforcement, and cost monitoring for sustainable operation
- **Message Processing**: Asynchronous handling with loading states and error recovery

### Real-time Features
- **Message Flow**: Optimistic updates with server reconciliation for responsive user experience
- **File Handling**: Upload validation, size limits, and type restrictions with progress feedback
- **Live Updates**: Real-time conversation synchronization and message status updates
- **Error Handling**: Graceful degradation with retry mechanisms and user notifications

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL with Neon serverless hosting for scalable, managed database operations
- **ORM**: Drizzle ORM with drizzle-kit for migrations, providing type-safe database interactions
- **UI Framework**: Radix UI component primitives ensuring accessibility and consistent behavior
- **Styling**: TailwindCSS for utility-first styling with PostCSS for processing

### AI Services
- **Primary Provider**: OpenRouter API for accessing multiple LLM models with unified interface
- **Model Support**: Qwen models and other open-source alternatives for cost-effective AI interactions
- **Fallback Options**: Configurable provider switching for reliability and cost optimization

### Development Tools
- **Build Tools**: Vite for frontend bundling, ESBuild for backend compilation
- **Type Safety**: TypeScript with strict configuration and Zod for runtime validation
- **Development**: Hot module replacement, error overlays, and debugging tools
- **Package Management**: NPM with lock file for reproducible builds

### Monitoring & Analytics
- **Query Management**: TanStack Query for caching, background updates, and optimistic updates
- **Error Tracking**: Built-in error boundaries and logging infrastructure
- **Performance**: Code splitting, lazy loading, and bundle optimization
- **User Experience**: Toast notifications, loading states, and responsive design patterns