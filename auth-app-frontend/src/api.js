// API utility for authentication and social media features
// Use different base URL for development vs production
   const API_BASE = import.meta.env.DEV 
     ? 'http://localhost:8000/api' 
     : 'https://auth-app-backend-udya.onrender.com/api';

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
    
    // Provide more specific error messages for common cases
    if (response.status === 404) {
      // Don't throw an error for 404s, just return null to indicate resource not found
      return null;
    } else if (response.status === 403) {
      throw new Error('You do not have permission to perform this action.');
    } else if (response.status === 401) {
      throw new Error('Invalid credentials. Please try again.');
    } else if (response.status === 400) {
      throw new Error(errorMessage || 'Invalid request. Please check your input.');
    } else {
      throw new Error(errorMessage);
    }
  }
  return response.json();
}

// Helper function to get auth headers
function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Helper function to make API calls with auto-refresh
async function apiCallWithRefresh(url, options, tokenManager) {
  try {
    // Get valid access token (refresh if needed)
    const validToken = await tokenManager.getValidAccessToken();
    
    // First attempt with current token
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${validToken}`
      }
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const newToken = await tokenManager.refreshAccessToken();
      
      // Retry with new token
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`
        }
      });
      
      return handleResponse(retryResponse);
    }

    return handleResponse(response);
  } catch (error) {
    throw error;
  }
}

// User Authentication
export async function register({ username, email, password }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await handleResponse(res);
  
  // Store both tokens
  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('refreshToken', data.refresh_token);
  
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  
  // Store both tokens
  localStorage.setItem('accessToken', data.token);
  localStorage.setItem('refreshToken', data.refresh_token);
  
  return data;
}

export async function refreshTokens(refreshToken) {
  const res = await fetch(`${API_BASE}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  return handleResponse(res);
}

export async function getProfile(tokenManager) {
  return apiCallWithRefresh(`${API_BASE}/profile`, {
    headers: { 'Content-Type': 'application/json' }
  }, tokenManager);
}

export async function getUserById(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}`);
  return handleResponse(res);
}

// Posts
export async function getAllPosts(skip = 0, limit = 50) {
  const res = await fetch(`${API_BASE}/posts?skip=${skip}&limit=${limit}`);
  return handleResponse(res);
}

export async function getPost(postId) {
  const res = await fetch(`${API_BASE}/posts/${postId}`);
  return handleResponse(res);
}

export async function createPost(postData, tokenManager) {
  return apiCallWithRefresh(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  }, tokenManager);
}

export async function updatePost(postId, postData, tokenManager) {
  return apiCallWithRefresh(`${API_BASE}/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  }, tokenManager);
}

export async function deletePost(postId, tokenManager) {
  const result = await apiCallWithRefresh(`${API_BASE}/posts/${postId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  }, tokenManager);
  
  // If the post was already deleted (404), consider it a success
  if (result === null) {
    return { success: true, message: 'Post already deleted' };
  }
  
  return result;
}

// Comments
export async function getComments(postId, skip = 0, limit = 10) {
  const res = await fetch(`${API_BASE}/${postId}/comments?skip=${skip}&limit=${limit}`);
  return handleResponse(res);
}

export async function createComment(postId, commentData, tokenManager) {
  return apiCallWithRefresh(`${API_BASE}/comments?post_id=${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  }, tokenManager);
}

// Likes
export async function likePost(postId, tokenManager) {
  return apiCallWithRefresh(`${API_BASE}/likes?post_id=${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, tokenManager);
}

export async function unlikePost(postId, tokenManager) {
  return apiCallWithRefresh(`${API_BASE}/likes?post_id=${postId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  }, tokenManager);
}

export async function getUserLikes(tokenManager) {
  return apiCallWithRefresh(`${API_BASE}/user/likes`, {
    headers: { 'Content-Type': 'application/json' },
  }, tokenManager);
} 