import React from 'react';

const FeedHeader = ({ 
  user, 
  viewingUserPosts,
  onCreatePost, 
  onLogout, 
  onUserClick,
  onBackToFeed
}) => {
    return (
    <header className="feed-header">
      {viewingUserPosts ? (
        <>
          <div className="back-section">
            <button onClick={onBackToFeed} className="back-btn">
              ← Back to Feed
            </button>
            <h1>{viewingUserPosts.username}'s Posts</h1>
          </div>
          <div className="user-info">
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </header>
  );
};

export default FeedHeader; 