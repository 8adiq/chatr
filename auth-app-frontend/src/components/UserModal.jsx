import React from 'react';
import { CloseIcon } from './Icons';

const UserModal = ({ 
  selectedUser, 
  onClose, 
  onViewPosts, 
  getRandomAvatar 
}) => {
  if (!selectedUser) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <header className="user-modal-header">
          <h2 className="font-semibold">User Details</h2>
          <button onClick={onClose} className="close-btn">
            <CloseIcon size={16} />
          </button>
        </header>

        <div className="user-details">
          <div className="user-avatar-section">
            <div className="avatar-container">
              <img 
                src={getRandomAvatar(selectedUser.username)}
                alt={`${selectedUser.username}'s avatar`}
                className="user-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="avatar-fallback" style={{ display: 'none' }}>
                <span className="avatar-initials">
                  {selectedUser.username.substring(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="user-info-modal">
            <h3 className="font-bold">{selectedUser.username}</h3>
            <p className="user-email text-secondary">{selectedUser.email}</p>
          </div>
          
          <div className="user-stats">
            <div className="stat">
              <span className="stat-label">Member since:</span>
              <span className="stat-value">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="user-actions">
            <button 
              onClick={onViewPosts}
              className="view-posts-btn"
            >
              View Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal; 