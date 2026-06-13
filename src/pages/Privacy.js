import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
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

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 12 }}>PRIVACY</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#fff', marginBottom: 32 }}>Privacy policy</h1>

        {[
          { title: 'What we collect', body: 'We collect your email address when you create an account. We also store which videos you have marked as watched so we can show you your progress.' },
          { title: 'How we use your data', body: 'Your data is only used to provide the Apex service. We do not sell your data to anyone, ever. We do not use your data for advertising.' },
          { title: 'Third party services', body: 'We use Firebase by Google for authentication and data storage. Your data is stored securely on their servers. You can read their privacy policy at firebase.google.com.' },
          { title: 'Deleting your data', body: 'You can request deletion of your account and all associated data at any time by contacting us through the contact page.' },
          { title: 'Contact', body: 'If you have any questions about this privacy policy, reach out to us through the contact page.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 500, color: '#fff', marginBottom: 10 }}>{s.title}</h2>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}