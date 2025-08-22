import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { getUserById, getComments } from './api';
import { usePosts, useCreatePost, useUpdatePost, useDeletePost, useLikePost } from './hooks/usePostsQuery';
import { useComments, useCreateComment } from './hooks/useCommentsQuery';
import { useProfile, useLogin, useRegister, useUserLikes } from './hooks/useAuthQuery';
import { useTokenManager } from './hooks/useTokenManager';
import { formatDate, getRandomAvatar } from './utils/helpers';
import AuthForm from './components/AuthForm';
import Feed from './components/Feed';
import UserModal from './components/UserModal';
import CreatePostModal from './components/CreatePostModal';
import EmailVerification from './components/EmailVerification';

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
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
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
  
  // Token management
  const tokenManager = useTokenManager();
  const { 
    accessToken, 
    updateTokens, 
    clearTokens, 
    refreshAccessToken 
  } = tokenManager;
  
  // User state
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  // React Query hooks
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts();
  const { data: profileData, isLoading: profileLoading } = useProfile(tokenManager);
  const { data: userLikesData } = useUserLikes(tokenManager);
  
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
    updateTokens(data.token, data.refresh_token);
    setUser(data.user);
    setMode('feed');
  };

  // Handle registration success with email verification
  const handleRegistrationSuccess = (data) => {
    updateTokens(data.token, data.refresh_token);
    setUser(data.user);
    setShowVerificationMessage(true);
    setMode('feed');
    
    // Hide verification message after 10 seconds
    setTimeout(() => {
      setShowVerificationMessage(false);
    }, 10000);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowVerificationMessage(false);

    if (mode === 'login') {
      try {
        const data = await loginMutation.mutateAsync({
          email: form.email,
          password: form.password,
        });
        handleAuthSuccess(data);
      } catch (error) {
        setError(error.message);
      }
    } else if (mode === 'register') {
      try {
        const data = await registerMutation.mutateAsync({
          username: form.username,
          email: form.email,
          password: form.password,
        });
        handleRegistrationSuccess(data);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Handle form changes
  const handleFormChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle mode changes
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setShowVerificationMessage(false);
    setForm({ username: '', email: '', password: '' });
  };

  // Handle logout
  const handleLogout = () => {
    clearTokens();
    setUser(null);
    setMode('login');
    setShowVerificationMessage(false);
    navigate('/');
  };

  // Check if we're on the email verification route
  const isEmailVerificationRoute = location.pathname === '/verify-email';

  // If on email verification route, render that component
  if (isEmailVerificationRoute) {
    return <EmailVerification />;
  }

  // If user is not authenticated, show auth form
  if (!user && !accessToken) {
    return (
      <div className="app">
        <AuthForm
          mode={mode}
          form={form}
          loading={loginMutation.isLoading || registerMutation.isLoading}
          error={error}
          success={success}
          showVerificationMessage={showVerificationMessage}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onModeChange={handleModeChange}
        />
      </div>
    );
  }

  // Main app content for authenticated users
  return (
    <div className="app">
      {/* Rest of your existing app content */}
      <Feed
        posts={filteredPosts}
        loading={postsLoading}
        error={postsError}
        user={user}
        onLogout={handleLogout}
        onUserClick={async (userId) => {
          console.log('onUserClick called with userId:', userId);
          try {
            const userData = await getUserById(userId, tokenManager);
            console.log('User data received:', userData);
            if (userData) {
              setSelectedUser(userData);
              setShowUserModal(true);
              console.log('Modal should be showing now');
            } else {
              console.log('No user data received');
            }
          } catch (error) {
            console.error('Error fetching user:', error);
            // Fallback to minimal user object if API fails
            setSelectedUser({ id: userId, username: 'User' });
            setShowUserModal(true);
          }
        }}
        onViewUserPosts={async (userId) => {
          try {
            const userData = await getUserById(userId, tokenManager);
            if (userData) {
              setViewingUserPosts(userData);
            } else {
              // Fallback to minimal user object if API fails
              setViewingUserPosts({ id: userId, username: 'User' });
            }
          } catch (error) {
            console.error('Error fetching user:', error);
            // Fallback to minimal user object if API fails
            setViewingUserPosts({ id: userId, username: 'User' });
          }
        }}
        onClearUserPosts={() => setViewingUserPosts(null)}
        onBackToFeed={() => setViewingUserPosts(null)}
        onLikePost={(postId, isLiked) => likePostMutation.mutate({ postId, isLiked, tokenManager })}
        onUnlikePost={(postId, isLiked) => likePostMutation.mutate({ postId, isLiked, tokenManager })}
        likedPosts={likedPosts}
        onEditPost={(post) => setEditingPost(post)}
        onDeletePost={(postId) => deletePostMutation.mutate({ postId, tokenManager })}
        onUpdatePost={(postId, text) => updatePostMutation.mutate({ postId, text, tokenManager })}
        onCreateComment={(postId, comment) => {
          createCommentMutation.mutate(
            { postId, commentData: { text: comment }, tokenManager },
            {
              onSuccess: (newComment) => {
                // Update local comments state
                setLoadedComments(prev => ({
                  ...prev,
                  [postId]: [...(prev[postId] || []), newComment]
                }));
                // Clear the input field
                setNewComment(prev => ({
                  ...prev,
                  [postId]: ''
                }));
              }
            }
          );
        }}
        onLoadComments={(postId) => {
          if (!loadedComments[postId]) {
            getComments(postId, tokenManager)
              .then(comments => {
                setLoadedComments(prev => ({ ...prev, [postId]: comments }));
              })
              .catch(error => {
                console.error('Failed to load comments:', error);
              });
          }
        }}
        loadedComments={loadedComments}
        onNewCommentChange={(postId, text) => {
          setNewComment(prev => ({ ...prev, [postId]: text }));
        }}
        newComment={newComment}
        onClearNewComment={(postId) => {
          setNewComment(prev => ({ ...prev, [postId]: '' }));
        }}
        onCancelEdit={() => setEditingPost(null)}
        onCreatePost={() => setMode('create-post')}
        showVerificationMessage={showVerificationMessage}
        onDismissVerification={() => setShowVerificationMessage(false)}
        editingPost={editingPost?.id}
        viewingUserPosts={viewingUserPosts}
        success={success}
        comments={loadedComments}
        formatDate={formatDate}
      />

      {/* Modals */}

      {showUserModal && selectedUser && (
        <UserModal
          selectedUser={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          onViewPosts={() => {
            setViewingUserPosts(selectedUser);
            setShowUserModal(false);
            setSelectedUser(null);
          }}
          getRandomAvatar={getRandomAvatar}
        />
      )}

      {mode === 'create-post' && (
        <CreatePostModal
          newPost={newPost}
          loading={createPostMutation.isLoading}
          onClose={() => setMode('feed')}
          onSubmit={(e) => {
            e.preventDefault();
            if (newPost.text.trim()) {
              createPostMutation.mutate({ postData: { text: newPost.text }, tokenManager });
              setNewPost({ text: '' });
              setMode('feed');
            }
          }}
          onTextChange={(e) => setNewPost({ text: e.target.value })}
        />
      )}

      {editingPost && (
        <CreatePostModal
          newPost={{ text: editingPost.text }}
          loading={updatePostMutation.isLoading}
          onClose={() => setEditingPost(null)}
          onSubmit={(e) => {
            e.preventDefault();
            if (editingPost.text.trim()) {
              updatePostMutation.mutate({ 
                postId: editingPost.id, 
                text: editingPost.text, 
                tokenManager 
              });
              setEditingPost(null);
            }
          }}
          onTextChange={(e) => setEditingPost({ ...editingPost, text: e.target.value })}
        />
      )}
    </div>
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
