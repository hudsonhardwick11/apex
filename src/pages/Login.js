import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { color, font, shadow } from '../theme';
import { TopoBackdrop } from '../components/Backdrop';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      setError('Invalid email or password.');
    }
    setLoading(false);
  }

  function onKey(e) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <TopoBackdrop />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, padding: '0 24px' }}>

        <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 22, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, marginBottom: 44, cursor: 'pointer', textAlign: 'center', textTransform: 'uppercase' }}>
          A<span style={{ color: color.gold }}>.</span>PEX
        </div>

        <div style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 12, padding: 36, boxShadow: shadow.lg }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.12em', color: color.gold, marginBottom: 10 }}>WELCOME BACK</div>
          <h2 style={{ fontFamily: font.display, fontSize: 24, fontWeight: 600, color: color.textPrimary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.01em' }}>Log in</h2>
          <p style={{ fontSize: 13, color: color.textMuted, marginBottom: 28, lineHeight: 1.5 }}>Continue your path to the summit.</p>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.08em', color: color.textMuted, marginBottom: 7 }}>EMAIL</div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={onKey}
              placeholder="you@email.com"
              style={{ width: '100%', background: color.bgDeep, border: `1px solid ${color.border}`, borderRadius: 7, padding: '10px 14px', color: color.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: font.body }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.08em', color: color.textMuted, marginBottom: 7 }}>PASSWORD</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={onKey}
              placeholder="••••••••"
              style={{ width: '100%', background: color.bgDeep, border: `1px solid ${color.border}`, borderRadius: 7, padding: '10px 14px', color: color.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: font.body }}
            />
          </div>

          {error && <div style={{ fontFamily: font.mono, fontSize: 11, color: '#E05555', marginBottom: 16, letterSpacing: '0.03em' }}>{error}</div>}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', background: loading ? color.goldDim : color.gold, color: color.bgDeep, border: 'none', padding: '12px', borderRadius: 7, fontFamily: font.display, fontWeight: 500, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: loading ? 'default' : 'pointer', marginBottom: 18, boxShadow: shadow.sm, transition: 'background 0.15s' }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <div style={{ fontSize: 13, color: color.textMuted, textAlign: 'center' }}>
            No account?{' '}
            <span onClick={() => navigate('/signup')} style={{ color: color.gold, cursor: 'pointer', fontWeight: 500 }}>Create one</span>
          </div>
        </div>

      </div>
    </div>
  );
}
