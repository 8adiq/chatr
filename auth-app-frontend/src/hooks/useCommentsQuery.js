import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment } from '../api';

// Query keys
export const commentKeys = {
  all: ['comments'],
  lists: () => [...commentKeys.all, 'list'],
  list: (postId) => [...commentKeys.lists(), postId],
  details: () => [...commentKeys.all, 'detail'],
  detail: (id) => [...commentKeys.details(), id],
};

export const useComments = (postId) => {
  return useQuery({
    queryKey: commentKeys.list(postId),
    queryFn: () => getComments(postId),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, commentData, token }) => 
      createComment(postId, commentData, token),
    onSuccess: (newComment, { postId }) => {
      // Add the new comment to the cache
      queryClient.setQueryData(commentKeys.list(postId), (oldData) => {
        return oldData ? [...oldData, newComment] : [newComment];
      });
    },
    onError: (error) => {
      console.error('Failed to create comment:', error);
    },
  });
}; 