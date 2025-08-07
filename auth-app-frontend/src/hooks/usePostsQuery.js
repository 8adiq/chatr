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
    mutationFn: ({ postData, tokenManager }) => createPost(postData, tokenManager),
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
    mutationFn: ({ postId, text, tokenManager }) => updatePost(postId, { text }, tokenManager),
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
    mutationFn: ({ postId, tokenManager }) => deletePost(postId, tokenManager),
    onMutate: async ({ postId }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      
      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(postKeys.lists());
      
      // Optimistically update to the new value
      queryClient.setQueryData(postKeys.lists(), (oldData) => {
        return oldData?.filter(post => post.id !== postId) || [];
      });
      
      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (err, { postId }, context) => {
      // Only log error if it's not a 404 (post already deleted)
      if (!err.message.includes('Resource not found')) {
        console.error('Failed to delete post:', err);
      }
      
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData(postKeys.lists(), context.previousPosts);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, tokenManager, isLiked }) => 
      isLiked ? unlikePost(postId, tokenManager) : likePost(postId, tokenManager),
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