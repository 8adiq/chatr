import { useState } from 'react';
import { getComments, createComment } from '../api';

export const useComments = (token) => {
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadComments = async (postId) => {
    try {
      setLoading(true);
      const commentsData = await getComments(postId);
      setComments(prev => ({
        ...prev,
        [postId]: commentsData
      }));
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (postId) => {
    try {
      setLoading(true);
      const commentText = newComment[postId];
      if (!commentText?.trim()) return;

      const commentData = await createComment(postId, { text: commentText }, token);
      
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), commentData]
      }));
      
      setNewComment(prev => ({
        ...prev,
        [postId]: ''
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleNewCommentChange = (postId, value) => {
    setNewComment(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const clearError = () => {
    setError('');
  };

  return {
    comments,
    newComment,
    loading,
    error,
    loadComments,
    handleCreateComment,
    handleNewCommentChange,
    clearError
  };
}; 