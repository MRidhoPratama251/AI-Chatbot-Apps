# Backend Configuration Guidelines for AI Chatbot MVP

## 1. Overview
This document provides configuration guidelines and requirements for backend developers working on the AI Chatbot MVP. The frontend has been structured according to the modular component architecture, and this backend should integrate seamlessly with the existing client-side implementation.

## 2. Technology Stack Requirements

### Core Technologies
- **Runtime**: Node.js 18+ or Python 3.9+
- **Framework**: Express.js (Node.js) or FastAPI (Python)
- **Database**: PostgreSQL 14+ with Drizzle ORM or SQLAlchemy
- **Authentication**: JWT tokens or session-based auth
- **WebSocket**: Socket.io or native WebSocket for real-time features
- **File Storage**: Local filesystem or cloud storage (AWS S3, Cloudinary)

### Optional Enhancements
- **Caching**: Redis for session management and rate limiting
- **Queue System**: Bull (Node.js) or Celery (Python) for background jobs
- **Monitoring**: Winston/Morgan for logging
- **API Documentation**: Swagger/OpenAPI 3.0

## 3. Database Schema Requirements

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  profile_photo TEXT,
  role VARCHAR(100),
  ai_preferences JSONB DEFAULT '{
    "maxTokens": 1024,
    "personality": "default",
    "addressStyle": "casual"
  }',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Token Usage Table
```sql
CREATE TABLE token_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost DECIMAL(10,4) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. API Endpoints Specification

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

### User Management
```
GET    /api/user           # Get current user profile
PATCH  /api/user           # Update user profile
DELETE /api/user           # Delete user account
```

### Conversation Management
```
GET    /api/conversations                    # List user conversations
POST   /api/conversations                    # Create new conversation
GET    /api/conversations/:id                # Get specific conversation
PATCH  /api/conversations/:id                # Update conversation (title, pin status)
DELETE /api/conversations/:id                # Delete conversation
```

### Message Management
```
GET    /api/conversations/:id/messages       # Get conversation messages
POST   /api/conversations/:id/messages       # Send new message
PATCH  /api/messages/:id                     # Edit message (user messages only)
DELETE /api/messages/:id                     # Delete message
```

### AI Integration
```
POST   /api/ai/chat                          # Process AI chat request
POST   /api/ai/regenerate/:messageId         # Regenerate AI response
```

### Token Usage & Analytics
```
GET    /api/token-usage                      # Get user token usage history
GET    /api/token-usage/summary              # Get usage summary with date range
```

### File Upload
```
POST   /api/upload                           # Upload attachment files
GET    /api/files/:id                        # Download/view uploaded files
DELETE /api/files/:id                        # Delete uploaded files
```

## 5. Configuration Parameters

### Environment Variables Required
```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ai_chatbot
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ai_chatbot
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password

# Authentication
JWT_SECRET=your-super-secure-jwt-secret
SESSION_SECRET=your-session-secret
SESSION_TIMEOUT=86400  # 24 hours in seconds

# AI Service Configuration
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=4096
AI_SERVICE_TIMEOUT=30000  # 30 seconds

# File Upload Configuration
UPLOAD_MAX_SIZE=10485760  # 10MB in bytes
UPLOAD_ALLOWED_TYPES=image/*,application/pdf,.doc,.docx,.txt
UPLOAD_STORAGE_PATH=./uploads
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name  # Optional

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_MAX_AI_REQUESTS=20

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379
REDIS_SESSION_PREFIX=ai_chatbot:session:

# Security
BCRYPT_SALT_ROUNDS=12
COOKIE_SECURE=false  # Set to true in production with HTTPS
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict
```

### AI Service Integration Configuration
```javascript
// Example AI service configuration
const AI_CONFIG = {
  provider: 'openai',  // 'openai' | 'anthropic' | 'huggingface' | 'local'
  models: {
    default: 'gpt-3.5-turbo',
    advanced: 'gpt-4',
    code: 'gpt-3.5-turbo'
  },
  personalities: {
    default: {
      systemPrompt: "You are a helpful AI assistant...",
      temperature: 0.7
    },
    robot: {
      systemPrompt: "You are an efficient, precise AI assistant...",
      temperature: 0.3
    },
    cynic: {
      systemPrompt: "You are a critical and analytical AI assistant...",
      temperature: 0.8
    },
    expert: {
      systemPrompt: "You are a technical expert AI assistant...",
      temperature: 0.5
    }
  },
  limits: {
    maxTokensPerRequest: 4096,
    maxRequestsPerHour: 100,
    maxTokensPerDay: 50000
  }
};
```

## 6. Real-time Features (WebSocket)

### WebSocket Events
```javascript
// Client -> Server Events
'message:send'     // Send new message
'conversation:join'  // Join conversation room
'conversation:leave' // Leave conversation room
'typing:start'     // User started typing
'typing:stop'      // User stopped typing

// Server -> Client Events
'message:new'      // New message received
'message:updated'  // Message was edited
'message:deleted'  // Message was deleted
'typing:user'      // Another user is typing
'ai:thinking'      // AI is processing
'ai:response'      // AI response ready
'error'           // Error occurred
```

## 7. Security Requirements

### Authentication & Authorization
- Implement JWT or session-based authentication
- Password hashing using bcrypt with minimum 12 salt rounds
- Rate limiting for login attempts (5 attempts per 15 minutes)
- CSRF protection for session-based auth
- Input validation and sanitization for all endpoints

### Data Protection
- SQL injection prevention (use parameterized queries)
- XSS protection (sanitize HTML content)
- File upload validation (type, size, malicious content scanning)
- Secure headers (CORS, CSP, HSTS in production)
- User data isolation (users can only access their own data)

### API Security
- Rate limiting per user and per endpoint
- Request size limits
- Input validation using schema validation (Joi, Yup, or Zod)
- Error handling without sensitive data exposure
- Logging of security events

## 8. Performance Requirements

### Response Time Targets
- User authentication: < 200ms
- Database queries: < 100ms
- AI responses: < 30 seconds
- File uploads: < 5 seconds for 10MB files
- WebSocket message delivery: < 50ms

### Scalability Considerations
- Database connection pooling
- Caching frequently accessed data
- Asynchronous AI request processing
- File compression for storage optimization
- Database indexing on frequently queried fields

## 9. Error Handling & Logging

### Error Response Format
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

### Logging Requirements
- Request/response logging with correlation IDs
- Error logging with stack traces
- Performance metrics (response times, database query times)
- Security events (failed logins, suspicious activities)
- AI service usage tracking

## 10. Testing Requirements

### Test Coverage Targets
- Unit tests: 80%+ coverage
- Integration tests for all API endpoints
- Database migration tests
- AI service integration tests
- File upload/download tests
- Authentication flow tests

### Test Data Requirements
- Sample users with different roles
- Test conversations with various message types
- Mock AI responses for testing
- File upload test cases
- Rate limiting test scenarios

## 11. Deployment Configuration

### Production Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://production_connection_string
JWT_SECRET=production-jwt-secret-256-bit-minimum
SESSION_SECRET=production-session-secret
COOKIE_SECURE=true
CORS_ORIGIN=https://your-production-domain.com
LOG_LEVEL=warn
```

### Health Check Endpoints
```
GET /health              # Basic health check
GET /health/detailed     # Detailed system health
GET /health/db          # Database connectivity check
GET /health/ai          # AI service connectivity check
```

## 12. Documentation Requirements

### API Documentation
- OpenAPI/Swagger specification
- Request/response examples
- Authentication flow documentation
- Error code reference
- Rate limiting documentation

### Development Setup
- Local development environment setup guide
- Database setup and migration instructions
- Environment variable configuration
- Testing setup and execution
- Debugging guidelines

## 13. Integration Guidelines

### Frontend Integration Points
- Authentication state management
- Real-time WebSocket connection handling
- File upload progress tracking
- Error state management
- Offline/online state handling

### Third-party Service Integration
- AI service provider setup (OpenAI, Anthropic, etc.)
- File storage service configuration
- Email service for notifications (optional)
- Analytics service integration (optional)

## 14. Monitoring & Maintenance

### Monitoring Requirements
- API endpoint response times
- Database query performance
- AI service response times and success rates
- File storage usage
- User activity metrics
- Error rates and types

### Maintenance Tasks
- Database backup and recovery procedures
- Log rotation and archival
- AI service usage optimization
- Performance monitoring and alerting
- Security updates and patches

---

## Notes for Backend Developer

1. **Priority Implementation Order**:
   - Authentication system
   - User and conversation management
   - Basic messaging functionality
   - AI integration
   - File upload
   - Real-time features
   - Advanced analytics

2. **Testing Strategy**: Implement comprehensive testing from the beginning, especially for authentication and data isolation.

3. **AI Service Integration**: Design the AI integration to be provider-agnostic to allow for easy switching between different AI services.

4. **Performance Optimization**: Implement caching and database optimization early to handle concurrent users effectively.

5. **Security First**: Implement all security measures from the beginning rather than adding them later.

This configuration should provide a solid foundation for building a production-ready backend that integrates seamlessly with the modular frontend architecture.