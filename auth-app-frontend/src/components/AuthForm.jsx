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
    <div className="auth-container card">
      <h1 className="font-bold text-2xl mb-6 text-center">Welcome to chatr</h1>
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
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
      
      <div className="switch-mode">
        {mode === 'login' ? (
          <>
            <span className="text-secondary">Don't have an account?</span>
            <button onClick={() => onModeChange('register')} className="btn btn-ghost">
              Register
            </button>
          </>
        ) : (
          <>
            <span className="text-secondary">Already have an account?</span>
            <button onClick={() => onModeChange('login')} className="btn btn-ghost">
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm; 