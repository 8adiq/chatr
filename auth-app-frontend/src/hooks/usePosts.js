import { useState } from 'react';
import { 
  getAllPosts, 
  createPost, 
  updatePost, 
  deletePost,
  likePost,
  unlikePost
} from '../api';

export const usePosts = (token) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());

  const loadPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getAllPosts();
      setPosts(postsData);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      setLoading(true);
      const newPost = await createPost(postData, token);
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async (postId, text) => {
    try {
      setLoading(true);
      const updatedPost = await updatePost(postId, { text }, token);
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId ? updatedPost : post
        )
      );
      return updatedPost;
    } catch (err) {
      // If we get a 404, the post might have been deleted, refresh the list
      if (err.message.includes('Resource not found')) {
        await loadPosts();
      }
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setLoading(true);
      // Store the current posts state in case we need to revert
      const currentPosts = [...posts];
      
      // Optimistically remove the post from UI
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      // Attempt to delete from backend
      await deletePost(postId, token);
      
      // If successful, the optimistic update remains
      // If it fails, the error will be caught and handled
    } catch (err) {
      // If deletion fails, revert the optimistic update
      setPosts(currentPosts);
      
      // If we get a 404, the post might have already been deleted, refresh the list
      if (err.message.includes('Resource not found')) {
        await loadPosts();
      }
      
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const isCurrentlyLiked = likedPosts.has(postId);
      
      // Optimistically update the UI
      if (isCurrentlyLiked) {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        setLikedPosts(prev => new Set([...prev, postId]));
      }
      
      // Make the API call
      if (isCurrentlyLiked) {
        await unlikePost(postId, token);
      } else {
        await likePost(postId, token);
      }
      
      // If successful, the optimistic update remains
    } catch (err) {
      // If the API call fails, revert the optimistic update
      if (isCurrentlyLiked) {
        setLikedPosts(prev => new Set([...prev, postId]));
      } else {
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
      
      // If we get a 404, the post might have been deleted, refresh the list
      if (err.message.includes('Resource not found')) {
        await loadPosts();
      }
      
      setError(err.message);
      throw err;
    }
  };

  const clearError = () => {
    setError('');
  };

  return {
    posts,
    loading,
    error,
    likedPosts,
    loadPosts,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost,
    clearError
  };
}; 