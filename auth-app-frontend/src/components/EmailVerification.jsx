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
    <div className="auth-container card fade-in" style={{ maxWidth: '450px', minHeight: '350px' }}>
      <h1 className="font-extrabold text-3xl mb-8 text-center" style={{ textAlign: 'center', width: '100%' }}>
        chatr
      </h1>
      
      {status === 'verifying' && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          minHeight: '300px'
        }}>
          <p className="loading">Verifying your email<span className="loading-dots"></span></p>
        </div>
      )}
      
      {status === 'success' && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          minHeight: '300px'
        }}>
          <p style={{ color: 'var(--success)', fontSize: '1rem', marginBottom: '2rem', textAlign: 'center' }}>{message}</p>
          <button onClick={handleRedirect} className="btn btn-primary">
            Continue to Login
          </button>
        </div>
      )}
      
      {status === 'error' && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          minHeight: '300px'
        }}>
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

