import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit() {
    if (!email || !message) return;
    setSubmitted(true);
  }

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

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 12 }}>CONTACT</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#fff', marginBottom: 8 }}>Get in touch</h1>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 32 }}>Have a suggestion, question, or just want to say hi?</p>

        {submitted ? (
          <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
            <p style={{ fontSize: 14, color: '#fff', marginBottom: 8 }}>Message sent!</p>
            <p style={{ fontSize: 13, color: '#555' }}>We'll get back to you soon.</p>
          </div>
        ) : (
          <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: 32 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Your email</div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={{ width: '100%', background: '#0a0a0a', border: '0.5px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>Message</div>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                rows={5}
                style={{ width: '100%', background: '#0a0a0a', border: '0.5px solid #333', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>
            <button onClick={handleSubmit} style={{ width: '100%', background: '#7F77DD', color: '#fff', border: 'none', padding: '11px', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
              Send message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}