import React, { useState, useEffect } from 'react';

const PostCard = ({
  post,
  user,
  comments,
  newComment,
  editingPost,
  likedPosts,
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
  const isOwnPost = user?.id === post.user_id;
  const isLiked = likedPosts.has(post.id);
  const [editingText, setEditingText] = useState(post.text);
  const [commentsVisible, setCommentsVisible] = useState(false);

  // Update editing text when post changes or when entering edit mode
  useEffect(() => {
    setEditingText(post.text);
  }, [post.text, editingPost]);

  const handleCommentToggle = () => {
    if (!comments[post.id]) {
      // Load comments if they haven't been loaded yet
      onLoadComments(post.id);
    }
    setCommentsVisible(!commentsVisible);
  };

  return (
    <div className="post-card card hover-lift">
      <div className="post-header">
        <span 
          className="post-author clickable font-semibold"
          onClick={() => onUserClick(post.user_id)}
          title="Click to view user details"
        >
          {post.username}
        </span>
        {isOwnPost && (
          <div className="post-actions">
            <button 
              onClick={() => onEditPost(post.id)}
              className="edit-btn"
              title="Edit post"
            >
              ✏️
            </button>
            <button 
              onClick={() => onDeletePost(post.id)}
              className="delete-btn"
              title="Delete post"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      
      {editingPost === post.id ? (
        <div className="edit-post">
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            className="input"
          />
          <div className="edit-actions">
            <button onClick={() => onUpdatePost(post.id, editingText)} className="btn btn-primary">
              Save
            </button>
            <button onClick={() => {
              setEditingText(post.text);
              onCancelEdit();
            }} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="post-text">{post.text}</p>
      )}
      
      <div className="post-actions-bottom">
        <div className="post-actions-left">
          <div className="action-item">
            <button 
              onClick={() => onLikePost(post.id)}
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              {isLiked ? '❤️' : '🤍'}
            </button>
            <span className="action-count">{post.like_count || 0}</span>
          </div>
          <div className="action-item">
            <button 
              onClick={handleCommentToggle}
              className="comment-btn"
              title={commentsVisible ? 'Hide comments' : 'Show comments'}
            >
              💬
            </button>
            <span className="action-count">{post.comment_count || 0}</span>
          </div>
        </div>
        <span className="post-date text-muted">{formatDate(post.created_at)}</span>
      </div>
      
      {commentsVisible && comments[post.id] && (
        <div className="comments-section">
          <h4 className="font-semibold">Comments</h4>
          {comments[post.id].map(comment => (
            <div key={comment.id} className="comment">
              <span 
                className="comment-author clickable font-semibold"
                onClick={() => onUserClick(comment.user_id)}
                title="Click to view user details"
              >
                {comment.username || 'Unknown User'}
              </span>
              <span className="comment-text">{comment.text}</span>
              <span className="comment-date">{formatDate(comment.created_at)}</span>
            </div>
          ))}
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment[post.id] || ''}
              onChange={(e) => onNewCommentChange(post.id, e.target.value)}
              className="input"
            />
            <button onClick={() => onCreateComment(post.id)} className="btn btn-primary">
              Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard; 