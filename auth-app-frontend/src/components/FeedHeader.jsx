import React from 'react';
import { BackIcon, LogoutIcon, PlusIcon } from './Icons';

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
            <button onClick={onBackToFeed} className="back-btn" title="Back to Feed">
              <BackIcon size={18} />
            </button>
            <h1 className="font-bold text-xl">{viewingUserPosts.username}'s Posts</h1>
          </div>
          <div className="header-actions">
            <button onClick={onLogout} className="logout-btn" title="Logout">
              <LogoutIcon size={16} />
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
              <PlusIcon size={16} />
            </button>
            <button onClick={onLogout} className="logout-btn" title="Logout">
              <LogoutIcon size={16} />
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default FeedHeader; 