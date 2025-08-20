import React from 'react';

const AuthForm = ({ 
  mode, 
  form, 
  loading, 
  error, 
  success, 
  showVerificationMessage,
  onFormChange, 
  onSubmit, 
  onModeChange
}) => {
  return (
    <div className="auth-container card fade-in">
      <h1 className="font-extrabold text-3xl mb-8 text-center">
        Welcome to <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>chatr</span>
      </h1>
      {loading && <p className="loading">Loading<span className="loading-dots"></span></p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      {showVerificationMessage && (
        <div className="verification-message mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="success mb-2">
            Account created successfully! Please check your email for verification link.
          </p>
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder.
          </p>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="auth-form">
        {mode === 'register' && (
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onFormChange}
            required
            className="input"
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onFormChange}
          required
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onFormChange}
          required
          className="input"
        />
        <button type="submit" disabled={loading} className="btn btn-primary w-full hover-lift">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
      
      <div className="switch-mode">
        {mode === 'login' ? (
          <>
            <span className="text-secondary">Don't have an account?</span>
            <button onClick={() => onModeChange('register')} className="btn btn-ghost">
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span className="text-secondary">Already have an account?</span>
            <button onClick={() => onModeChange('login')} className="btn btn-ghost">
              Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm; 