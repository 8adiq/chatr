import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import { getUserById, getComments } from './api';
import { usePosts, useCreatePost, useUpdatePost, useDeletePost, useLikePost } from './hooks/usePostsQuery';
import { useComments, useCreateComment } from './hooks/useCommentsQuery';
import { useProfile, useLogin, useRegister, useUserLikes } from './hooks/useAuthQuery';
import { formatDate, getRandomAvatar } from './utils/helpers';
import AuthForm from './components/AuthForm';
import Feed from './components/Feed';
import UserModal from './components/UserModal';
import CreatePostModal from './components/CreatePostModal';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function AppContent() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'feed' | 'create-post'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  
  // User details modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [viewingUserPosts, setViewingUserPosts] = useState(null);
  
  // Post editing state
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({ text: '' });
  const [newComment, setNewComment] = useState({});
  const [loadedComments, setLoadedComments] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  
  // Authentication state
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // React Query hooks
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts();
  const { data: profileData, isLoading: profileLoading } = useProfile(token);
  const { data: userLikesData } = useUserLikes(token);
  
  // Filter posts when viewing a specific user's posts
  const filteredPosts = viewingUserPosts 
    ? (postsData || []).filter(post => post.user_id === viewingUserPosts.id)
    : (postsData || []);
  
  // Mutations
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();
  const likePostMutation = useLikePost();
  const createCommentMutation = useCreateComment();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  // Update user when profile data changes
  useEffect(() => {
    if (profileData?.user) {
      setUser(profileData.user);
    }
  }, [profileData]);

  // Sync liked posts when user likes are loaded
  useEffect(() => {
    if (userLikesData) {
      const likedPostIds = userLikesData.map(like => like.post_id);
      setLikedPosts(new Set(likedPostIds));
    }
  }, [userLikesData]);

  // Handle authentication success
  const handleAuthSuccess = (data) => {
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerMutation.mutateAsync(form);
      handleAuthSuccess(data);
      setMode('feed');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginMutation.mutateAsync(form);
      handleAuthSuccess(data);
      setMode('feed');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    setForm({ username: '', email: '', password: '' });
    setMode('login');
    setEditingPost(null);
    setNewPost({ text: '' });
    setShowUserModal(false);
    setSelectedUser(null);
    setError('');
    setSuccess('');
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.text.trim()) return;
    
    try {
      await createPostMutation.mutateAsync({ postData: newPost, token: token });
      setNewPost({ text: '' });
      setMode('feed');
    } catch (err) {
      // Error is handled by React Query
    }
  };

  const handleUpdatePost = async (postId, text) => {
    try {
      await updatePostMutation.mutateAsync({ postId, text, token: token });
      setEditingPost(null);
    } catch (err) {
      // Error is handled by React Query
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePostMutation.mutateAsync({ postId, token: token });
    } catch (err) {
      // Error is handled by React Query
    }
  };

  const handleCreateComment = async (postId) => {
    try {
      const commentText = newComment[postId];
      if (!commentText?.trim()) return;
      
      const newCommentData = await createCommentMutation.mutateAsync({ 
        postId, 
        commentData: { text: commentText }, 
        token: token 
      });
      
      // Clear the comment input
      setNewComment(prev => ({
        ...prev,
        [postId]: ''
      }));
      
      // Immediately add the new comment to the loaded comments
      setLoadedComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newCommentData]
      }));
    } catch (err) {
      console.error('Error creating comment:', err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const isLiked = likedPosts.has(postId);
      
      await likePostMutation.mutateAsync({ postId, token: token, isLiked });
      
      // Update local like state
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleUserClick = async (userId) => {
    try {
      const userData = await getUserById(userId);
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (err) {
      setError('Failed to load user details');
    }
  };

  const handleEditPost = (postId) => {
    setEditingPost(postId);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleLoadComments = async (postId) => {
    if (loadedComments[postId]) return; // Already loaded
    
    try {
      const comments = await getComments(postId);
      setLoadedComments(prev => ({
        ...prev,
        [postId]: comments
      }));
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleNewCommentChange = (postId, value) => {
    setNewComment(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleNewPostChange = (e) => {
    setNewPost({ text: e.target.value });
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    clearMessages();
  };

  const handleViewPosts = () => {
    setViewingUserPosts(selectedUser);
    setShowUserModal(false);
  };

  const handleBackToFeed = () => {
    setViewingUserPosts(null);
  };

  // If not authenticated, show auth form
  if (!token) {
    return (
      <AuthForm
        mode={mode}
        form={form}
        loading={loginMutation.isPending || registerMutation.isPending}
        error={error}
        success={success}
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
          user={user}
          posts={filteredPosts}
          comments={loadedComments}
          newComment={newComment}
          editingPost={editingPost}
          likedPosts={likedPosts}
          loading={postsLoading}
          error={postsError?.message}
          success={success}
          viewingUserPosts={viewingUserPosts}
          onCreatePost={() => setMode('create-post')}
          onLogout={handleLogout}
          onUserClick={handleUserClick}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
          onUpdatePost={handleUpdatePost}
          onLikePost={handleLikePost}
          onLoadComments={handleLoadComments}
          onCreateComment={handleCreateComment}
          onNewCommentChange={handleNewCommentChange}
          onCancelEdit={handleCancelEdit}
          onBackToFeed={handleBackToFeed}
          formatDate={formatDate}
        />
        <CreatePostModal
          newPost={newPost}
          loading={createPostMutation.isPending}
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
        user={user}
        posts={filteredPosts}
        comments={loadedComments}
        newComment={newComment}
        editingPost={editingPost}
        likedPosts={likedPosts}
        loading={postsLoading}
        error={postsError?.message}
        success={success}
        viewingUserPosts={viewingUserPosts}
        onCreatePost={() => setMode('create-post')}
        onLogout={handleLogout}
        onUserClick={handleUserClick}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
        onUpdatePost={handleUpdatePost}
        onLikePost={handleLikePost}
        onLoadComments={handleLoadComments}
        onCreateComment={handleCreateComment}
        onNewCommentChange={handleNewCommentChange}
        onCancelEdit={handleCancelEdit}
        onBackToFeed={handleBackToFeed}
        formatDate={formatDate}
      />
      {showUserModal && (
        <UserModal
          selectedUser={selectedUser}
          onClose={() => setShowUserModal(false)}
          onViewPosts={handleViewPosts}
          getRandomAvatar={getRandomAvatar}
        />
      )}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
