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
            <button onClick={onBackToFeed} className="btn btn-secondary">
              ← Back to Feed
            </button>
            <h1 className="font-bold text-xl">{viewingUserPosts.username}'s Posts</h1>
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
            <h1 className="font-bold text-2xl">chatr Feed</h1>
            <div className="welcome-message">
              <span className="text-secondary">
                Welcome,{' '}
                <span 
                  className="current-user clickable font-semibold"
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