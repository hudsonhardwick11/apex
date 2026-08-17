import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { videos as allVideos, categories, youtubeThumbnail } from '../data/videos';
import { categoryIcons } from '../icons';

const featured = [
  { category: 'Investing', index: 0 },
  { category: 'Tech & AI', index: 0 },
  { category: 'Making money', index: 0 },
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
          {categories.map(cat => {
            const Icon = categoryIcons[cat.name];
            return (
              <div key={cat.name} onClick={() => navigate(`/category/${cat.name}`)} style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: 16, cursor: 'pointer' }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(127,119,221,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon width={18} height={18} style={{ color: '#7F77DD' }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', marginBottom: 4 }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: '#555' }}>{cat.count} videos</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 40px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>Featured this week</div>
          <div onClick={() => navigate('/browse')} style={{ fontSize: 12, color: '#534AB7', cursor: 'pointer' }}>View all →</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {featured.map(f => {
            const v = allVideos[f.category][f.index];
            return (
              <div key={f.category} onClick={() => navigate(`/video/${f.category}/${f.index}`)} style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}>
                <div style={{ height: 110, position: 'relative', background: '#1a1a1a' }}>
                  <img
                    src={youtubeThumbnail(v.youtubeId)}
                    alt={v.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7F77DD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>▶</div>
                  </div>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: '#7F77DD', marginBottom: 4, letterSpacing: '0.05em' }}>{f.category.toUpperCase()}</div>
                  <div style={{ fontSize: 12, color: '#ccc', lineHeight: 1.4, marginBottom: 6 }}>{v.title}</div>
                  <div style={{ fontSize: 11, color: '#555' }}>{v.author}</div>
                </div>
              </div>
            );
          })}
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
