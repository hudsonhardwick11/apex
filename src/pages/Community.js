import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { videos } from '../data/videos';
import { color, font, shadow } from '../theme';
import { TopoBackdrop } from '../components/Backdrop';

const TOTAL = Object.values(videos).reduce((s, v) => s + v.length, 0);

// Rank badge for top 3
function RankBadge({ rank }) {
  const medals = { 1: { bg: '#D4AF37', label: '1ST' }, 2: { bg: '#9E9E9E', label: '2ND' }, 3: { bg: '#CD7F32', label: '3RD' } };
  const m = medals[rank];
  if (!m) return <div style={{ fontFamily: font.mono, fontSize: 11, color: color.textMuted, width: 40, textAlign: 'center' }}>#{rank}</div>;
  return (
    <div style={{ width: 40, height: 40, borderRadius: 8, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.mono, fontSize: 9, fontWeight: 700, color: '#000', letterSpacing: '0.04em', flexShrink: 0 }}>
      {m.label}
    </div>
  );
}

export default function Community() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u);

      // Publish current user's public stats so they appear on the board
      if (u) {
        const watchedSnap = await getDocs(collection(db, 'users', u.uid, 'watched'));
        const count = watchedSnap.docs.length;
        await setDoc(doc(db, 'leaderboard', u.uid), {
          uid: u.uid,
          email: u.email,
          displayName: u.email?.split('@')[0] || 'Learner',
          watched: count,
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }

      // Load all public leaderboard entries
      try {
        const snap = await getDocs(collection(db, 'leaderboard'));
        const entries = snap.docs
          .map(d => d.data())
          .filter(d => d.watched > 0)
          .sort((a, b) => b.watched - a.watched)
          .slice(0, 50);
        setLeaderboard(entries);
        if (u) {
          const rank = entries.findIndex(e => e.uid === u.uid) + 1;
          setUserRank(rank > 0 ? rank : null);
        }
      } catch (e) {
        console.error('Leaderboard load error:', e);
      }

      setLoading(false);
    });
    return () => unsub();
  }, []);

  const stats = {
    totalVideos: TOTAL,
    totalLearners: leaderboard.length,
    avgWatched: leaderboard.length > 0 ? Math.round(leaderboard.reduce((s, e) => s + e.watched, 0) / leaderboard.length) : 0,
  };

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body, position: 'relative' }}>
      <TopoBackdrop />
      <div style={{ position: 'relative', zIndex: 1 }}>

        <nav style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 40px', background: color.bgDeep, borderBottom: `1px solid ${color.border}`, boxShadow: shadow.sm, position: 'sticky', top: 0, zIndex: 20 }}>
          <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, cursor: 'pointer', textTransform: 'uppercase' }}>
            A<span style={{ color: color.gold }}>.</span>PEX
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.textMuted }}>COMMUNITY</div>
          <div style={{ justifySelf: 'end' }}>
            <button onClick={() => navigate('/')} style={{ fontSize: 13, color: color.textSecondary, background: 'transparent', border: `1px solid ${color.border}`, padding: '7px 16px', borderRadius: 6, cursor: 'pointer' }}>
              ← Home
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 40px 80px' }}>

          <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.textMuted, marginBottom: 8 }}>LEADERBOARD</div>
          <h1 style={{ fontFamily: font.display, fontSize: 36, fontWeight: 600, color: color.textPrimary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.01em' }}>Who's climbing fastest</h1>
          <p style={{ fontSize: 14, color: color.textMuted, lineHeight: 1.6, marginBottom: 36 }}>
            Ranked by videos completed. Each video you finish moves you up.
          </p>

          {/* stat pills */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 44 }}>
            {[
              { label: 'Total videos', value: stats.totalVideos },
              { label: 'Learners', value: stats.totalLearners || '—' },
              { label: 'Avg watched', value: stats.avgWatched || '—' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: color.surface, border: `1px solid ${color.border}`, borderRadius: 8, padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: font.display, fontSize: 24, fontWeight: 600, color: color.gold, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontFamily: font.mono, fontSize: 10, color: color.textMuted, letterSpacing: '0.06em' }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {user && userRank && (
            <div style={{ background: color.goldMuted, border: `1px solid ${color.goldDim}`, borderRadius: 8, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontFamily: font.mono, fontSize: 11, color: color.gold }}>YOUR RANK</div>
              <div style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, color: color.gold }}>#{userRank}</div>
              <div style={{ fontFamily: font.mono, fontSize: 10, color: color.textMuted, marginLeft: 'auto' }}>
                {leaderboard.find(e => e.uid === user.uid)?.watched || 0} VIDEOS WATCHED
              </div>
            </div>
          )}

          {!user && !loading && (
            <div style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: 8, padding: 22, marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, color: color.textSecondary }}>Sign in to appear on the leaderboard</div>
              <button onClick={() => navigate('/login')} style={{ fontFamily: font.display, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase', background: color.gold, color: color.bgDeep, border: 'none', padding: '8px 18px', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
                Log in
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ fontFamily: font.mono, fontSize: 12, color: color.textMuted, textAlign: 'center', padding: 40 }}>Loading...</div>
          ) : leaderboard.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 14, color: color.textMuted, marginBottom: 4 }}>No one on the board yet.</div>
              <div style={{ fontFamily: font.mono, fontSize: 12, color: color.textMuted }}>Be the first — watch a video and you'll appear here.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leaderboard.map((entry, i) => {
                const isYou = user && entry.uid === user.uid;
                const pct = Math.round((entry.watched / TOTAL) * 100);
                return (
                  <div
                    key={entry.uid}
                    style={{
                      background: isYou ? color.goldMuted : color.surface,
                      border: `1px solid ${isYou ? color.goldDim : color.border}`,
                      borderRadius: 8, padding: '12px 16px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      boxShadow: isYou ? shadow.glow : 'none',
                    }}
                  >
                    <RankBadge rank={i + 1} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: isYou ? color.gold : color.textPrimary }}>
                          {entry.displayName}{isYou ? ' (you)' : ''}
                        </div>
                        <div style={{ fontFamily: font.mono, fontSize: 10, color: color.textMuted }}>
                          {entry.watched}/{TOTAL} · {pct}%
                        </div>
                      </div>
                      <div style={{ height: 3, background: color.surfaceRaised, borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: isYou ? color.gold : color.border, borderRadius: 2 }} />
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
