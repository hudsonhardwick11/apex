import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Community() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '0.5px solid #222' }}>
        <div onClick={() => navigate('/')} style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.08em', color: '#fff', cursor: 'pointer' }}>
          A<span style={{ color: '#7F77DD' }}>.</span>PEX
        </div>
        <button onClick={() => navigate('/')} style={{ fontSize: 13, color: '#888', background: 'transparent', border: '0.5px solid #333', padding: '6px 16px', borderRadius: 8, cursor: 'pointer' }}>
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>🚧</div>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: '#fff', marginBottom: 12 }}>Community coming soon</h1>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7, marginBottom: 32 }}>
          We're building a space where you can connect with other people learning the same skills, share wins, and hold each other accountable. Check back soon.
        </p>
        <button onClick={() => navigate('/')} style={{ background: '#7F77DD', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
          Back to home
        </button>
      </div>
    </div>
  );
}