import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videos, categories, youtubeThumbnail } from '../data/videos';
import { categoryIcons } from '../icons';
import { color, font, shadow } from '../theme';
import { TopoBackdrop } from '../components/Backdrop';

export default function Browse() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const allVideos = Object.entries(videos).flatMap(([cat, vids]) =>
    vids.map((v, i) => ({ ...v, category: cat, index: i }))
  );

  const filtered = allVideos.filter(v => {
    const matchesCat = activeCategory === 'All' || v.category === activeCategory;
    const matchesQuery = !query.trim() ||
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.author.toLowerCase().includes(query.toLowerCase()) ||
      v.category.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body, position: 'relative' }}>
      <TopoBackdrop />
      <div style={{ position: 'relative', zIndex: 1 }}>

        <nav style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 40px', background: color.bgDeep, borderBottom: `1px solid ${color.border}`, boxShadow: shadow.sm, position: 'sticky', top: 0, zIndex: 20 }}>
          <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, cursor: 'pointer', textTransform: 'uppercase' }}>
            A<span style={{ color: color.gold }}>.</span>PEX
          </div>
          <div style={{ position: 'relative', width: 320 }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search videos, creators..."
              style={{ width: '100%', background: color.surface, border: `1px solid ${color.border}`, borderRadius: 6, padding: '8px 16px', color: color.textPrimary, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: font.body }}
            />
          </div>
          <div style={{ justifySelf: 'end' }}>
            <button onClick={() => navigate('/')} style={{ fontSize: 13, color: color.textSecondary, background: 'transparent', border: `1px solid ${color.border}`, padding: '7px 16px', borderRadius: 6, cursor: 'pointer' }}>
              ← Home
            </button>
          </div>
        </nav>

        <div style={{ padding: '32px 40px 0' }}>
          <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.textMuted, marginBottom: 6 }}>BROWSE</div>
          <h1 style={{ fontFamily: font.display, fontSize: 32, fontWeight: 600, color: color.textPrimary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.01em' }}>
            {filtered.length} {activeCategory === 'All' ? 'Videos' : activeCategory + ' Videos'}
          </h1>

          {/* category filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20, marginBottom: 32 }}>
            {['All', ...categories.map(c => c.name)].map(cat => {
              const active = activeCategory === cat;
              const Icon = cat !== 'All' ? categoryIcons[cat] : null;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 6,
                    background: active ? color.gold : color.surface,
                    border: `1px solid ${active ? color.gold : color.border}`,
                    color: active ? color.bgDeep : color.textSecondary,
                    fontFamily: font.mono, fontSize: 11, letterSpacing: '0.06em',
                    cursor: 'pointer', textTransform: 'uppercase',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {Icon && <Icon width={12} height={12} style={{ color: active ? color.bgDeep : color.gold }} />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '0 40px 60px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: color.textMuted, fontFamily: font.mono, fontSize: 13 }}>
              No videos found
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {filtered.map((v, i) => {
                const isHovered = hoveredVideo === i;
                return (
                  <div
                    key={`${v.category}-${v.index}`}
                    onClick={() => navigate(`/video/${v.category}/${v.index}`)}
                    onMouseEnter={() => setHoveredVideo(i)}
                    onMouseLeave={() => setHoveredVideo(null)}
                    style={{
                      background: color.surface,
                      border: `1px solid ${isHovered ? color.goldDim : color.border}`,
                      borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                      boxShadow: isHovered ? shadow.glow : shadow.md,
                      transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <div style={{ height: 150, overflow: 'hidden', background: color.bgDeep, position: 'relative' }}>
                      <img
                        src={youtubeThumbnail(v.youtubeId, 'maxresdefault')}
                        alt={v.title}
                        onError={e => { e.target.src = youtubeThumbnail(v.youtubeId, 'hqdefault'); }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: isHovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.25s ease' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isHovered ? 'rgba(11,13,16,0.2)' : 'rgba(11,13,16,0)' , transition: 'background 0.18s ease' }}>
                        {isHovered && (
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: color.bgDeep, boxShadow: shadow.sm }}>▶</div>
                        )}
                      </div>
                      <div style={{ position: 'absolute', top: 10, left: 10 }}>
                        <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '0.08em', color: color.gold, background: color.bgDeep, border: `1px solid ${color.goldDim}`, padding: '3px 8px', borderRadius: 3 }}>
                          {v.category.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px 14px' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: color.textPrimary, lineHeight: 1.4, marginBottom: 8 }}>{v.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontFamily: font.mono, fontSize: 10, color: color.textMuted }}>{v.author.toUpperCase()}</div>
                        <div style={{ fontFamily: font.mono, fontSize: 10, color: color.textMuted }}>{v.duration}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
