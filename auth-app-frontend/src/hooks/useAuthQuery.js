import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { register, login, getProfile, getUserLikes } from '../api';

// Query keys
export const authKeys = {
  all: ['auth'],
  profile: () => [...authKeys.all, 'profile'],
  user: (token) => [...authKeys.all, 'user', token],
};

export const useProfile = (token) => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => getProfile(token),
    enabled: !!token,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials) => login(credentials),
    onSuccess: (data) => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => register(userData),
    onSuccess: (data) => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

export const useUserLikes = (token) => {
  return useQuery({
    queryKey: ['userLikes'],
    queryFn: () => getUserLikes(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 