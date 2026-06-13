import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function About() {
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
        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 12 }}>ABOUT</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#fff', marginBottom: 24 }}>What is Apex?</h1>

        <p style={{ fontSize: 15, color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
          Apex is a curated learning platform built for people who want to learn what school never taught them. We organize the best free videos on the internet into structured paths so you can actually make progress instead of aimlessly scrolling YouTube.
        </p>
        <p style={{ fontSize: 15, color: '#888', lineHeight: 1.8, marginBottom: 20 }}>
          Our focus areas are the things that actually matter in real life — investing, making money, building apps, fitness, AI, and life skills. Everything is hand-picked, organized by category, and designed to be as frictionless as possible.
        </p>
        <p style={{ fontSize: 15, color: '#888', lineHeight: 1.8, marginBottom: 40 }}>
          Apex was built by a teenager who got tired of school not teaching anything useful. The goal is simple — give everyone access to a real education, for free.
        </p>

        <button onClick={() => navigate('/browse')} style={{ background: '#7F77DD', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
          Start learning
        </button>
      </div>
    </div>
  );
}