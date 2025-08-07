import React from 'react';

const CreatePostModal = ({ 
  newPost, 
  loading, 
  onClose, 
  onSubmit, 
  onTextChange 
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
        <header className="create-post-header">
          <h2 className="font-semibold">Create New Post</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </header>

        <form onSubmit={onSubmit} className="create-post-form">
          <textarea
            placeholder="What's on your mind?"
            value={newPost.text}
            onChange={onTextChange}
            required
            autoFocus
            className="input"
          />
          <div className="form-actions">
            <button type="submit" disabled={loading || !newPost.text.trim()} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Post'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal; 