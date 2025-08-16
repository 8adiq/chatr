# Chatr - Full Stack Application Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Local Development Setup](#local-development-setup)
6. [Docker Configuration](#docker-configuration)
7. [Production Deployment](#production-deployment)
8. [API Documentation](#api-documentation)
9. [Database Management](#database-management)
10. [Environment Variables](#environment-variables)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## 🎯 Project Overview

**Chatr** is a full-stack social media application built with FastAPI (backend) and React (frontend). The application supports user authentication, social features like posts, comments, and likes, and is fully containerized with Docker for both development and production environments.

### 🌐 Live Application
- **Frontend**: https://auth-app-frontend-rh30.onrender.com
- **Backend API**: https://auth-app-backend-udya.onrender.com
- **Database**: PostgreSQL on Render

### ✨ Key Features
- User registration and authentication with JWT tokens
- Social features: posts, comments, and likes
- Responsive React frontend with modern UI
- Containerized deployment with Docker
- CORS-enabled cross-origin communication
- Database migrations with Alembic
- Production-ready with health checks

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (PostgreSQL)  │
│   Container     │    │   Container     │    │   (Render)      │
│   Nginx         │    │   Uvicorn       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Architecture Components

1. **Frontend Container**: React app served by Nginx
2. **Backend Container**: FastAPI application with Uvicorn
3. **Database**: PostgreSQL hosted on Render
4. **Load Balancer**: Render's built-in load balancing
5. **CDN**: Static assets served via Render's CDN

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.10)
- **Database ORM**: SQLAlchemy
- **Authentication**: JWT tokens
- **Password Hashing**: bcrypt
- **Migrations**: Alembic
- **CORS**: FastAPI CORS middleware
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Fetch API
- **State Management**: React Query
- **Styling**: CSS modules
- **Server**: Nginx (production)

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Cloud Platform**: Render
- **Database**: PostgreSQL (Render)
- **Version Control**: Git
- **CI/CD**: Render Blueprint deployment

---

## 📁 Project Structure

```
auth-app-fastapi/
├── app/                          # FastAPI backend application
│   ├── __init__.py
│   ├── main.py                   # FastAPI app entry point
│   ├── database/
│   │   ├── __init__.py
│   │   └── main.py              # Database configuration
│   ├── users/                    # User management module
│   │   ├── __init__.py
│   │   ├── models.py            # User SQLAlchemy model
│   │   ├── routes.py            # User API endpoints
│   │   ├── schema.py            # User Pydantic schemas
│   │   └── service.py           # User business logic
│   ├── posts/                    # Posts module
│   │   ├── __init__.py
│   │   ├── models.py            # Post SQLAlchemy model
│   │   ├── routes.py            # Post API endpoints
│   │   ├── schema.py            # Post Pydantic schemas
│   │   └── service.py           # Post business logic
│   ├── comments/                 # Comments module
│   │   ├── __init__.py
│   │   ├── models.py            # Comment SQLAlchemy model
│   │   ├── routes.py            # Comment API endpoints
│   │   ├── schema.py            # Comment Pydantic schemas
│   │   └── service.py           # Comment business logic
│   ├── likes/                    # Likes module
│   │   ├── __init__.py
│   │   ├── models.py            # Like SQLAlchemy model
│   │   ├── routes.py            # Like API endpoints
│   │   ├── schema.py            # Like Pydantic schemas
│   │   └── service.py           # Like business logic
│   └── auth/                     # Authentication module
│       ├── __init__.py
│       ├── routes.py            # Auth API endpoints
│       ├── schema.py            # Auth Pydantic schemas
│       └── service.py           # Auth business logic
├── auth-app-frontend/            # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility libraries
│   │   ├── utils/              # Helper functions
│   │   ├── api.js              # API client configuration
│   │   ├── App.jsx             # Main React component
│   │   └── main.jsx            # React entry point
│   ├── Dockerfile              # Frontend Docker configuration
│   ├── nginx.conf              # Nginx configuration
│   ├── package.json            # Node.js dependencies
│   └── vite.config.js          # Vite configuration
├── migrations/                  # Database migrations
│   ├── env.py
│   ├── script.py.mako
│   └── versions/               # Migration files
├── Dockerfile                  # Backend Docker configuration
├── docker-compose.yaml         # Local development orchestration
├── render.yaml                 # Production deployment blueprint
├── requirements.txt            # Python dependencies
├── alembic.ini                 # Alembic configuration
├── manage_migrations.py        # Migration management script
├── reset_database.py           # Database reset utility
├── .dockerignore               # Docker build exclusions
├── .gitignore                  # Git exclusions
└── README.md                   # Basic project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd auth-app-fastapi
```

### 2. Backend Setup

#### Option A: Direct Python Setup
```bash
# Create virtual environment
python -m venv fenv
source fenv/bin/activate  # On Windows: fenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="sqlite:///users.db"
export SECRET_KEY="your-secret-key-here"
export CORS_ALLOWED_ORIGINS="http://localhost:5173"

# Run migrations
python manage_migrations.py init
python manage_migrations.py migrate "Initial migration"
python manage_migrations.py upgrade

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Option B: Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### 3. Frontend Setup

#### Option A: Direct Node.js Setup
```bash
cd auth-app-frontend
npm install
npm run dev
```

#### Option B: Docker Setup
```bash
# Already handled by docker-compose.yaml
```

### 4. Access the Application
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000 (Docker) or http://localhost:5173 (direct)

---

## 🐳 Docker Configuration

### Backend Dockerfile (`/Dockerfile`)
```dockerfile
FROM python:3.10.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/* 

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app/ ./app/
COPY alembic.ini .
COPY manage_migrations.py .

# Environment variables
ENV PYTHONPATH=/app
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile (`/auth-app-frontend/Dockerfile`)
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose (`/docker-compose.yaml`)
```yaml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SECRET_KEY=${SECRET_KEY}
      - ACCESS_TOKEN_EXPIRES_MINUTES=${ACCESS_TOKEN_EXPIRES_MINUTES}
      - ACCESS_TOKEN_EXPIRES_DAYS=${ACCESS_TOKEN_EXPIRES_DAYS}

  frontend:
    build: ./auth-app-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Nginx Configuration (`/auth-app-frontend/nginx.conf`)
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to backend
    location /api/ {
        proxy_pass https://auth-app-backend-udya.onrender.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

---

## ☁️ Production Deployment

### Render Platform Configuration

#### Render Blueprint (`/render.yaml`)
```yaml
services:
  - type: web
    name: auth-app-backend
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: SECRET_KEY
        sync: false
      - key: ACCESS_TOKEN_EXPIRES_MINUTES
        value: 30
      - key: ACCESS_TOKEN_EXPIRES_DAYS
        value: 7
      - key: CORS_ALLOWED_ORIGINS
        value: http://localhost:5173,https://auth-app-frontend-rh30.onrender.com
    healthCheckPath: /health

  - type: web
    name: auth-app-frontend
    env: static
    buildCommand: cd auth-app-frontend && npm install && npm run build
    staticPublishPath: auth-app-frontend/dist
    envVars:
      - key: REACT_APP_API_URL
        value: https://auth-app-backend-udya.onrender.com
```

### Deployment Process

1. **Connect Repository**: Link GitHub repository to Render
2. **Configure Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SECRET_KEY`: JWT secret key
   - `CORS_ALLOWED_ORIGINS`: Frontend URLs
3. **Deploy Services**: Render automatically deploys both services
4. **Verify Deployment**: Check health endpoints and functionality

### Environment Variables (Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `SECRET_KEY` | JWT token secret | `your-secret-key-here` |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins | `http://localhost:5173,https://frontend.onrender.com` |
| `ACCESS_TOKEN_EXPIRES_MINUTES` | JWT token expiration | `30` |
| `ACCESS_TOKEN_EXPIRES_DAYS` | Refresh token expiration | `7` |

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepassword123"
}
```

### User Management

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <jwt_token>
```

### Social Features

#### Posts
```http
# Get all posts
GET /api/posts?skip=0&limit=50

# Create post
POST /api/posts
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my post"
}

# Get specific post
GET /api/posts/{post_id}

# Update post
PUT /api/posts/{post_id}
Authorization: Bearer <jwt_token>

# Delete post
DELETE /api/posts/{post_id}
Authorization: Bearer <jwt_token>
```

#### Comments
```http
# Get comments for post
GET /api/posts/{post_id}/comments

# Add comment
POST /api/posts/{post_id}/comments
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "content": "Great post!"
}

# Update comment
PUT /api/comments/{comment_id}
Authorization: Bearer <jwt_token>

# Delete comment
DELETE /api/comments/{comment_id}
Authorization: Bearer <jwt_token>
```

#### Likes
```http
# Like/unlike post
POST /api/posts/{post_id}/like
Authorization: Bearer <jwt_token>

# Get likes for post
GET /api/posts/{post_id}/likes
```

### Health Check
```http
GET /health
```

---

## 🗄️ Database Management

### Migration Commands

```bash
# Initialize migrations (first time only)
python manage_migrations.py init

# Create new migration
python manage_migrations.py migrate "Description of changes"

# Apply migrations
python manage_migrations.py upgrade

# Rollback migration
python manage_migrations.py downgrade

# Check current migration
python manage_migrations.py current

# View migration history
python manage_migrations.py history
```

### Database Models

#### User Model
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
```

#### Post Model
```python
class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
```

#### Comment Model
```python
class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
```

#### Like Model
```python
class Like(Base):
    __tablename__ = "likes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    post_id = Column(Integer, ForeignKey("posts.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
```

---

## 🔧 Environment Variables

### Development (.env file)
```env
DATABASE_URL=sqlite:///users.db
SECRET_KEY=your-secret-key-here
CORS_ALLOWED_ORIGINS=http://localhost:5173
ACCESS_TOKEN_EXPIRES_MINUTES=30
ACCESS_TOKEN_EXPIRES_DAYS=7
```

### Production (Render Environment Variables)
```env
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-production-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://auth-app-frontend-rh30.onrender.com
ACCESS_TOKEN_EXPIRES_MINUTES=30
ACCESS_TOKEN_EXPIRES_DAYS=7
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't communicate with backend
**Solution**: Update `CORS_ALLOWED_ORIGINS` to include frontend URL

#### 2. Database Connection Issues
**Problem**: Backend can't connect to database
**Solution**: 
- Check `DATABASE_URL` environment variable
- Verify database credentials
- Ensure database is accessible from Render

#### 3. Docker Build Failures
**Problem**: Docker build fails during npm install or pip install
**Solution**:
- Check Dockerfile syntax
- Verify all files are copied correctly
- Check for missing dependencies

#### 4. Nginx Configuration Issues
**Problem**: Frontend shows 404 or API calls fail
**Solution**:
- Verify nginx.conf syntax
- Check proxy_pass URL
- Ensure React Router configuration is correct

#### 5. JWT Token Issues
**Problem**: Authentication fails
**Solution**:
- Verify `SECRET_KEY` is set correctly
- Check token expiration settings
- Ensure frontend sends Authorization header

### Debug Commands

```bash
# Check Docker containers
docker ps
docker logs <container_name>

# Check Render logs
# Use Render dashboard to view service logs

# Test API endpoints
curl -X GET https://auth-app-backend-udya.onrender.com/health

# Check database connection
python -c "from app.database.main import engine; print(engine.connect())"
```

---

## 📋 Best Practices

### Security
- ✅ Use environment variables for sensitive data
- ✅ Hash passwords with bcrypt
- ✅ Implement JWT token expiration
- ✅ Configure CORS properly
- ✅ Use HTTPS in production
- ✅ Validate input data with Pydantic

### Performance
- ✅ Use database indexes for frequently queried fields
- ✅ Implement pagination for large datasets
- ✅ Use Docker multi-stage builds for smaller images
- ✅ Configure Nginx caching for static assets
- ✅ Use connection pooling for database connections

### Development
- ✅ Follow modular architecture
- ✅ Use type hints in Python
- ✅ Implement proper error handling
- ✅ Write comprehensive API documentation
- ✅ Use version control for database migrations
- ✅ Test API endpoints thoroughly

### Deployment
- ✅ Use health checks for monitoring
- ✅ Implement proper logging
- ✅ Configure environment-specific settings
- ✅ Use container orchestration
- ✅ Monitor application performance
- ✅ Set up automated backups

---

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review Render deployment logs
3. Test locally with Docker Compose
4. Verify environment variables are set correctly
5. Check API documentation at `/docs` endpoint

---

## 📄 License

This project is licensed under the MIT License.

---

*Last updated: August 2024* 