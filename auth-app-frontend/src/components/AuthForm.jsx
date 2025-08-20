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
        <div className="verification-message mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Account Created Successfully!
              </h3>
              <p className="text-green-700 mb-2">
                Please check your email for a verification link to complete your registration.
              </p>
              <p className="text-sm text-green-600">
                💡 <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox.
              </p>
            </div>
          </div>
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