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
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      setLoading(true);
      await deletePost(postId, token);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      if (likedPosts.has(postId)) {
        await unlikePost(postId, token);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        await likePost(postId, token);
        setLikedPosts(prev => new Set([...prev, postId]));
      }
    } catch (err) {
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