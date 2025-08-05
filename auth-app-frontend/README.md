# chatr - Full-Stack Social Media Application

A modern, full-stack social media application built with FastAPI backend and React frontend.

## Features

### 🔐 Authentication & User Management
- **User Registration**: Secure user registration with email verification
- **User Login**: JWT-based authentication
- **Email Verification**: Email verification system with token-based confirmation
- **User Profiles**: View and manage user profiles
- **Password Security**: Hashed passwords with bcrypt

### 📝 Posts & Content
- **Create Posts**: Users can create text-based posts
- **View Posts**: Browse all posts in a social media feed
- **Edit Posts**: Users can edit their own posts
- **Delete Posts**: Users can delete their own posts
- **Post Details**: View individual posts with full details

### 💬 Comments System
- **Add Comments**: Users can comment on any post
- **View Comments**: Browse comments for each post
- **Comment Management**: Real-time comment loading

### ❤️ Like System
- **Like Posts**: Users can like/unlike posts
- **Like Status**: Visual indication of liked posts
- **Like Count**: Track number of likes per post

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Styling**: Clean, professional interface
- **Real-time Updates**: Dynamic content updates
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## Tech Stack

### Backend (FastAPI)
- **FastAPI**: Modern, fast web framework
- **SQLAlchemy**: Database ORM
- **SQLite**: Database (can be easily switched to PostgreSQL/MySQL)
- **JWT**: JSON Web Tokens for authentication
- **Pydantic**: Data validation
- **Alembic**: Database migrations
- **CORS**: Cross-origin resource sharing

### Frontend (React)
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool
- **CSS3**: Modern styling with gradients and animations
- **Fetch API**: HTTP requests
- **Local Storage**: Token persistence

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `POST /api/email-verification/request` - Request email verification
- `POST /api/email-verification/confirm` - Confirm email verification

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/{post_id}` - Get specific post
- `POST /api/posts` - Create new post
- `PUT /api/posts/{post_id}` - Update post
- `DELETE /api/posts/{post_id}` - Delete post
- `GET /api/{user_id}/posts` - Get user's posts

### Comments
- `GET /api/{post_id}/comments` - Get post comments
- `POST /api/comments` - Create comment

### Likes
- `POST /api/likes` - Like a post
- `DELETE /api/likes` - Unlike a post

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to the project root:
   ```bash
   cd auth-app-fastapi
   ```

2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp env_example.txt .env
   # Edit .env with your configuration
   ```

5. Initialize database:
   ```bash
   python manage_migrations.py
   ```

6. Run the backend:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd auth-app-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```

4. The frontend will be served by the FastAPI backend at `http://localhost:8000`

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Verify Email**: Check your email for verification link (or use manual token entry)
3. **Login**: Sign in with your credentials
4. **Create Posts**: Share your thoughts with the community
5. **Interact**: Like and comment on posts
6. **Manage Content**: Edit or delete your own posts

## Development

### Backend Development
- The backend runs on `http://localhost:8000`
- API documentation available at `http://localhost:8000/docs`
- Database migrations handled with Alembic

### Frontend Development
- Development server: `npm run dev`
- Build for production: `npm run build`
- Preview build: `npm run preview`

## Project Structure

```
auth-app-fastapi/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI application
│   ├── routes.py        # API routes
│   ├── models.py        # Database models
│   ├── schema.py        # Pydantic schemas
│   ├── auth.py          # Authentication logic
│   ├── database.py      # Database configuration
│   └── service.py       # Business logic
├── auth-app-frontend/
│   ├── src/
│   │   ├── App.jsx      # Main React component
│   │   ├── App.css      # Styles
│   │   └── api.js       # API utilities
│   ├── dist/            # Built frontend
│   └── package.json
├── migrations/          # Database migrations
├── requirements.txt     # Python dependencies
└── README.md
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password hashing
- **Email Verification**: Prevent fake accounts
- **CORS Protection**: Cross-origin request handling
- **Input Validation**: Pydantic schema validation
- **SQL Injection Protection**: SQLAlchemy ORM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.
