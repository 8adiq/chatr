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
          <div className="header-actions">
            <button onClick={onLogout} className="logout-btn" title="Logout">
              ⏻
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="header-left">
            <h1>chatr Feed</h1>
            <div className="welcome-message">
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
            </div>
          </div>
          <div className="header-actions">
            <button onClick={onCreatePost} className="create-post-btn" title="Create new post">
              ✏️
            </button>
            <button onClick={onLogout} className="logout-btn" title="Logout">
              ⏻
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default FeedHeader; 