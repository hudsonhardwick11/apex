import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { videos, categories } from '../data/videos';
import { categoryIcons } from '../icons';
import { color, font } from '../theme';

const TOTAL_VIDEOS = Object.values(videos).reduce((sum, v) => sum + v.length, 0);

export default function FullPath() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [watchedMap, setWatchedMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        const snap = await getDocs(collection(db, 'users', u.uid, 'watched'));
        const map = {};
        snap.docs.forEach(d => {
          const data = d.data();
          if (!map[data.category]) map[data.category] = new Set();
          map[data.category].add(Number(data.index));
        });
        setWatchedMap(map);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const totalWatched = Object.values(watchedMap).reduce((sum, s) => sum + s.size, 0);
  const overallPct = TOTAL_VIDEOS > 0 ? Math.round((totalWatched / TOTAL_VIDEOS) * 100) : 0;

  function nodeState(cat, i) {
    const set = watchedMap[cat] || new Set();
    if (set.has(i)) return 'completed';
    let current = 0;
    while (set.has(current) && current < videos[cat].length) current += 1;
    if (i === current) return 'current';
    return 'locked';
  }

  function handleClick(cat, i) {
    const state = nodeState(cat, i);
    if (state === 'locked') return;
    if (!user) { navigate('/login'); return; }
    navigate(`/video/${cat}/${i}`);
  }

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body }}>

      <nav style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 40px', borderBottom: `1px solid ${color.border}` }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, cursor: 'pointer', textTransform: 'uppercase', justifySelf: 'start' }}>
          A<span style={{ color: color.gold }}>.</span>PEX
        </div>
        <div />
        <button onClick={() => navigate('/')} style={{ justifySelf: 'end', fontSize: 13, color: color.textSecondary, background: 'transparent', border: `1px solid ${color.border}`, padding: '7px 16px', borderRadius: 6, cursor: 'pointer' }}>
          ← Home
        </button>
      </nav>

      <div style={{ maxWidth: 620, margin: '0 auto', padding: '48px 40px 100px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.12em', color: color.gold, marginBottom: 12 }}>THE FULL PATH</div>
        <h1 style={{ fontFamily: font.display, fontSize: 38, fontWeight: 600, color: color.textPrimary, marginBottom: 10, letterSpacing: '0.01em' }}>
          Every topic. One journey.
        </h1>
        <p style={{ fontSize: 14, color: color.textMuted, marginBottom: 24, lineHeight: 1.5 }}>
          All {categories.length} courses, chained together into a single path from start to finish.
        </p>

        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: font.mono, fontSize: 11, color: color.textSecondary, marginBottom: 8, letterSpacing: '0.04em' }}>
            <span>{totalWatched} OF {TOTAL_VIDEOS} COMPLETE</span>
            <span style={{ color: color.gold }}>{overallPct}%</span>
          </div>
          <div style={{ height: 5, background: color.surface, borderRadius: 3, overflow: 'hidden', border: `1px solid ${color.border}` }}>
            <div style={{ height: '100%', width: overallPct + '%', background: color.gold, borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
        </div>

        {!user && !loading && (
          <div style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 8, padding: 22, marginBottom: 44, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: color.textSecondary, marginBottom: 14 }}>Sign in to track your progress across every topic</p>
            <button onClick={() => navigate('/login')} style={{ fontFamily: font.display, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', background: color.gold, color: '#0B0D10', border: 'none', padding: '9px 22px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
              Log in
            </button>
          </div>
        )}

        {categories.map((cat, catIndex) => {
          const Icon = categoryIcons[cat.name];
          const catVideos = videos[cat.name];
          const catWatched = (watchedMap[cat.name] || new Set()).size;

          return (
            <div key={cat.name} style={{ marginBottom: 56 }}>
              <div
                onClick={() => navigate(`/course/${cat.name}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, cursor: 'pointer' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: color.goldMuted, border: `1px solid ${color.goldDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon width={20} height={20} style={{ color: color.gold }} />
                </div>
                <div>
                  <div style={{ fontFamily: font.display, fontSize: 18, fontWeight: 600, color: color.textPrimary, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{cat.name}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 10, color: color.textMuted, letterSpacing: '0.03em' }}>{catWatched} OF {catVideos.length} COMPLETE</div>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                {catVideos.map((v, i) => {
                  const state = nodeState(cat.name, i);
                  const align = i % 2 === 0 ? 'flex-start' : 'flex-end';
                  const isLast = i === catVideos.length - 1;
                  const badgeFill = state === 'completed' ? color.sage : state === 'current' ? color.bg : color.surface;
                  const badgeBorder = state === 'locked' ? color.border : state === 'completed' ? color.sage : color.gold;
                  const textColor = state === 'locked' ? color.textFaint : color.textPrimary;
                  const nodeLabel = state === 'completed' ? 'DONE' : state === 'locked' ? 'LOCKED' : String(i + 1).padStart(2, '0');

                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: align, marginBottom: isLast ? 0 : 30, position: 'relative' }}>
                      {!isLast && (
                        <div style={{
                          position: 'absolute',
                          top: 62,
                          left: align === 'flex-start' ? 29 : undefined,
                          right: align === 'flex-end' ? 29 : undefined,
                          width: 2,
                          height: 30,
                          background: state === 'completed' ? color.sage : color.border,
                        }} />
                      )}
                      <div
                        onClick={() => handleClick(cat.name, i)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 16,
                          cursor: state === 'locked' ? 'default' : 'pointer',
                          maxWidth: 350,
                          flexDirection: align === 'flex-end' ? 'row-reverse' : 'row',
                        }}
                      >
                        <div style={{
                          width: 60, height: 60,
                          background: badgeFill,
                          border: `2px solid ${badgeBorder}`,
                          transform: 'rotate(45deg)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: state === 'current' ? `0 0 0 4px ${color.goldMuted}` : 'none',
                        }}>
                          <span style={{
                            transform: 'rotate(-45deg)',
                            fontFamily: font.mono, fontWeight: 500,
                            fontSize: state === 'completed' || state === 'locked' ? 8 : 18,
                            color: state === 'locked' ? color.textFaint : state === 'completed' ? '#0B0D10' : color.gold,
                            letterSpacing: '0.02em',
                          }}>
                            {nodeLabel}
                          </span>
                        </div>
                        <div style={{ textAlign: align === 'flex-end' ? 'right' : 'left' }}>
                          <div style={{ fontSize: 14, color: textColor, marginBottom: 4, lineHeight: 1.3 }}>{v.title}</div>
                          <div style={{ fontFamily: font.mono, fontSize: 10, color: state === 'locked' ? color.textFaint : color.textMuted, letterSpacing: '0.03em' }}>{v.author.toUpperCase()} - {v.duration}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {catIndex < categories.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                  <div style={{ width: 2, height: 40, background: color.border }} />
                </div>
              )}
            </div>
          );
        })}

        {totalWatched === TOTAL_VIDEOS && TOTAL_VIDEOS > 0 && (
          <div style={{ marginTop: 20, textAlign: 'center', background: color.sageMuted, border: `1px solid ${color.sage}`, borderRadius: 8, padding: 26 }}>
            <div style={{ fontFamily: font.display, fontSize: 16, color: color.textPrimary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.02em' }}>You reached the summit</div>
            <div style={{ fontSize: 13, color: color.textSecondary }}>Every video, every topic. Done.</div>
          </div>
        )}
      </div>
    </div>
  );
}
