import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const videos = {
  Investing: [
    { title: 'How to start investing at any age', author: 'Graham Stephan', duration: '12 min', url: 'https://www.youtube.com/watch?v=gFQNPmLKj1k' },
    { title: 'Index funds explained simply', author: 'Andrei Jikh', duration: '8 min', url: 'https://www.youtube.com/watch?v=3TElSPaNrg0' },
    { title: 'How compound interest works', author: 'Mark Tilbury', duration: '10 min', url: 'https://www.youtube.com/watch?v=m6lhOGnRHMo' },
    { title: 'Stocks vs ETFs — which is better?', author: 'Graham Stephan', duration: '15 min', url: 'https://www.youtube.com/watch?v=AqnGWIBITw4' },
  ],
  'Making money': [
    { title: 'How I made $10k online at 17', author: 'Alex Hormozi', duration: '18 min', url: 'https://www.youtube.com/watch?v=SqBBsHPGPAU' },
    { title: 'Best side hustles for teenagers', author: 'Sunny Lenarduzzi', duration: '11 min', url: 'https://www.youtube.com/watch?v=5GC6XHFGpVo' },
    { title: 'How to freelance with no experience', author: 'Kalle Hallden', duration: '14 min', url: 'https://www.youtube.com/watch?v=r5OeADDWBmQ' },
    { title: 'Selling digital products online', author: 'Ali Abdaal', duration: '20 min', url: 'https://www.youtube.com/watch?v=1OhCMQFTdpE' },
  ],
  'Tech & AI': [
    { title: 'Build your first AI app in one hour', author: 'Fireship', duration: '22 min', url: 'https://www.youtube.com/watch?v=ng9BpGFY0aA' },
    { title: 'How AI is changing everything', author: 'Mark Zuckerberg', duration: '16 min', url: 'https://www.youtube.com/watch?v=bc6uFV9CJGg' },
    { title: 'Learn to code in 2025', author: 'Traversy Media', duration: '25 min', url: 'https://www.youtube.com/watch?v=ysEN5RaKOlA' },
    { title: 'Best AI tools you need to know', author: 'Matt Wolfe', duration: '13 min', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  ],
  'Building apps': [
    { title: 'Build a React app from scratch', author: 'Traversy Media', duration: '45 min', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8' },
    { title: 'How to launch your first app', author: 'Fireship', duration: '19 min', url: 'https://www.youtube.com/watch?v=iWTBMVmlAFQ' },
    { title: 'React Native for beginners', author: 'William Candillon', duration: '30 min', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
    { title: 'How to monetize your app', author: 'Kalle Hallden', duration: '17 min', url: 'https://www.youtube.com/watch?v=oRkNaF0QvnI' },
  ],
  Fitness: [
    { title: 'How to build muscle as a teenager', author: 'Jeff Nippard', duration: '14 min', url: 'https://www.youtube.com/watch?v=_fbkHGMjAls' },
    { title: 'Best beginner workout routine', author: 'AthleanX', duration: '20 min', url: 'https://www.youtube.com/watch?v=xasFmAaLKVA' },
    { title: 'How to eat for muscle gain', author: 'Jeff Nippard', duration: '16 min', url: 'https://www.youtube.com/watch?v=GxGAXbr-VEk' },
    { title: 'How to stay consistent at the gym', author: 'Chris Heria', duration: '11 min', url: 'https://www.youtube.com/watch?v=BoYfFKDRqKM' },
  ],
  'Life skills': [
    { title: 'How to manage your money at any age', author: 'Graham Stephan', duration: '18 min', url: 'https://www.youtube.com/watch?v=HQzoZfc3GwQ' },
    { title: 'How to be more productive', author: 'Ali Abdaal', duration: '15 min', url: 'https://www.youtube.com/watch?v=n3kNlFMXslo' },
    { title: 'Public speaking for beginners', author: 'Charisma on Command', duration: '12 min', url: 'https://www.youtube.com/watch?v=AykFBRynO2E' },
    { title: 'How to build good habits', author: 'James Clear', duration: '22 min', url: 'https://www.youtube.com/watch?v=PZ7lDrwYdZc' },
  ],
};

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

        <div onClick={() => window.open(video.url, '_blank')} style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, cursor: 'pointer' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#7F77DD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 12px' }}>▶</div>
            <div style={{ fontSize: 13, color: '#555' }}>Watch on YouTube</div>
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