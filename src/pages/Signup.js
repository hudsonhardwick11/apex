import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      setError('Could not create account. Try a stronger password.');
    }
    setLoading(false);
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>

        <div onClick={() => navigate('/')} style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.08em', color: '#fff', marginBottom: 40, cursor: 'pointer', textAlign: 'center' }}>
          A<span style={{ color: '#7F77DD' }}>.</span>PEX
        </div>

        <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 500, color: '#fff', marginBottom: 8 }}>Create your account</h2>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 28 }}>Start learning what school never taught you</p>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Email</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{ width: '100%', background: '#0a0a0a', border: '0.5px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Password</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', background: '#0a0a0a', border: '0.5px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {error && <div style={{ fontSize: 13, color: '#e05555', marginBottom: 16 }}>{error}</div>}

          <button
            onClick={handleSignup}
            disabled={loading}
            style={{ width: '100%', background: '#7F77DD', color: '#fff', border: 'none', padding: '11px', borderRadius: 8, fontSize: 14, cursor: 'pointer', marginBottom: 16 }}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <div style={{ fontSize: 13, color: '#555', textAlign: 'center' }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#7F77DD', cursor: 'pointer' }}>Log in</span>
          </div>
        </div>

      </div>
    </div>
  );
}