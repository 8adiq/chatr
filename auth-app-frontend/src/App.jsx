import { useState, useEffect } from 'react';
import './App.css';
import { register, login, getProfile } from './api';

function App() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'profile'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      setLoading(true);
      getProfile(token)
        .then((data) => {
          setUser(data.user);
          setMode('profile');
        })
        .catch(() => {
          setToken('');
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await register(form);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setMode('profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await login(form);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setMode('profile');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    setForm({ username: '', email: '', password: '' });
    setMode('login');
  };

  console.log('mode:', mode, 'user:', user);
  return (
    <div className="auth-container">
      <h1>Auth App</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {mode === 'profile' && user && (
        <div>
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      {(mode === 'login' || mode === 'register') && (
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="auth-form">
          {mode === 'register' && (
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      )}
      {mode !== 'profile' && (
        <div className="switch-mode">
          {mode === 'login' ? (
            <>
              <span>Don't have an account?</span>
              <button onClick={() => { setMode('register'); setError(''); }}>Register</button>
            </>
          ) : (
            <>
              <span>Already have an account?</span>
              <button onClick={() => { setMode('login'); setError(''); }}>Login</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
