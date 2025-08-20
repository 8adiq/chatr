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
    // Ensure proper page sizing and alignment when redirecting
    document.body.style.fontSize = '16px';
    document.documentElement.style.fontSize = '16px';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Force a reflow to ensure proper layout
    setTimeout(() => {
      window.scrollTo(0, 0);
      navigate('/');
    }, 100);
  };

  return (
    <div className="auth-container card fade-in">
      <h1 className="font-extrabold text-3xl mb-8 text-center">
        <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>chatr</span>
      </h1>
      
      {status === 'verifying' && (
        <div style={{ 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}>
          <p className="loading">Verifying your email<span className="loading-dots"></span></p>
        </div>
      )}
      
      {status === 'success' && (
        <div style={{ 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-primary)', 
            marginBottom: '2.5rem',
            lineHeight: '1.6',
            maxWidth: '400px'
          }}>
            {message}
          </p>
          <button 
            onClick={handleRedirect} 
            style={{
              background: 'var(--accent-gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
            }}
          >
            Continue to Login
          </button>
        </div>
      )}
      
      {status === 'error' && (
        <div style={{ 
          textAlign: 'center', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--error)', 
            marginBottom: '2.5rem',
            lineHeight: '1.6',
            maxWidth: '400px'
          }}>
            {message}
          </p>
          <button 
            onClick={handleRedirect} 
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'var(--glass-bg)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

