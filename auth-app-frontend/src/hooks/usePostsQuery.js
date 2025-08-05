import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllPosts, 
  createPost, 
  updatePost, 
  deletePost,
  likePost,
  unlikePost
} from '../api';

// Query keys
export const postKeys = {
  all: ['posts'],
  lists: () => [...postKeys.all, 'list'],
  list: (filters) => [...postKeys.lists(), filters],
  details: () => [...postKeys.all, 'detail'],
  detail: (id) => [...postKeys.details(), id],
};

export const usePosts = () => {
  return useQuery({
    queryKey: postKeys.lists(),
    queryFn: () => getAllPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postData, token }) => createPost(postData, token),
    onSuccess: (newPost) => {
      // Optimistically update the cache
      queryClient.setQueryData(postKeys.lists(), (oldData) => {
        return oldData ? [newPost, ...oldData] : [newPost];
      });
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, text, token }) => updatePost(postId, { text }, token),
    onSuccess: (updatedPost) => {
      // Update the cache with the new data
      queryClient.setQueryData(postKeys.lists(), (oldData) => {
        return oldData?.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        ) || [updatedPost];
      });
    },
    onError: (error) => {
      console.error('Failed to update post:', error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, token }) => deletePost(postId, token),
    onSuccess: (_, { postId }) => {
      // Remove the post from cache
      queryClient.setQueryData(postKeys.lists(), (oldData) => {
        return oldData?.filter(post => post.id !== postId) || [];
      });
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, token, isLiked }) => 
      isLiked ? unlikePost(postId, token) : likePost(postId, token),
    onSuccess: (_, { postId, isLiked }) => {
      // Update the cache to reflect the like status
      queryClient.setQueryData(postKeys.lists(), (oldData) => {
        return oldData?.map(post => 
          post.id === postId 
            ? { ...post, is_liked: !isLiked }
            : post
        ) || [];
      });
      // Invalidate user likes to refetch
      queryClient.invalidateQueries({ queryKey: ['userLikes'] });
    },
    onError: (error) => {
      console.error('Failed to like/unlike post:', error);
    },
  });
}; 