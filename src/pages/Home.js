import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { videos as allVideos, categories } from '../data/videos';
import { color, font, shadow } from '../theme';
import { TopoBackdrop, HeroPeaks } from '../components/Backdrop';
import FlightPath from '../components/FlightPath';

const TOTAL_VIDEOS = Object.values(allVideos).reduce((sum, v) => sum + v.length, 0);

// ---------------------------------------------------------------------------
// Custom SVG thumbnails — fully Apex-branded, no YouTube dependency.
// Each one has its own visual motif tied to the topic.
// ---------------------------------------------------------------------------

function ThumbInvesting({ hovered }) {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="inv-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D1117" />
          <stop offset="100%" stopColor="#0B0D10" />
        </linearGradient>
        <linearGradient id="inv-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7F77DD" />
          <stop offset="100%" stopColor="#4A4390" />
        </linearGradient>
        <linearGradient id="inv-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7F77DD" stopOpacity="0" />
          <stop offset="40%" stopColor="#7F77DD" />
          <stop offset="100%" stopColor="#CFC9FF" />
        </linearGradient>
        <filter id="inv-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="400" height="220" fill="url(#inv-bg)" />

      {/* grid lines */}
      {[60, 100, 140, 180].map(y => (
        <line key={y} x1="60" y1={y} x2="380" y2={y} stroke="#262B31" strokeWidth="1" />
      ))}

      {/* bars */}
      {[
        { x: 70,  h: 60,  w: 28 },
        { x: 110, h: 100, w: 28 },
        { x: 150, h: 75,  w: 28 },
        { x: 190, h: 130, w: 28 },
        { x: 230, h: 90,  w: 28 },
        { x: 270, h: 150, w: 28 },
        { x: 310, h: 110, w: 28 },
        { x: 350, h: 170, w: 28 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={190 - b.h} width={b.w} height={b.h} rx="3"
          fill="url(#inv-bar)" opacity={hovered ? 0.95 : 0.75}
          style={{ transition: 'opacity 0.2s' }}
        />
      ))}

      {/* trend line */}
      <polyline
        points="84,165 124,130 164,148 204,112 244,125 284,88 324,100 364,62"
        fill="none" stroke="url(#inv-line)" strokeWidth="2.5"
        filter="url(#inv-glow)" strokeLinejoin="round" strokeLinecap="round"
      />
      {/* dot at end */}
      <circle cx="364" cy="62" r="5" fill="#CFC9FF" filter="url(#inv-glow)" />

      {/* label */}
      <text x="24" y="32" fill="#7F77DD" fontSize="9" fontFamily="monospace" letterSpacing="3" opacity="0.8">INVESTING</text>
      <text x="24" y="52" fill="#EDEAE3" fontSize="15" fontFamily="sans-serif" fontWeight="700">Build lasting wealth.</text>
    </svg>
  );
}

function ThumbTech({ hovered }) {
  const lines = [
    { y: 60,  indent: 0,   w: 140, c: '#7F77DD' },
    { y: 78,  indent: 20,  w: 100, c: '#5C6167' },
    { y: 96,  indent: 20,  w: 160, c: '#5C6167' },
    { y: 114, indent: 40,  w: 80,  c: '#7A9B7E' },
    { y: 132, indent: 40,  w: 120, c: '#5C6167' },
    { y: 150, indent: 20,  w: 90,  c: '#7F77DD' },
    { y: 168, indent: 0,   w: 60,  c: '#5C6167' },
    { y: 186, indent: 0,   w: 200, c: '#7F77DD' },
  ];
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="tech-glow" cx="70%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#7F77DD" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0B0D10" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#0B0D10" />
      <rect width="400" height="220" fill="url(#tech-glow)" />

      {/* code lines */}
      {lines.map((l, i) => (
        <rect key={i} x={24 + l.indent} y={l.y} width={hovered ? l.w * 1.08 : l.w} height="10" rx="3"
          fill={l.c} opacity="0.7"
          style={{ transition: 'width 0.3s ease' }}
        />
      ))}

      {/* blinking cursor */}
      <rect x="228" y="186" width="8" height="10" rx="1" fill="#7F77DD" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0;0.9" dur="1.1s" repeatCount="indefinite" />
      </rect>

      {/* bracket decoration */}
      <text x="280" y="140" fill="#262B31" fontSize="90" fontFamily="monospace" fontWeight="900" opacity="0.35">{'}'}</text>

      <text x="24" y="32" fill="#7F77DD" fontSize="9" fontFamily="monospace" letterSpacing="3" opacity="0.8">TECH &amp; AI</text>
      <text x="24" y="52" fill="#EDEAE3" fontSize="15" fontFamily="sans-serif" fontWeight="700">Build the future.</text>
    </svg>
  );
}

function ThumbMoney({ hovered }) {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="money-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#4A4390" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0B0D10" stopOpacity="0" />
        </radialGradient>
        <filter id="money-blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <rect width="400" height="220" fill="#0B0D10" />
      <rect width="400" height="220" fill="url(#money-glow)" />

      {/* concentric rings — signal/growth metaphor */}
      {[130, 100, 70, 44, 22].map((r, i) => (
        <circle key={i} cx="300" cy="120" r={r}
          fill="none" stroke="#7F77DD"
          strokeWidth={i === 4 ? 2 : 1}
          opacity={hovered ? 0.18 + i * 0.06 : 0.10 + i * 0.04}
          style={{ transition: 'opacity 0.25s' }}
        />
      ))}
      <circle cx="300" cy="120" r="10" fill="#7F77DD" opacity="0.9" />
      <circle cx="300" cy="120" r="10" fill="#7F77DD" filter="url(#money-blur)" opacity="0.6" />

      {/* dollar sign */}
      <text x="285" y="126" fill="#EDEAE3" fontSize="16" fontFamily="sans-serif" fontWeight="900">$</text>

      {/* stat pills */}
      {[
        { x: 24, y: 80,  label: 'REVENUE', val: '+340%' },
        { x: 24, y: 116, label: 'MARGIN',  val: '68%'   },
        { x: 24, y: 152, label: 'GROWTH',  val: '↑ 12×' },
      ].map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y - 14} width="130" height="22" rx="4" fill="#15181C" stroke="#262B31" strokeWidth="1" />
          <text x={s.x + 8} y={s.y + 1} fill="#5C6167" fontSize="8" fontFamily="monospace" letterSpacing="2">{s.label}</text>
          <text x={s.x + 85} y={s.y + 1} fill="#7F77DD" fontSize="10" fontFamily="monospace" fontWeight="700">{s.val}</text>
        </g>
      ))}

      <text x="24" y="32" fill="#7F77DD" fontSize="9" fontFamily="monospace" letterSpacing="3" opacity="0.8">MAKING MONEY</text>
      <text x="24" y="52" fill="#EDEAE3" fontSize="15" fontFamily="sans-serif" fontWeight="700">Earn on your terms.</text>
    </svg>
  );
}

function ThumbFitness({ hovered }) {
  // Stylised bar chart — lift numbers going up
  const bars = [55, 70, 65, 85, 78, 100, 92, 115];
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="fit-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A9B7E" />
          <stop offset="100%" stopColor="#3A4148" />
        </linearGradient>
        <radialGradient id="fit-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7A9B7E" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#0B0D10" />
      <rect width="400" height="220" fill="url(#fit-glow)" />

      {/* heartbeat line */}
      <polyline
        points="24,110 70,110 90,70 105,140 120,110 340,110 360,80 375,110 400,110"
        fill="none" stroke="#7A9B7E" strokeWidth="2"
        opacity={hovered ? 0.9 : 0.55}
        strokeLinejoin="round" strokeLinecap="round"
        style={{ transition: 'opacity 0.2s' }}
      />

      {/* weight plates decoration */}
      <rect x="290" y="140" width="80" height="12" rx="4" fill="#1B1F24" stroke="#3A4148" strokeWidth="1" />
      <rect x="282" y="134" width="10" height="24" rx="3" fill="#262B31" stroke="#3A4148" strokeWidth="1" />
      <rect x="368" y="134" width="10" height="24" rx="3" fill="#262B31" stroke="#3A4148" strokeWidth="1" />
      <rect x="272" y="138" width="12" height="16" rx="2" fill="#1B1F24" stroke="#3A4148" strokeWidth="1" />
      <rect x="376" y="138" width="12" height="16" rx="2" fill="#1B1F24" stroke="#3A4148" strokeWidth="1" />

      {/* lift numbers */}
      {bars.map((h, i) => (
        <rect key={i} x={28 + i * 26} y={195 - h * (hovered ? 1.1 : 1)} width="18" height={h * (hovered ? 1.1 : 1)}
          rx="2" fill="url(#fit-bar)" opacity="0.7"
          style={{ transition: 'all 0.25s ease' }}
        />
      ))}

      <text x="24" y="32" fill="#7A9B7E" fontSize="9" fontFamily="monospace" letterSpacing="3" opacity="0.8">FITNESS</text>
      <text x="24" y="52" fill="#EDEAE3" fontSize="15" fontFamily="sans-serif" fontWeight="700">Train smarter.</text>
    </svg>
  );
}

function ThumbLifeSkills({ hovered }) {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="ls-glow" cx="75%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#7F77DD" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0B0D10" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#0B0D10" />
      <rect width="400" height="220" fill="url(#ls-glow)" />

      {/* checklist items */}
      {[
        { y: 72,  label: 'Build good habits',    done: true  },
        { y: 104, label: 'Master your time',     done: true  },
        { y: 136, label: 'Manage your money',    done: false },
        { y: 168, label: 'Communicate clearly',  done: false },
      ].map((item, i) => (
        <g key={i} opacity={hovered ? 1 : 0.85} style={{ transition: 'opacity 0.2s' }}>
          {/* checkbox */}
          <rect x="24" y={item.y - 13} width="18" height="18" rx="4"
            fill={item.done ? '#7F77DD' : '#15181C'}
            stroke={item.done ? '#7F77DD' : '#3A4148'} strokeWidth="1.5" />
          {item.done && (
            <polyline points={`29,${item.y - 4} 33,${item.y} 40,${item.y - 8}`}
              fill="none" stroke="#EDEAE3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {/* label */}
          <text x="52" y={item.y + 1} fill={item.done ? '#EDEAE3' : '#5C6167'}
            fontSize="12" fontFamily="sans-serif" fontWeight={item.done ? '600' : '400'}>
            {item.label}
          </text>
          {/* strike-through for done items */}
          {item.done && (
            <line x1="52" y1={item.y - 3} x2={52 + item.label.length * 6.8} y2={item.y - 3}
              stroke="#5C6167" strokeWidth="1" opacity="0.5" />
          )}
        </g>
      ))}

      {/* clock decoration */}
      <circle cx="340" cy="120" r="52" fill="none" stroke="#1B1F24" strokeWidth="8" />
      <circle cx="340" cy="120" r="52" fill="none" stroke="#7F77DD" strokeWidth="8"
        strokeDasharray="327" strokeDashoffset="82" opacity="0.6" />
      <line x1="340" y1="120" x2="340" y2="84" stroke="#EDEAE3" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="340" y1="120" x2="364" y2="130" stroke="#7F77DD" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="340" cy="120" r="4" fill="#EDEAE3" />

      <text x="24" y="32" fill="#7F77DD" fontSize="9" fontFamily="monospace" letterSpacing="3" opacity="0.8">LIFE SKILLS</text>
      <text x="24" y="52" fill="#EDEAE3" fontSize="15" fontFamily="sans-serif" fontWeight="700">Level up daily.</text>
    </svg>
  );
}

function ThumbApps({ hovered }) {
  return (
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="apps-glow" cx="60%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#7F77DD" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0B0D10" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#0B0D10" />
      <rect width="400" height="220" fill="url(#apps-glow)" />

      {/* phone frame */}
      <rect x="260" y="30" width="110" height="170" rx="14" fill="#15181C" stroke="#262B31" strokeWidth="2" />
      <rect x="270" y="50" width="90" height="130" rx="6" fill="#0B0D10" />
      {/* phone notch */}
      <rect x="295" y="35" width="40" height="8" rx="4" fill="#262B31" />
      {/* phone home bar */}
      <rect x="295" y="188" width="40" height="4" rx="2" fill="#262B31" />
      {/* app icons on screen */}
      {[
        { x: 279, y: 60, c: '#7F77DD' }, { x: 311, y: 60, c: '#7A9B7E' }, { x: 343, y: 60, c: '#4A4390' },
        { x: 279, y: 92, c: '#3A4148' }, { x: 311, y: 92, c: '#7F77DD' }, { x: 343, y: 92, c: '#7A9B7E' },
      ].map((ic, i) => (
        <rect key={i} x={ic.x} y={ic.y} width="22" height="22" rx="6" fill={ic.c} opacity={hovered ? 0.9 : 0.65}
          style={{ transition: 'opacity 0.2s' }} />
      ))}
      {/* chart on screen */}
      <polyline points="279,148 295,130 311,140 327,118 343,128 359,105"
        fill="none" stroke="#7F77DD" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="359" cy="105" r="3" fill="#7F77DD" />

      {/* left panel: component blocks */}
      {[
        { y: 68,  w: 180, c: '#7F77DD', op: 0.7 },
        { y: 92,  w: 140, c: '#262B31', op: 1   },
        { y: 116, w: 160, c: '#262B31', op: 1   },
        { y: 140, w: 120, c: '#7A9B7E', op: 0.6 },
        { y: 164, w: 180, c: '#262B31', op: 1   },
      ].map((b, i) => (
        <rect key={i} x="24" y={b.y} width={b.w} height="16" rx="4" fill={b.c} opacity={b.op} />
      ))}

      <text x="24" y="32" fill="#7F77DD" fontSize="9" fontFamily="monospace" letterSpacing="3" opacity="0.8">BUILDING APPS</text>
      <text x="24" y="52" fill="#EDEAE3" fontSize="15" fontFamily="sans-serif" fontWeight="700">Ship your ideas.</text>
    </svg>
  );
}

const FEATURED_CARDS = [
  { category: 'Investing',      Thumb: ThumbInvesting,  videoIdx: 0 },
  { category: 'Tech & AI',      Thumb: ThumbTech,       videoIdx: 0 },
  { category: 'Making money',   Thumb: ThumbMoney,      videoIdx: 0 },
  { category: 'Fitness',        Thumb: ThumbFitness,    videoIdx: 0 },
  { category: 'Life skills',    Thumb: ThumbLifeSkills,  videoIdx: 0 },
  { category: 'Building apps',  Thumb: ThumbApps,       videoIdx: 0 },
];

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const [watchedCount, setWatchedCount] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u);
      if (u) {
        const snap = await getDocs(collection(db, 'users', u.uid, 'watched'));
        setWatchedCount(snap.docs.length);
      } else {
        setWatchedCount(null);
      }
    });
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
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body, position: 'relative' }}>
      <TopoBackdrop />

      <div style={{ position: 'relative', zIndex: 1 }}>

        <nav style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '18px 40px', background: color.bgDeep, borderBottom: `1px solid ${color.border}`, boxShadow: shadow.sm, position: 'sticky', top: 0, zIndex: 20 }}>
          <div style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, textTransform: 'uppercase', justifySelf: 'start' }}>
            A<span style={{ color: color.gold }}>.</span>PEX
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center', justifySelf: 'center' }}>
            <span onClick={() => navigate('/browse')} style={{ fontSize: 13, color: color.textSecondary, cursor: 'pointer' }}>Browse</span>
            <button onClick={() => navigate('/full-path')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: font.display, fontSize: 13, fontWeight: 500, color: color.gold, background: color.goldMuted, border: `1px solid ${color.goldDim}`, padding: '9px 18px', borderRadius: 6, cursor: 'pointer', letterSpacing: '0.02em', textTransform: 'uppercase', boxShadow: shadow.sm }}>
              The Full Path
            </button>
            <span onClick={() => navigate('/community')} style={{ fontSize: 13, color: color.textSecondary, cursor: 'pointer' }}>Community</span>
            <button onClick={() => navigate('/my-path')} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: font.mono, fontSize: 12, color: color.gold, background: color.goldMuted, border: `1px solid ${color.goldDim}`, padding: '7px 14px', borderRadius: 6, cursor: 'pointer' }}>
              <span style={{ fontSize: 13 }}>&#9650;</span>
              My progress
              {watchedCount !== null && <span style={{ color: color.textMuted }}>· {watchedCount}/{TOTAL_VIDEOS}</span>}
            </button>
          </div>
          <div style={{ justifySelf: 'end' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: font.mono, fontSize: 12, color: color.textMuted }}>{user.email}</span>
                <button onClick={handleLogout} style={{ fontSize: 13, color: color.textSecondary, background: 'transparent', border: `1px solid ${color.border}`, padding: '6px 16px', borderRadius: 6, cursor: 'pointer' }}>Log out</button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} style={{ fontFamily: font.display, fontSize: 13, fontWeight: 500, letterSpacing: '0.03em', color: '#0B0D10', background: color.gold, border: 'none', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', textTransform: 'uppercase', boxShadow: shadow.sm }}>Get started</button>
            )}
          </div>
        </nav>

        <div style={{ position: 'relative', padding: '72px 40px 120px', textAlign: 'center', overflow: 'hidden' }}>
          <HeroPeaks height={260} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ ...ey(), color: color.gold, display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${color.goldDim}`, padding: '5px 14px', borderRadius: 3, marginBottom: 24, background: color.bgDeep, boxShadow: shadow.sm }}>
              <span style={{ color: color.gold }}>&#9650;</span> REAL EDUCATION · ZERO FLUFF
            </div>
            <h1 style={{ fontFamily: font.display, fontSize: 52, fontWeight: 600, color: color.textPrimary, marginBottom: 16, lineHeight: 1.08, letterSpacing: '0.01em' }}>
              LEARN WHAT SCHOOL<br /><span style={{ color: color.gold }}>NEVER TAUGHT YOU</span>
            </h1>
            <p style={{ fontSize: 15, color: color.textSecondary, maxWidth: 460, margin: '0 auto 30px', lineHeight: 1.6 }}>
              The best videos on investing, building apps, making money, fitness, and life skills — organized so you can actually learn.
            </p>
            <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
              <input
                type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search videos, topics, or creators..."
                style={{ width: '100%', background: color.surface, border: `1px solid ${color.border}`, borderRadius: 6, padding: '13px 16px', color: color.textPrimary, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: font.body, boxShadow: shadow.md }}
              />
              {searchResults.length > 0 && (
                <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: color.surfaceRaised, border: `1px solid ${color.border}`, borderRadius: 8, zIndex: 10, overflow: 'hidden', textAlign: 'left', boxShadow: shadow.lg }}>
                  {searchResults.map((v, i) => (
                    <div key={i} onClick={() => navigate(`/video/${v.category}/${v.index}`)} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: `1px solid ${color.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, color: color.textPrimary, marginBottom: 2 }}>{v.title}</div>
                        <div style={{ fontSize: 11, color: color.textMuted }}>{v.author}</div>
                      </div>
                      <div style={{ fontFamily: font.mono, fontSize: 10, color: color.gold, letterSpacing: '0.05em' }}>{v.category.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <FlightPath categories={categories} onSelect={(name) => navigate(`/course/${name}`)} />

        {/* ---- Explore Topics ---- */}
        <div style={{ padding: '60px 40px 80px', position: 'relative', zIndex: 1, background: color.bg }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <div>
              <div style={{ ...ey(), marginBottom: 6 }}>START HERE</div>
              <div style={{ fontFamily: font.display, fontSize: 22, fontWeight: 600, color: color.textPrimary, letterSpacing: '0.02em' }}>EXPLORE TOPICS</div>
            </div>
            <div onClick={() => navigate('/browse')} style={{ fontFamily: font.mono, fontSize: 12, color: color.gold, cursor: 'pointer' }}>VIEW ALL &#8594;</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {FEATURED_CARDS.map((fc, i) => {
              const v = allVideos[fc.category][fc.videoIdx];
              const isHovered = hoveredCard === i;
              return (
                <div
                  key={fc.category}
                  onClick={() => navigate(`/course/${fc.category}`)}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: color.surface,
                    border: `1px solid ${isHovered ? color.goldDim : color.border}`,
                    borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                    boxShadow: isHovered ? shadow.glow : shadow.md,
                    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  {/* custom SVG thumbnail */}
                  <div style={{ height: 140, overflow: 'hidden', background: color.bgDeep }}>
                    <fc.Thumb hovered={isHovered} />
                  </div>
                  {/* card footer */}
                  <div style={{ padding: '12px 14px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: font.display, fontSize: 13, fontWeight: 600, color: color.textPrimary, letterSpacing: '0.02em', marginBottom: 2 }}>{fc.category.toUpperCase()}</div>
                      <div style={{ fontFamily: font.mono, fontSize: 10, color: color.textMuted }}>{allVideos[fc.category].length} VIDEOS</div>
                    </div>
                    <div style={{ fontFamily: font.mono, fontSize: 11, color: color.gold }}>START &#8594;</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '18px 40px', borderTop: `1px solid ${color.border}`, background: color.bgDeep, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: font.display, fontSize: 13, color: color.textMuted, letterSpacing: '0.04em' }}>A<span style={{ color: color.goldDim }}>.</span>PEX</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span onClick={() => navigate('/about')} style={{ fontSize: 12, color: color.textMuted, cursor: 'pointer' }}>About</span>
            <span onClick={() => navigate('/contact')} style={{ fontSize: 12, color: color.textMuted, cursor: 'pointer' }}>Contact</span>
            <span onClick={() => navigate('/privacy')} style={{ fontSize: 12, color: color.textMuted, cursor: 'pointer' }}>Privacy</span>
          </div>
        </div>

      </div>
    </div>
  );
}

function ey() {
  return { fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.textMuted };
}
