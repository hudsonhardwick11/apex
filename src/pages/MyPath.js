import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 40px' }}>
        <div style={{ fontSize: 11, color: '#7F77DD', letterSpacing: '0.08em', marginBottom: 12 }}>MY PATH</div>
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#fff', marginBottom: 8 }}>Your progress</h1>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 32 }}>{watched.length} videos watched</p>

        {!user && !loading && (
          <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>Sign in to track your progress</p>
            <button onClick={() => navigate('/login')} style={{ background: '#7F77DD', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
              Log in
            </button>
          </div>
        )}

        {user && loading && <div style={{ fontSize: 14, color: '#444' }}>Loading...</div>}

        {user && !loading && watched.length === 0 && (
          <div style={{ background: '#111', border: '0.5px solid #222', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>You haven't watched any videos yet</p>
            <button onClick={() => navigate('/browse')} style={{ background: '#7F77DD', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
              Start browsing
            </button>
          </div>
        )}

        {user && !loading && watched.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {watched.map((v, i) => (
              <div key={i} onClick={() => navigate(`/video/${v.category}/${v.index}`)} style={{ background: '#111', border: '0.5px solid #1a1a1a', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a3a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✓</div>
                <div>
                  <div style={{ fontSize: 14, color: '#fff', marginBottom: 4 }}>{v.title}</div>
                  <div style={{ fontSize: 11, color: '#555' }}>{v.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}