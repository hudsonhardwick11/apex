import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videos, youtubeThumbnail } from '../data/videos';

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const categoryVideos = videos[name] || [];

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

      <div style={{ padding: '40px 40px 24px' }}>
        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 10 }}>CATEGORY</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#fff', marginBottom: 8 }}>{name}</h1>
        <p style={{ fontSize: 14, color: '#555' }}>{categoryVideos.length} videos</p>
      </div>

      <div style={{ padding: '0 40px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {categoryVideos.map((v, i) => (
          <div key={i} onClick={() => navigate(`/video/${name}/${i}`)} style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
            <div style={{ width: 96, height: 60, borderRadius: 8, overflow: 'hidden', position: 'relative', flexShrink: 0, background: '#1a1a1a' }}>
              <img src={youtubeThumbnail(v.youtubeId)} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(127,119,221,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>▶</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#fff', marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 12, color: '#555' }}>{v.author}</div>
            </div>
            <div style={{ fontSize: 12, color: '#444' }}>{v.duration}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
