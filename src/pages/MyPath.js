import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { videos, categories } from '../data/videos';
import { categoryIcons } from '../icons';
import { color, font, shadow } from '../theme';
import { TopoBackdrop } from '../components/Backdrop';

const TOTAL = Object.values(videos).reduce((s, v) => s + v.length, 0);

export default function MyPath() {
  const navigate = useNavigate();
  const [watched, setWatched] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        const snap = await getDocs(collection(db, 'users', u.uid, 'watched'));
        setWatched(snap.docs.map(d => d.data()));
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const pct = TOTAL > 0 ? Math.round((watched.length / TOTAL) * 100) : 0;

  const byCat = categories.map(cat => {
    const done = watched.filter(w => w.category === cat.name).length;
    return { ...cat, done, pct: cat.count > 0 ? Math.round((done / cat.count) * 100) : 0 };
  });

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body, position: 'relative' }}>
      <TopoBackdrop />
      <div style={{ position: 'relative', zIndex: 1 }}>

        <nav style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 40px', background: color.bgDeep, borderBottom: `1px solid ${color.border}`, boxShadow: shadow.sm, position: 'sticky', top: 0, zIndex: 20 }}>
          <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, cursor: 'pointer', textTransform: 'uppercase' }}>
            A<span style={{ color: color.gold }}>.</span>PEX
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.textMuted }}>MY PATH</div>
          <div style={{ justifySelf: 'end' }}>
            <button onClick={() => navigate('/')} style={{ fontSize: 13, color: color.textSecondary, background: 'transparent', border: `1px solid ${color.border}`, padding: '7px 16px', borderRadius: 6, cursor: 'pointer' }}>
              ← Home
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 40px 80px' }}>

          {!user && !loading && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontFamily: font.display, fontSize: 28, color: color.textPrimary, marginBottom: 12, textTransform: 'uppercase' }}>Track your progress</div>
              <p style={{ fontSize: 14, color: color.textMuted, marginBottom: 28, lineHeight: 1.6 }}>Sign in to see which videos you've completed and track your path to the summit.</p>
              <button onClick={() => navigate('/login')} style={{ fontFamily: font.display, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', background: color.gold, color: color.bgDeep, border: 'none', padding: '10px 28px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
                Log in
              </button>
            </div>
          )}

          {user && loading && (
            <div style={{ fontFamily: font.mono, fontSize: 12, color: color.textMuted, textAlign: 'center', padding: '80px 0' }}>Loading...</div>
          )}

          {user && !loading && (
            <>
              <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.textMuted, marginBottom: 8 }}>OVERALL PROGRESS</div>
              <div style={{ fontFamily: font.display, fontSize: 38, fontWeight: 600, color: color.textPrimary, marginBottom: 4, textTransform: 'uppercase' }}>
                {watched.length} <span style={{ fontSize: 20, color: color.textMuted }}>/ {TOTAL} VIDEOS</span>
              </div>
              <div style={{ fontFamily: font.mono, fontSize: 11, color: color.gold, marginBottom: 20, letterSpacing: '0.05em' }}>{pct}% COMPLETE</div>
              <div style={{ height: 6, background: color.surface, borderRadius: 3, overflow: 'hidden', marginBottom: 52, border: `1px solid ${color.border}` }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color.gold, borderRadius: 3, transition: 'width 0.4s ease' }} />
              </div>

              <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.textMuted, marginBottom: 16 }}>BY TOPIC</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 52 }}>
                {byCat.map(cat => {
                  const Icon = categoryIcons[cat.name];
                  return (
                    <div
                      key={cat.name}
                      onClick={() => navigate(`/course/${cat.name}`)}
                      style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 8, padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: color.goldMuted, border: `1px solid ${color.goldDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon width={18} height={18} style={{ color: color.gold }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: color.textPrimary }}>{cat.name}</div>
                          <div style={{ fontFamily: font.mono, fontSize: 10, color: cat.done === cat.count ? color.sage : color.textMuted }}>
                            {cat.done}/{cat.count}
                          </div>
                        </div>
                        <div style={{ height: 3, background: color.surfaceRaised, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${cat.pct}%`, background: cat.done === cat.count ? color.sage : color.gold, borderRadius: 2, transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {watched.length > 0 && (
                <>
                  <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.textMuted, marginBottom: 16 }}>RECENTLY WATCHED</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...watched].slice(-8).reverse().map((v, i) => (
                      <div
                        key={i}
                        onClick={() => navigate(`/video/${v.category}/${v.index}`)}
                        style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 8, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: color.sageMuted, border: `1px solid ${color.sage}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: color.sage, flexShrink: 0 }}>✓</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, color: color.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.title}</div>
                          <div style={{ fontFamily: font.mono, fontSize: 10, color: color.textMuted, marginTop: 2 }}>{v.category?.toUpperCase()}</div>
                        </div>
                        <div style={{ fontFamily: font.mono, fontSize: 10, color: color.gold }}>REWATCH →</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {watched.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ fontSize: 14, color: color.textMuted, marginBottom: 20 }}>No videos watched yet. Start your path.</p>
                  <button onClick={() => navigate('/browse')} style={{ fontFamily: font.display, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', background: color.gold, color: color.bgDeep, border: 'none', padding: '10px 24px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
                    Browse videos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
