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
  formatDate
}) => {
  return (
    <div className="feed-container">
      <FeedHeader 
        user={user}
        onCreatePost={onCreatePost}
        onLogout={onLogout}
        onUserClick={onUserClick}
      />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

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