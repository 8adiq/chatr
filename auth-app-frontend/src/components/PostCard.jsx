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



  // Update editing text when post changes or when entering edit mode
  useEffect(() => {
    setEditingText(post.text);
  }, [post.text, editingPost]);

  return (
    <div className="post-card">
      <div className="post-header">
        <span 
          className="post-author clickable"
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
            >
              Edit
            </button>
            <button 
              onClick={() => onDeletePost(post.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      {editingPost === post.id ? (
        <div className="edit-post">
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
          />
          <div className="edit-actions">
            <button onClick={() => onUpdatePost(post.id, editingText)}>
              Save
            </button>
            <button onClick={() => {
              setEditingText(post.text);
              onCancelEdit();
            }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="post-text">{post.text}</p>
      )}
      
      <div className="post-actions-bottom">
        <div className="post-actions-left">
                     <button 
             onClick={() => onLikePost(post.id)}
             className={`like-btn ${isLiked ? 'liked' : ''}`}
           >
             {isLiked ? '❤️' : '🤍'} Like
           </button>
          <button 
            onClick={() => onLoadComments(post.id)}
            className="comment-btn"
          >
            💬 Comments
          </button>
        </div>
        <span className="post-date">{formatDate(post.created_at)}</span>
      </div>
      
      {comments[post.id] && (
        <div className="comments-section">
          <h4>Comments</h4>
                     {comments[post.id].map(comment => (
             <div key={comment.id} className="comment">
               <span 
                 className="comment-author clickable"
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
             />
             <button onClick={() => onCreateComment(post.id)}>
               Comment
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PostCard; 