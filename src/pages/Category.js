import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videos, youtubeThumbnail } from '../data/videos';
import { color, font } from '../theme';

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const categoryVideos = videos[name] || [];

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid ' + color.border }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, cursor: 'pointer', textTransform: 'uppercase' }}>
          A<span style={{ color: color.gold }}>.</span>PEX
        </div>
        <button onClick={() => navigate('/')} style={{ fontSize: 13, color: color.textSecondary, background: 'transparent', border: '1px solid ' + color.border, padding: '7px 16px', borderRadius: 6, cursor: 'pointer' }}>
          &#8592; Back
        </button>
      </nav>

      <div style={{ padding: '44px 40px 26px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.12em', color: color.gold, marginBottom: 12 }}>CATEGORY</div>
        <h1 style={{ fontFamily: font.display, fontSize: 34, fontWeight: 600, color: color.textPrimary, marginBottom: 8, textTransform: 'uppercase' }}>{name}</h1>
        <p style={{ fontFamily: font.mono, fontSize: 12, color: color.textMuted }}>{categoryVideos.length} VIDEOS</p>
      </div>

      <div style={{ padding: '0 40px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {categoryVideos.map((v, i) => (
          <div key={i} onClick={() => navigate('/video/' + name + '/' + i)} style={{ background: color.surface, border: '1px solid ' + color.border, borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
            <div style={{ width: 96, height: 60, borderRadius: 6, overflow: 'hidden', position: 'relative', flexShrink: 0, background: color.surfaceRaised }}>
              <img src={youtubeThumbnail(v.youtubeId)} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11,13,16,0.25)' }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, background: color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#0B0D10' }}>&#9654;</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: color.textPrimary, marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontFamily: font.mono, fontSize: 11, color: color.textMuted }}>{v.author.toUpperCase()}</div>
            </div>
            <div style={{ fontFamily: font.mono, fontSize: 11, color: color.textFaint }}>{v.duration}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
