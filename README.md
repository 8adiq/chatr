# Chatr - Full Stack Social Media Application

A modern full-stack social media application built with FastAPI (backend) and React (frontend), fully containerized with Docker and deployed on Render. Features user authentication, social interactions, and a responsive modern UI.

## 🌐 Live Demo

**Frontend:** [https://auth-app-frontend-rh30.onrender.com](https://auth-app-frontend-rh30.onrender.com)  
**Backend API:** [https://auth-app-backend-udya.onrender.com](https://auth-app-backend-udya.onrender.com)  
**API Documentation:** [https://auth-app-backend-udya.onrender.com/docs](https://auth-app-backend-udya.onrender.com/docs)

*Experience the full application with user registration, authentication, and social features.*

---

## ✨ Features

### Core Features
- **User Authentication**: Registration and login with JWT tokens
- **Social Features**: Posts, comments, and likes system
- **User Profiles**: Protected profile endpoints
- **Modern UI**: Responsive React frontend with Vite

### Technical Features
- **Containerized**: Full Docker support for development and production
- **Database Migrations**: Alembic-based migration system
- **CORS Enabled**: Cross-origin communication between services
- **Production Ready**: Deployed on Render with PostgreSQL
- **Health Checks**: Built-in monitoring endpoints
- **Security**: Password hashing with bcrypt, JWT authentication

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
├── PROJECT_DOCUMENTATION.md    # Comprehensive documentation
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose
- Git

### Option 1: Docker Setup (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd auth-app-fastapi
   ```

2. **Create environment file:**
   ```bash
   # Create .env file in root directory
   echo "DATABASE_URL=sqlite:///users.db
   SECRET_KEY=your-secret-key-here
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ACCESS_TOKEN_EXPIRES_MINUTES=30
   ACCESS_TOKEN_EXPIRES_DAYS=7" > .env
   ```

3. **Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### Option 2: Direct Setup

#### Backend Setup
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

#### Frontend Setup
```bash
cd auth-app-frontend
npm install
npm run dev
```

---

## 🐳 Docker Configuration

### Backend Container
- **Base Image**: Python 3.10.11-slim
- **Server**: Uvicorn
- **Port**: 8000
- **Database**: PostgreSQL (production) / SQLite (development)

### Frontend Container
- **Build Stage**: Node.js 18-alpine
- **Production Stage**: Nginx alpine
- **Port**: 80 (mapped to 3000)
- **Features**: Multi-stage build, static file serving, API proxying

### Docker Compose
- **Backend Service**: FastAPI application
- **Frontend Service**: React app with Nginx
- **Environment**: Shared environment variables
- **Networking**: Internal service communication

---

## ☁️ Production Deployment

### Render Platform
- **Backend**: Docker container deployment
- **Frontend**: Static site deployment
- **Database**: PostgreSQL hosted on Render
- **CI/CD**: Automatic deployment from GitHub

### Environment Variables (Production)
```env
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-production-secret-key
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://auth-app-frontend-rh30.onrender.com
ACCESS_TOKEN_EXPIRES_MINUTES=30
ACCESS_TOKEN_EXPIRES_DAYS=7
```

### Deployment Process
1. Connect GitHub repository to Render
2. Configure environment variables
3. Deploy using `render.yaml` blueprint
4. Verify health checks and functionality

---

## 📚 API Documentation

### Authentication
- `POST /api/register` — Register a new user
- `POST /api/login` — Log in and receive JWT token

### User Management
- `GET /api/profile` — Get current user profile (requires `Authorization: Bearer <token>`)

### Social Features
- `GET /api/posts` — Get all posts
- `POST /api/posts` — Create a new post (requires authentication)
- `GET /api/posts/{post_id}` — Get specific post
- `PUT /api/posts/{post_id}` — Update post (requires ownership)
- `DELETE /api/posts/{post_id}` — Delete post (requires ownership)

- `POST /api/posts/{post_id}/comments` — Add comment to post
- `GET /api/posts/{post_id}/comments` — Get comments for post
- `PUT /api/comments/{comment_id}` — Update comment (requires ownership)
- `DELETE /api/comments/{comment_id}` — Delete comment (requires ownership)

- `POST /api/posts/{post_id}/like` — Like/unlike a post
- `GET /api/posts/{post_id}/likes` — Get likes for a post

### Health Check
- `GET /health` — Application health status

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

---

## 🧪 Testing

Run the test suite:
```bash
python app/test.py
```

The test suite covers:
- User registration and authentication
- JWT token validation
- Protected endpoint access
- Social features (posts, comments, likes)
- Error handling and edge cases

---

## 🔧 Development

### Local Development
- Use Docker Compose for consistent environment
- Hot reload enabled for both frontend and backend
- SQLite database for development
- CORS configured for localhost

### Production Development
- PostgreSQL database
- Environment-specific configurations
- Health checks and monitoring
- Optimized Docker images

---

## 📋 Best Practices

### Security
- Environment variables for sensitive data
- Password hashing with bcrypt
- JWT token expiration
- CORS configuration
- Input validation with Pydantic

### Performance
- Database indexing
- Pagination for large datasets
- Docker multi-stage builds
- Nginx caching
- Connection pooling

---

## 📖 Documentation

For comprehensive documentation including:
- Detailed setup instructions
- Troubleshooting guide
- Architecture explanations
- Best practices

See: [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

For issues and questions:
1. Check the [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)
2. Review the troubleshooting section
3. Check Render deployment logs
4. Test locally with Docker Compose

---

*Last updated: August 2024* 
