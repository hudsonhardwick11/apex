import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { color, font, shadow } from '../theme';
import { TopoBackdrop } from '../components/Backdrop';

const PERKS = [
  'Track your progress across all 60 videos',
  'Unlock the AI course tutor on every lesson',
  'Appear on the community leaderboard',
  'Your progress saves automatically',
];

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else {
        setError('Could not create account. Try a stronger password.');
      }
    }
    setLoading(false);
  }

  function onKey(e) {
    if (e.key === 'Enter') handleSignup();
  }

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <TopoBackdrop />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 820, padding: '40px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>

        {/* Left — value prop */}
        <div>
          <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 22, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, marginBottom: 32, cursor: 'pointer', textTransform: 'uppercase' }}>
            A<span style={{ color: color.gold }}>.</span>PEX
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.12em', color: color.gold, marginBottom: 12 }}>FREE FOREVER</div>
          <h1 style={{ fontFamily: font.display, fontSize: 32, fontWeight: 600, color: color.textPrimary, marginBottom: 16, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '0.01em' }}>
            Learn what school<br />never taught you
          </h1>
          <p style={{ fontSize: 14, color: color.textMuted, lineHeight: 1.65, marginBottom: 28 }}>
            60 curated videos on investing, building apps, making money, fitness, and life skills. Organized so you can actually learn.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PERKS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: color.goldMuted, border: `1px solid ${color.goldDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: color.gold, flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: 13, color: color.textSecondary }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 12, padding: 36, boxShadow: shadow.lg }}>
          <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '0.12em', color: color.gold, marginBottom: 10 }}>GET STARTED</div>
          <h2 style={{ fontFamily: font.display, fontSize: 22, fontWeight: 600, color: color.textPrimary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.01em' }}>Create account</h2>
          <p style={{ fontSize: 13, color: color.textMuted, marginBottom: 28 }}>It's free. Always.</p>

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
              placeholder="6+ characters"
              style={{ width: '100%', background: color.bgDeep, border: `1px solid ${color.border}`, borderRadius: 7, padding: '10px 14px', color: color.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: font.body }}
            />
          </div>

          {error && <div style={{ fontFamily: font.mono, fontSize: 11, color: '#E05555', marginBottom: 16, letterSpacing: '0.03em' }}>{error}</div>}

          <button
            onClick={handleSignup}
            disabled={loading}
            style={{ width: '100%', background: loading ? color.goldDim : color.gold, color: color.bgDeep, border: 'none', padding: '12px', borderRadius: 7, fontFamily: font.display, fontWeight: 500, fontSize: 14, letterSpacing: '0.04em', textTransform: 'uppercase', cursor: loading ? 'default' : 'pointer', marginBottom: 16, boxShadow: shadow.sm, transition: 'background 0.15s' }}>
            {loading ? 'Creating account...' : 'Start learning →'}
          </button>

          <div style={{ fontSize: 12, color: color.textMuted, textAlign: 'center' }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{ color: color.gold, cursor: 'pointer', fontWeight: 500 }}>Log in</span>
          </div>
        </div>

      </div>
    </div>
  );
}
