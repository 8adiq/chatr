import { useState, useEffect, useCallback } from 'react';
import { refreshTokens } from '../api';

export const useTokenManager = () => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || '');
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken') || '');

  // Update both tokens and store in localStorage
  const updateTokens = useCallback((newAccessToken, newRefreshToken) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  }, []);

  // Clear both tokens from state and localStorage
  const clearTokens = useCallback(() => {
    setAccessToken('');
    setRefreshToken('');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  // Refresh access token using refresh token
  const refreshAccessToken = useCallback(async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const data = await refreshTokens(refreshToken);
      updateTokens(data.token, data.refresh_token);
      return data.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      throw error;
    }
  }, [refreshToken, updateTokens, clearTokens]);

  // Check if token is expired (simple check - you might want to decode JWT to check expiry)
  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }, []);

  // Get valid access token (refresh if needed)
  const getValidAccessToken = useCallback(async () => {
    if (!accessToken || isTokenExpired(accessToken)) {
      return await refreshAccessToken();
    }
    return accessToken;
  }, [accessToken, isTokenExpired, refreshAccessToken]);

  return {
    accessToken,
    refreshToken,
    updateTokens,
    clearTokens,
    refreshAccessToken,
    getValidAccessToken,
    isTokenExpired
  };
}; 