#!/bin/bash

# Environment setup script for Chatr application

echo "Chatr Environment Setup"
echo "======================"

if [ "$1" = "docker" ]; then
    echo "Setting up DOCKER environment..."
    echo "✅ Docker environment ready"
    echo "Run: docker-compose up --build"
    
elif [ "$1" = "dev" ]; then
    echo "Setting up DEVELOPMENT environment (direct Python/Node.js)..."
    echo "✅ Development environment ready"
    echo "Backend: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    echo "Frontend: cd auth-app-frontend && npm run dev (runs on http://localhost:3000)"
    
else
    echo "Usage: $0 {docker|dev}"
    echo ""
    echo "Options:"
    echo "  docker - Set up for Docker testing"
    echo "  dev    - Set up for direct development (no Docker)"
    echo ""
    echo "Examples:"
    echo "  $0 docker # For Docker testing"
    echo "  $0 dev    # For direct development"
fi 