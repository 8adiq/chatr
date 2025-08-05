import React from 'react';

const AuthForm = ({ 
  mode, 
  form, 
  loading, 
  error, 
  success, 
  onFormChange, 
  onSubmit, 
  onModeChange
}) => {
  return (
    <div className="auth-container">
      <h1>Welcome to chatr</h1>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <form onSubmit={onSubmit} className="auth-form">
        {mode === 'register' && (
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onFormChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onFormChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onFormChange}
          required
        />
        <button type="submit" disabled={loading}>
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      
      <div className="switch-mode">
        {mode === 'login' ? (
          <>
            <span>Don't have an account?</span>
            <button onClick={() => onModeChange('register')}>
              Register
            </button>
          </>
        ) : (
          <>
            <span>Already have an account?</span>
            <button onClick={() => onModeChange('login')}>
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm; 