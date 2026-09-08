import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { videos, categoryMeta } from '../data/videos';
import { color, font } from '../theme';
import AiTutor from '../components/AiTutor';

export default function CoursePath() {
  const { name } = useParams();
  const navigate = useNavigate();
  const courseVideos = videos[name] || [];
  const [user, setUser] = useState(null);
  const [watchedSet, setWatchedSet] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        const snap = await getDocs(collection(db, 'users', u.uid, 'watched'));
        const ids = snap.docs
          .map(d => d.data())
          .filter(v => v.category === name)
          .map(v => Number(v.index));
        setWatchedSet(new Set(ids));
      }
      setLoading(false);
    });
    return () => unsub();
  }, [name]);

  let currentIndex = 0;
  while (watchedSet.has(currentIndex) && currentIndex < courseVideos.length) {
    currentIndex += 1;
  }

  function nodeState(i) {
    if (watchedSet.has(i)) return 'completed';
    if (i === currentIndex) return 'current';
    return 'locked';
  }

  function handleClick(i) {
    const state = nodeState(i);
    if (state === 'locked') return;
    if (!user) { navigate('/login'); return; }
    navigate('/video/' + name + '/' + i);
  }

  const completedCount = watchedSet.size;
  const total = courseVideos.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid ' + color.border }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, cursor: 'pointer', textTransform: 'uppercase' }}>
          A<span style={{ color: color.gold }}>.</span>PEX
        </div>
        <button onClick={() => navigate('/category/' + name)} style={{ fontSize: 13, color: color.textSecondary, background: 'transparent', border: '1px solid ' + color.border, padding: '7px 16px', borderRadius: 6, cursor: 'pointer' }}>
          Browse all instead
        </button>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 40px 100px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.12em', color: color.gold, marginBottom: 12 }}>COURSE</div>
        <h1 style={{ fontFamily: font.display, fontSize: 38, fontWeight: 600, color: color.textPrimary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.01em' }}>{name}</h1>
        <p style={{ fontSize: 14, color: color.textMuted, marginBottom: 24, lineHeight: 1.5 }}>{categoryMeta[name] ? categoryMeta[name].description : ''}</p>

        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: font.mono, fontSize: 11, color: color.textSecondary, marginBottom: 8, letterSpacing: '0.04em' }}>
            <span>{completedCount} OF {total} COMPLETE</span>
            <span style={{ color: color.gold }}>{pct}%</span>
          </div>
          <div style={{ height: 5, background: color.surface, borderRadius: 3, overflow: 'hidden', border: '1px solid ' + color.border }}>
            <div style={{ height: '100%', width: pct + '%', background: color.gold, borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
        </div>

        {!user && !loading && (
          <div style={{ background: color.surface, border: '1px solid ' + color.border, borderRadius: 8, padding: 22, marginBottom: 44, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: color.textSecondary, marginBottom: 14 }}>Sign in to save your progress on this course</p>
            <button onClick={() => navigate('/login')} style={{ fontFamily: font.display, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', background: color.gold, color: '#0B0D10', border: 'none', padding: '9px 22px', borderRadius: 6, fontSize: 13, cursor: 'pointer' }}>
              Log in
            </button>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {courseVideos.map((v, i) => {
            const state = nodeState(i);
            const align = i % 2 === 0 ? 'flex-start' : 'flex-end';
            const isLast = i === courseVideos.length - 1;
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
                  onClick={() => handleClick(i)}
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
                    border: '2px solid ' + badgeBorder,
                    transform: 'rotate(45deg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: state === 'current' ? '0 0 0 4px ' + color.goldMuted : 'none',
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

        {completedCount === total && total > 0 && (
          <div style={{ marginTop: 52, textAlign: 'center', background: color.sageMuted, border: '1px solid ' + color.sage, borderRadius: 8, padding: 26 }}>
            <div style={{ fontFamily: font.display, fontSize: 16, color: color.textPrimary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Summit reached</div>
            <div style={{ fontSize: 13, color: color.textSecondary }}>You finished every video in {name}.</div>
          </div>
        )}
      </div>

      <AiTutor category={name} />
    </div>
  );
}
