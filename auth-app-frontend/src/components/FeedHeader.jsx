import React from 'react';

const FeedHeader = ({ 
  user, 
  onCreatePost, 
  onLogout, 
  onUserClick 
}) => {
  return (
    <header className="feed-header">
      <h1>chatr Feed</h1>
      <div className="user-info">
        <span>
          Welcome,{' '}
          <span 
            className="current-user clickable"
            onClick={() => onUserClick(user?.id)}
            title="Click to view your profile"
          >
            {user?.username}
          </span>
          !
        </span>
        <button onClick={onCreatePost} className="create-post-btn">
          Create Post
        </button>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default FeedHeader; 