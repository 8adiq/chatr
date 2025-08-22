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
  showVerificationMessage,
  onDismissVerification,
  formatDate
}) => {
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
        <div className="verification-message mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="success mb-2">
            Account created successfully! Please check your email for verification link.
          </p>
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder.
          </p>
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