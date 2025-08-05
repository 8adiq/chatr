import { useState, useEffect } from 'react';
import { register, login, getProfile } from '../api';

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (token) {
      setLoading(true);
      getProfile(token)
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          setToken('');
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const data = await register(formData);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setSuccess('Registration successful!');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const data = await login(formData);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setSuccess('Login successful!');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    setError('');
    setSuccess('');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    token,
    user,
    loading,
    error,
    success,
    handleRegister,
    handleLogin,
    handleLogout,
    clearMessages
  };
}; 