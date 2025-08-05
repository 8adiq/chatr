import { useState, useEffect } from 'react';
import './App.css';
import { getUserById } from './api';
import { useAuth } from './hooks/useAuth';
import { usePosts } from './hooks/usePosts';
import { useComments } from './hooks/useComments';
import { formatDate, getRandomAvatar } from './utils/helpers';
import AuthForm from './components/AuthForm';
import Feed from './components/Feed';
import UserModal from './components/UserModal';
import CreatePostModal from './components/CreatePostModal';

function App() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'feed' | 'create-post'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  

  
  // User details modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Post editing state
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({ text: '' });
  
  // Custom hooks
  const auth = useAuth();
  const posts = usePosts(auth.token);
  const comments = useComments(auth.token);

  useEffect(() => {
    if (auth.token && auth.user) {
      setMode('feed');
      posts.loadPosts();
    }
  }, [auth.token, auth.user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await auth.handleRegister(form);
      setMode('feed');
      posts.loadPosts();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.handleLogin(form);
      setMode('feed');
      posts.loadPosts();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleLogout = () => {
    auth.handleLogout();
    setForm({ username: '', email: '', password: '' });
    setMode('login');
    setEditingPost(null);
    setNewPost({ text: '' });
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.text.trim()) return;
    
    try {
      await posts.handleCreatePost(newPost);
      setNewPost({ text: '' });
      setMode('feed');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleUpdatePost = async (postId, text) => {
    try {
      await posts.handleUpdatePost(postId, text);
      setEditingPost(null);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await posts.handleDeletePost(postId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleCreateComment = async (postId) => {
    try {
      await comments.handleCreateComment(postId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const loadComments = async (postId) => {
    try {
      await comments.loadComments(postId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await posts.handleLikePost(postId);
    } catch (err) {
      // Error is handled by the hook
    }
  };



  const handleUserClick = async (userId) => {
    try {
      const userData = await getUserById(userId);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (err) {
      auth.setError('Failed to load user details');
    }
  };

  const handleEditPost = (postId) => {
    setEditingPost(postId);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleNewCommentChange = (postId, value) => {
    comments.handleNewCommentChange(postId, value);
  };

  const handleNewPostChange = (e) => {
    setNewPost({ text: e.target.value });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    auth.clearMessages();
  };



  const handleViewPosts = () => {
    // TODO: Implement view user posts
    setShowUserModal(false);
  };

  const handleUploadAvatar = () => {
    // TODO: Implement avatar upload
    setShowUserModal(false);
  };

  // If not authenticated, show auth form
  if (!auth.token) {
    return (
      <AuthForm
        mode={mode}
        form={form}
        loading={auth.loading}
        error={auth.error}
        success={auth.success}
        onFormChange={handleChange}
        onSubmit={mode === 'login' ? handleLogin : handleRegister}
        onModeChange={handleModeChange}
      />
    );
  }

  // If creating post, show create post modal
  if (mode === 'create-post') {
    return (
      <>
        <Feed
          user={auth.user}
          posts={posts.posts}
          comments={comments.comments}
          newComment={comments.newComment}
          editingPost={editingPost}
          likedPosts={posts.likedPosts}
          loading={posts.loading || comments.loading}
          error={posts.error || comments.error}
          success={auth.success}
          onCreatePost={() => setMode('create-post')}
          onLogout={handleLogout}
          onUserClick={handleUserClick}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onLikePost={handleLikePost}
          onLoadComments={loadComments}
          onCreateComment={handleCreateComment}
          onNewCommentChange={handleNewCommentChange}
          onCancelEdit={handleCancelEdit}
          formatDate={formatDate}
        />
        <CreatePostModal
          newPost={newPost}
          loading={posts.loading}
          onClose={() => setMode('feed')}
          onSubmit={handleCreatePost}
          onTextChange={handleNewPostChange}
        />
      </>
    );
  }

  // Show feed with user modal if open
  return (
    <>
      <Feed
        user={auth.user}
        posts={posts.posts}
        comments={comments.comments}
        newComment={comments.newComment}
        editingPost={editingPost}
        likedPosts={posts.likedPosts}
        loading={posts.loading || comments.loading}
        error={posts.error || comments.error}
        success={auth.success}
        onCreatePost={() => setMode('create-post')}
        onLogout={handleLogout}
        onUserClick={handleUserClick}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
        onUpdatePost={handleUpdatePost}
        onLikePost={handleLikePost}
        onLoadComments={loadComments}
        onCreateComment={handleCreateComment}
        onNewCommentChange={handleNewCommentChange}
        onCancelEdit={handleCancelEdit}
        formatDate={formatDate}
      />
      {showUserModal && (
        <UserModal
          selectedUser={selectedUser}
          onClose={() => setShowUserModal(false)}
          onViewPosts={handleViewPosts}
          onUploadAvatar={handleUploadAvatar}
          getRandomAvatar={getRandomAvatar}
        />
      )}
    </>
  );
}

export default App;
