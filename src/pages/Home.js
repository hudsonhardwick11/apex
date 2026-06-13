import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

const categories = [
  { icon: '📈', name: 'Investing', count: 42 },
  { icon: '💵', name: 'Making money', count: 38 },
  { icon: '🤖', name: 'Tech & AI', count: 31 },
  { icon: '💻', name: 'Building apps', count: 27 },
  { icon: '💪', name: 'Fitness', count: 24 },
  { icon: '🧠', name: 'Life skills', count: 33 },
];

const allVideos = {
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

const featured = [
  { category: 'Investing', displayCategory: 'INVESTING', title: 'How to start investing at any age', author: 'Graham Stephan', index: 0 },
  { category: 'Tech & AI', displayCategory: 'TECH & AI', title: 'Build your first AI app in one hour', author: 'Fireship', index: 0 },
  { category: 'Making money', displayCategory: 'MAKING MONEY', title: 'How I made $10k online at 17', author: 'Alex Hormozi', index: 0 },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return () => unsub();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
  }

  const searchResults = query.trim().length > 0
    ? Object.entries(allVideos).flatMap(([cat, vids]) =>
        vids.map((v, i) => ({ ...v, category: cat, index: i }))
      ).filter(v =>
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.author.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '0.5px solid #222' }}>
        <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.08em', color: '#fff' }}>
          A<span style={{ color: '#7F77DD' }}>.</span>PEX
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span onClick={() => navigate('/browse')} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>Browse</span>
          <span onClick={() => navigate('/my-path')} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>My path</span>
          <span onClick={() => navigate('/community')} style={{ fontSize: 13, color: '#888', cursor: 'pointer' }}>Community</span>
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#555' }}>{user.email}</span>
            <button onClick={handleLogout} style={{ fontSize: 13, color: '#888', background: 'transparent', border: '0.5px solid #333', padding: '6px 16px', borderRadius: 8, cursor: 'pointer' }}>
              Log out
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} style={{ fontSize: 13, color: '#fff', background: '#7F77DD', border: 'none', padding: '6px 16px', borderRadius: 8, cursor: 'pointer' }}>
            Get started
          </button>
        )}
      </nav>

      <div style={{ padding: '56px 40px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 11, color: '#7F77DD', border: '0.5px solid #534AB7', padding: '4px 12px', borderRadius: 20, marginBottom: 20, letterSpacing: '0.06em' }}>
          REAL EDUCATION. ZERO FLUFF.
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 500, color: '#fff', marginBottom: 14, lineHeight: 1.2 }}>
          Learn what school<br /><span style={{ color: '#7F77DD' }}>never taught you</span>
        </h1>
        <p style={{ fontSize: 15, color: '#666', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
          The best videos on investing, building apps, making money, fitness, and life skills — organized so you can actually learn.
        </p>
        <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search videos, topics, or creators..."
            style={{ width: '100%', background: '#111', border: '0.5px solid #333', borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
          {searchResults.length > 0 && (
            <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#111', border: '0.5px solid #222', borderRadius: 10, zIndex: 10, overflow: 'hidden' }}>
              {searchResults.map((v, i) => (
                <div key={i} onClick={() => navigate(`/video/${v.category}/${v.index}`)} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '0.5px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#fff', marginBottom: 2 }}>{v.title}</div>
                    <div style={{ fontSize: 11, color: '#555' }}>{v.author}</div>
                  </div>
                  <div style={{ fontSize: 10, color: '#7F77DD', letterSpacing: '0.05em' }}>{v.category.toUpperCase()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '32px 40px 40px' }}>
        <div style={{ fontSize: 11, color: '#444', letterSpacing: '0.08em', marginBottom: 14 }}>CATEGORIES</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {categories.map(cat => (
            <div key={cat.name} onClick={() => navigate(`/category/${cat.name}`)} style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{cat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{cat.name}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{cat.count} videos</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>Featured this week</div>
          <div onClick={() => navigate('/browse')} style={{ fontSize: 12, color: '#534AB7', cursor: 'pointer' }}>View all →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {featured.map(v => (
            <div key={v.title} onClick={() => navigate(`/video/${v.category}/${v.index}`)} style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ height: 90, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7F77DD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>▶</div>
              </div>
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#7F77DD', marginBottom: 4, letterSpacing: '0.05em' }}>{v.displayCategory}</div>
                <div style={{ fontSize: 12, color: '#ccc', lineHeight: 1.4, marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 11, color: '#555' }}>{v.author}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 40px', borderTop: '0.5px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: '#444' }}>A<span style={{ color: '#534AB7' }}>.</span>PEX</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <span onClick={() => navigate('/about')} style={{ fontSize: 12, color: '#444', cursor: 'pointer' }}>About</span>
          <span onClick={() => navigate('/contact')} style={{ fontSize: 12, color: '#444', cursor: 'pointer' }}>Contact</span>
          <span onClick={() => navigate('/privacy')} style={{ fontSize: 12, color: '#444', cursor: 'pointer' }}>Privacy</span>
        </div>
      </div>

    </div>
  );
}