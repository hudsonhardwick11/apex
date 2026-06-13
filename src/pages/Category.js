import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const videos = {
  Investing: [
    { title: 'How to start investing at any age', author: 'Graham Stephan', duration: '12 min' },
    { title: 'Index funds explained simply', author: 'Andrei Jikh', duration: '8 min' },
    { title: 'How compound interest works', author: 'Mark Tilbury', duration: '10 min' },
    { title: 'Stocks vs ETFs — which is better?', author: 'Graham Stephan', duration: '15 min' },
  ],
  'Making money': [
    { title: 'How I made $10k online at 17', author: 'Alex Hormozi', duration: '18 min' },
    { title: 'Best side hustles for teenagers', author: 'Sunny Lenarduzzi', duration: '11 min' },
    { title: 'How to freelance with no experience', author: 'Kalle Hallden', duration: '14 min' },
    { title: 'Selling digital products online', author: 'Ali Abdaal', duration: '20 min' },
  ],
  'Tech & AI': [
    { title: 'Build your first AI app in one hour', author: 'Fireship', duration: '22 min' },
    { title: 'How AI is changing everything', author: 'Mark Zuckerberg', duration: '16 min' },
    { title: 'Learn to code in 2025', author: 'Traversy Media', duration: '25 min' },
    { title: 'Best AI tools you need to know', author: 'Matt Wolfe', duration: '13 min' },
  ],
  'Building apps': [
    { title: 'Build a React app from scratch', author: 'Traversy Media', duration: '45 min' },
    { title: 'How to launch your first app', author: 'Fireship', duration: '19 min' },
    { title: 'React Native for beginners', author: 'William Candillon', duration: '30 min' },
    { title: 'How to monetize your app', author: 'Kalle Hallden', duration: '17 min' },
  ],
  Fitness: [
    { title: 'How to build muscle as a teenager', author: 'Jeff Nippard', duration: '14 min' },
    { title: 'Best beginner workout routine', author: 'AthleanX', duration: '20 min' },
    { title: 'How to eat for muscle gain', author: 'Jeff Nippard', duration: '16 min' },
    { title: 'How to stay consistent at the gym', author: 'Chris Heria', duration: '11 min' },
  ],
  'Life skills': [
    { title: 'How to manage your money at any age', author: 'Graham Stephan', duration: '18 min' },
    { title: 'How to be more productive', author: 'Ali Abdaal', duration: '15 min' },
    { title: 'Public speaking for beginners', author: 'Charisma on Command', duration: '12 min' },
    { title: 'How to build good habits', author: 'James Clear', duration: '22 min' },
  ],
};

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const categoryVideos = videos[name] || [];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '0.5px solid #222' }}>
        <div onClick={() => navigate('/')} style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.08em', color: '#fff', cursor: 'pointer' }}>
          A<span style={{ color: '#7F77DD' }}>.</span>PEX
        </div>
        <button onClick={() => navigate('/')} style={{ fontSize: 13, color: '#888', background: 'transparent', border: '0.5px solid #333', padding: '6px 16px', borderRadius: 8, cursor: 'pointer' }}>
          ← Back
        </button>
      </nav>

      <div style={{ padding: '40px 40px 24px' }}>
        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 10 }}>CATEGORY</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#fff', marginBottom: 8 }}>{name}</h1>
        <p style={{ fontSize: 14, color: '#555' }}>{categoryVideos.length} videos</p>
      </div>

      <div style={{ padding: '0 40px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {categoryVideos.map((v, i) => (
          <div key={i} onClick={() => navigate(`/video/${name}/${i}`)} style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#7F77DD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>▶</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#fff', marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 12, color: '#555' }}>{v.author}</div>
            </div>
            <div style={{ fontSize: 12, color: '#444' }}>{v.duration}</div>
          </div>
        ))}
      </div>

    </div>
  );
}