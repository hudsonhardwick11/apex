import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/videos';
import { categoryIcons } from '../icons';

export default function Browse() {
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

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 40px' }}>
        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 12 }}>BROWSE</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#fff', marginBottom: 8 }}>All categories</h1>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 32 }}>Pick a category and start learning</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 12 }}>
          {categories.map(cat => {
            const Icon = categoryIcons[cat.name];
            return (
              <div key={cat.name} onClick={() => navigate(`/category/${cat.name}`)} style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: '20px', cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(127,119,221,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon width={24} height={24} style={{ color: '#7F77DD' }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{cat.name}</div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 6, lineHeight: 1.4 }}>{cat.description}</div>
                  <div style={{ fontSize: 11, color: '#7F77DD' }}>{cat.count} videos</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
