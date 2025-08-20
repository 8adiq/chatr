import React from 'react';
import FeedHeader from './FeedHeader';
import PostCard from './PostCard';

const Feed = ({
  user,
  posts,
  comments,
  newComment,
  editingPost,
  likedPosts,
  loading,
  error,
  success,
  showVerificationMessage,
  onDismissVerification,
  viewingUserPosts,
  onCreatePost,
  onLogout,
  onUserClick,
  onEditPost,
  onDeletePost,
  onUpdatePost,
  onLikePost,
  onLoadComments,
  onCreateComment,
  onNewCommentChange,
  onCancelEdit,
  onBackToFeed,
  formatDate
}) => {
  // Reduced logging to prevent console spam
  if (showVerificationMessage) {
    console.log('Feed: Rendering verification banner');
  }
  return (
    <div className="feed-container">
      <FeedHeader 
        user={user}
        viewingUserPosts={viewingUserPosts}
        onCreatePost={onCreatePost}
        onLogout={onLogout}
        onUserClick={onUserClick}
        onBackToFeed={onBackToFeed}
      />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      {showVerificationMessage && (
        <div className="verification-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3>🎉 Welcome to chatr!</h3>
              <p>Your account has been created successfully! Please check your email for a verification link.</p>
              <p><strong>💡 Tip:</strong> Check your spam folder if you don't see the email in your inbox.</p>
            </div>
            <button 
              onClick={onDismissVerification} 
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '4px',
                fontSize: '1.125rem'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Dismiss message"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="posts-container">
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            comments={comments}
            newComment={newComment}
            editingPost={editingPost}
            likedPosts={likedPosts}
            onUserClick={onUserClick}
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
            onUpdatePost={onUpdatePost}
            onLikePost={onLikePost}
            onLoadComments={onLoadComments}
            onCreateComment={onCreateComment}
            onNewCommentChange={onNewCommentChange}
            onCancelEdit={onCancelEdit}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed; 