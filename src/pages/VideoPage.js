import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { videos, youtubeThumbnail, youtubeUrl } from '../data/videos';

export default function VideoPage() {
  const { category, index } = useParams();
  const navigate = useNavigate();
  const video = videos[category]?.[index];
  const [watched, setWatched] = useState(false);
  const [saving, setSaving] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    async function checkWatched() {
      if (!user) return;
      const ref = doc(db, 'users', user.uid, 'watched', `${category}-${index}`);
      const snap = await getDoc(ref);
      if (snap.exists()) setWatched(true);
    }
    checkWatched();
  }, [category, index, user]);

  async function markWatched() {
    if (!user) { navigate('/login'); return; }
    setSaving(true);
    const ref = doc(db, 'users', user.uid, 'watched', `${category}-${index}`);
    await setDoc(ref, { category, index, title: video.title, watchedAt: new Date() });
    setWatched(true);
    setSaving(false);
  }

  if (!video) return <div style={{ color: '#fff', padding: 40 }}>Video not found.</div>;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '0.5px solid #222' }}>
        <div onClick={() => navigate('/')} style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.08em', color: '#fff', cursor: 'pointer' }}>
          A<span style={{ color: '#7F77DD' }}>.</span>PEX
        </div>
        <button onClick={() => navigate(`/category/${category}`)} style={{ fontSize: 13, color: '#888', background: 'transparent', border: '0.5px solid #333', padding: '6px 16px', borderRadius: 8, cursor: 'pointer' }}>
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 40px' }}>

        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 12 }}>{category.toUpperCase()}</div>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>{video.title}</h1>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 32 }}>{video.author} · {video.duration}</div>

        <div onClick={() => window.open(youtubeUrl(video.youtubeId), '_blank')} style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, height: 220, position: 'relative', overflow: 'hidden', marginBottom: 20, cursor: 'pointer' }}>
          <img src={youtubeThumbnail(video.youtubeId, 'maxresdefault')} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#7F77DD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 12px' }}>▶</div>
              <div style={{ fontSize: 13, color: '#eee' }}>Watch on YouTube</div>
            </div>
          </div>
        </div>

        <button
          onClick={markWatched}
          disabled={watched || saving}
          style={{ width: '100%', background: watched ? '#1a1a1a' : '#7F77DD', color: watched ? '#555' : '#fff', border: watched ? '0.5px solid #333' : 'none', padding: '12px', borderRadius: 8, fontSize: 14, cursor: watched ? 'default' : 'pointer', marginBottom: 32 }}>
          {watched ? '✓ Marked as watched' : saving ? 'Saving...' : 'Mark as watched'}
        </button>

        <div style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, padding: '24px' }}>
          <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 16 }}>AI SUMMARY</div>
          <div style={{ fontSize: 14, color: '#444' }}>AI summaries coming soon.</div>
        </div>

      </div>
    </div>
  );
}
