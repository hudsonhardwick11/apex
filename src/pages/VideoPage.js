import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { videos, youtubeThumbnail, youtubeUrl } from '../data/videos';
import { color, font } from '../theme';
import AiTutor from '../components/AiTutor';

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
      const ref = doc(db, 'users', user.uid, 'watched', category + '-' + index);
      const snap = await getDoc(ref);
      if (snap.exists()) setWatched(true);
    }
    checkWatched();
  }, [category, index, user]);

  async function markWatched() {
    if (!user) { navigate('/login'); return; }
    setSaving(true);
    const ref = doc(db, 'users', user.uid, 'watched', category + '-' + index);
    await setDoc(ref, { category, index, title: video.title, watchedAt: new Date() });
    setWatched(true);
    setSaving(false);
  }

  if (!video) return <div style={{ color: color.textPrimary, background: color.bg, minHeight: '100vh', padding: 40, fontFamily: font.body }}>Video not found.</div>;

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid ' + color.border }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, cursor: 'pointer', textTransform: 'uppercase' }}>
          A<span style={{ color: color.gold }}>.</span>PEX
        </div>
        <button onClick={() => navigate('/category/' + category)} style={{ fontSize: 13, color: color.textSecondary, background: 'transparent', border: '1px solid ' + color.border, padding: '7px 16px', borderRadius: 6, cursor: 'pointer' }}>
          &#8592; Back
        </button>
      </nav>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '44px 40px' }}>

        <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.gold, marginBottom: 14 }}>{category.toUpperCase()}</div>
        <h1 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 600, color: color.textPrimary, marginBottom: 10, lineHeight: 1.25 }}>{video.title}</h1>
        <div style={{ fontFamily: font.mono, fontSize: 12, color: color.textMuted, marginBottom: 32 }}>{video.author.toUpperCase()} · {video.duration}</div>

        <div onClick={() => window.open(youtubeUrl(video.youtubeId), '_blank')} style={{ background: color.surface, border: '1px solid ' + color.border, borderRadius: 10, height: 220, position: 'relative', overflow: 'hidden', marginBottom: 20, cursor: 'pointer' }}>
          <img src={youtubeThumbnail(video.youtubeId, 'maxresdefault')} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11,13,16,0.4)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, background: color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 12px', color: '#0B0D10' }}>&#9654;</div>
              <div style={{ fontFamily: font.mono, fontSize: 12, color: color.textPrimary, letterSpacing: '0.03em' }}>WATCH ON YOUTUBE</div>
            </div>
          </div>
        </div>

        <button
          onClick={markWatched}
          disabled={watched || saving}
          style={{
            width: '100%',
            background: watched ? color.sageMuted : color.gold,
            color: watched ? color.sage : '#0B0D10',
            border: watched ? '1px solid ' + color.sage : 'none',
            padding: '13px',
            borderRadius: 6,
            fontFamily: font.display, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase',
            fontSize: 13,
            cursor: watched ? 'default' : 'pointer',
            marginBottom: 32,
          }}>
          {watched ? 'MARKED AS WATCHED' : saving ? 'SAVING...' : 'MARK AS WATCHED'}
        </button>

        <div style={{ background: color.surface, border: '1px solid ' + color.border, borderRadius: 10, padding: '24px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 11, color: color.gold, letterSpacing: '0.1em', marginBottom: 14 }}>AI SUMMARY</div>
          <div style={{ fontSize: 14, color: color.textMuted }}>AI summaries coming soon.</div>
        </div>

      </div>

      <AiTutor category={category} videoTitle={video?.title} youtubeId={video?.youtubeId} />
    </div>
  );
}
