// API utility for authentication and social media features
// Use different base URL for development vs production
const API_BASE = import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
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

// User Authentication
export async function register({ username, email, password }) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(res);
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
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

export async function createPost(postData, token) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(postData),
  });
  return handleResponse(res);
}

export async function updatePost(postId, postData, token) {
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(postData),
  });
  return handleResponse(res);
}

export async function deletePost(postId, token) {
  const res = await fetch(`${API_BASE}/posts/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
  }
  return null; // 204 No Content
}

// Comments
export async function getComments(postId, skip = 0, limit = 10) {
  const res = await fetch(`${API_BASE}/${postId}/comments?skip=${skip}&limit=${limit}`);
  return handleResponse(res);
}

export async function createComment(postId, commentData, token) {
  const res = await fetch(`${API_BASE}/comments?post_id=${postId}`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(commentData),
  });
  return handleResponse(res);
}

// Likes
export async function likePost(postId, token) {
  const res = await fetch(`${API_BASE}/likes?post_id=${postId}`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
}

export async function unlikePost(postId, token) {
  const res = await fetch(`${API_BASE}/likes?post_id=${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
  }
  return null; // 204 No Content
}

export async function getUserLikes(token) {
  const res = await fetch(`${API_BASE}/user/likes`, {
    headers: getAuthHeaders(token),
  });
  return handleResponse(res);
} 