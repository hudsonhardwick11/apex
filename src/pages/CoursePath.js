import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { videos, categoryMeta } from '../data/videos';

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

  // First unwatched index is "current" / unlocked. Everything before is completed.
  // Everything after stays locked until the one before it is watched.
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
    navigate(`/video/${name}/${i}`);
  }

  const completedCount = watchedSet.size;
  const total = courseVideos.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '0.5px solid #222' }}>
        <div onClick={() => navigate('/')} style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.08em', color: '#fff', cursor: 'pointer' }}>
          A<span style={{ color: '#7F77DD' }}>.</span>PEX
        </div>
        <button onClick={() => navigate(`/category/${name}`)} style={{ fontSize: 13, color: '#888', background: 'transparent', border: '0.5px solid #333', padding: '6px 16px', borderRadius: 8, cursor: 'pointer' }}>
          Browse all instead
        </button>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 40px 100px' }}>
        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 10 }}>COURSE</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#fff', marginBottom: 8 }}>{name}</h1>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>{categoryMeta[name]?.description || ''}</p>

        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginBottom: 8 }}>
            <span>{completedCount} of {total} complete</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: '#7F77DD', borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
        </div>

        {!user && !loading && (
          <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: 20, marginBottom: 40, textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#777', marginBottom: 12 }}>Sign in to save your progress on this course</p>
            <button onClick={() => navigate('/login')} style={{ background: '#7F77DD', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
              Log in
            </button>
          </div>
        )}

        <div style={{ position: 'relative' }}>
          {courseVideos.map((v, i) => {
            const state = nodeState(i);
            const align = i % 2 === 0 ? 'flex-start' : 'flex-end';
            const isLast = i === courseVideos.length - 1;
            const circleColor = state === 'completed' ? '#7F77DD' : state === 'current' ? '#0a0a0a' : '#141414';
            const circleBorder = state === 'locked' ? '0.5px solid #262626' : '2px solid #7F77DD';
            const textColor = state === 'locked' ? '#3a3a3a' : '#fff';

            return (
              <div key={i} style={{ display: 'flex', justifyContent: align, marginBottom: isLast ? 0 : 28, position: 'relative' }}>
                {!isLast && (
                  <div style={{
                    position: 'absolute',
                    top: 60,
                    left: align === 'flex-start' ? 29 : undefined,
                    right: align === 'flex-end' ? 29 : undefined,
                    width: 2,
                    height: 28,
                    background: state === 'completed' ? '#7F77DD' : '#1e1e1e',
                  }} />
                )}
                <div
                  onClick={() => handleClick(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    cursor: state === 'locked' ? 'default' : 'pointer',
                    maxWidth: 340,
                    flexDirection: align === 'flex-end' ? 'row-reverse' : 'row',
                  }}
                >
                  <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: circleColor, border: circleBorder,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, color: state === 'locked' ? '#3a3a3a' : '#fff',
                    flexShrink: 0,
                  }}>
                    {state === 'completed' ? 'âœ“' : state === 'locked' ? 'ðŸ”’' : i + 1}
                  </div>
                  <div style={{ textAlign: align === 'flex-end' ? 'right' : 'left' }}>
                    <div style={{ fontSize: 14, color: textColor, marginBottom: 3, lineHeight: 1.3 }}>{v.title}</div>
                    <div style={{ fontSize: 11, color: state === 'locked' ? '#333' : '#666' }}>{v.author} Â· {v.duration}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {completedCount === total && total > 0 && (
          <div style={{ marginTop: 48, textAlign: 'center', background: '#111', border: '0.5px solid #7F77DD', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>ðŸŽ‰</div>
            <div style={{ fontSize: 15, color: '#fff', marginBottom: 4 }}>Course complete!</div>
            <div style={{ fontSize: 13, color: '#666' }}>You finished every video in {name}.</div>
          </div>
        )}
      </div>
    </div>
  );
}
