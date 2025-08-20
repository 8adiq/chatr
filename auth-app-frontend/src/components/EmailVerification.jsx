import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    const verifyUserEmail = async () => {
      try {
        const result = await verifyEmail(token);
        
        if (result.success) {
          setStatus('success');
          setMessage(result.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(result.message || 'Verification failed.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'An error occurred during verification.');
      }
    };

    verifyUserEmail();
  }, [searchParams]);

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className="auth-container card fade-in">
      <h1 className="font-extrabold text-3xl mb-8 text-center">
        Email Verification
      </h1>
      
      {status === 'verifying' && (
        <div className="text-center">
          <p className="loading">Verifying your email<span className="loading-dots"></span></p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="text-center">
          <div className="success-icon mb-4 text-4xl">✅</div>
          <p className="success mb-4">{message}</p>
          <button onClick={handleRedirect} className="btn btn-primary">
            Continue to Login
          </button>
        </div>
      )}
      
      {status === 'error' && (
        <div className="text-center">
          <div className="error-icon mb-4 text-4xl">❌</div>
          <p className="error mb-4">{message}</p>
          <button onClick={handleRedirect} className="btn btn-secondary">
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

