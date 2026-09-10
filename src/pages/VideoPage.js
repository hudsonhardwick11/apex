import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { videos, youtubeThumbnail, youtubeUrl } from '../data/videos';
import { color, font, shadow } from '../theme';
import AiTutor from '../components/AiTutor';

// Same context map as AiTutor so summaries are accurate
const VIDEO_CONTEXT = {
  'zBNpqSMiffY': 'This video by Graham Stephan walks through a beginner-friendly investing guide: why starting early matters, how to open a brokerage account, what index funds are, and why consistently investing beats trying to time the market.',
  '_NAgAUpN0pQ': 'Graham Stephan breaks down 5 concrete ways to invest $100 right now — index funds, ETFs, high-yield savings accounts, investing in yourself through skills, and fractional shares.',
  'LQZ7hSpow3Y': 'Andrei Jikh explains how compound interest works over time and lays out a realistic 3-step plan to reach $1M by your 30s: earn more, spend less, and invest the difference consistently in index funds.',
  '3TElSPaNrg0': 'Andrei Jikh explains index funds in plain English — what they are, why they beat most actively managed funds over the long run, and how to pick one.',
  'm6lhOGnRHMo': 'Mark Tilbury walks through how compound interest actually works with real numbers, showing why starting to invest even small amounts in your teens beats waiting until you have enough money.',
  'OqRvmJ2eyBA': 'Jeff Nippard uses sports science research to break down exactly how to structure a bulking phase — calorie surplus size, protein targets, training volume, and how to minimize fat gain while maximizing muscle.',
  '-uleG_Vecis': 'Fireship rapid-fires through 100+ computer science concepts every developer should know — from bits and bytes up through algorithms, data structures, networking, and system design.',
  'lkIFF4maKMU': 'Fireship covers 100+ JavaScript concepts in about 10 minutes — variables, functions, closures, async/await, the event loop, promises, prototypes, and more.',
  'erEgovG9WBs': 'A 100-concept crash course in web development: HTML, CSS, JavaScript, browsers, HTTP, APIs, databases, security, performance, and the tools modern developers use.',
  'DHjqpvDnNGE': 'Fireship explains JavaScript in 100 seconds — why it was created, how it runs in the browser, what makes it unique (single-threaded, event-driven), and its role in modern web dev.',
  'zQnBQ4tB3ZA': 'TypeScript in 100 seconds — what it adds on top of JavaScript (static types, interfaces, generics), why teams use it, and how to get started.',
  'Tn6-PIqc4UM': 'React in 100 seconds — the virtual DOM, JSX, components, props, and state explained as simply as possible.',
  'nxisr1AalNc': 'Jeff Nippard presents the science-based case for full-body training 3-4x per week — higher muscle protein synthesis frequency, better volume distribution, and sample workouts.',
  'eTxO5ZMxcsc': 'Jeff Nippard argues for training each muscle 5x per week and explains the research behind why high frequency can accelerate muscle growth, with a sample split.',
  '_fbkHGMjAls': 'Jeff Nippard addresses the specific challenges teenagers face building muscle — hormones working in your favor, recovery advantages, and a beginner program structure.',
  'GxGAXbr-VEk': 'Jeff Nippard covers evidence-based nutrition for muscle gain: total calories, protein per pound of bodyweight, meal timing, and what actually matters vs. what is marketing noise.',
  'xasFmAaLKVA': 'AthleanX lays out a complete beginner workout routine — which exercises to prioritize, how many sets and reps, rest periods, and how to progress week over week.',
  'BoYfFKDRqKM': 'Chris Heria talks through the mental and habit side of gym consistency — building a routine that sticks, dealing with motivation dips, and making fitness a lifestyle.',
  'i7bLRKwKSms': 'Alex Hormozi walks through exactly how he would start a business from zero today: picking a niche, your first offer, getting your first 10 customers, and reinvesting to scale.',
  '5NPd_p8oyUI': 'A compiled hour of Alex Hormozi best advice on building wealth — how to think about money, leverage, value creation, and why most people stay broke.',
  'Af0UZpc4lRw': 'Alex Hormozi explains the fundamental blueprint for making money: skill acquisition, value creation, and how to sell that value without a large audience or capital.',
  'sdd4BST87ks': 'Alex Hormozi talks about how he built Gym Launch into a $150M business, the mistakes he made, and what principles he would apply if starting over.',
  'FWTyFa42fHk': 'Ali Abdaal breaks down the psychology of procrastination and gives specific actionable techniques — implementation intentions, temptation bundling, and removing friction.',
  'n3kNlFMXslo': 'Ali Abdaal shares his evidence-based productivity framework including time blocking, energy management, and the weekly review system he uses.',
  'g5v_P5EpPJw': 'Ali Abdaal explains his feel-good productivity theory — that enjoying your work is not a luxury but a prerequisite for sustained high performance.',
  'PZ7lDrwYdZc': 'James Clear explains the science of habit formation from Atomic Habits — the habit loop, identity-based habits, and the 1% improvement compounding effect.',
  'AykFBRynO2E': 'Charisma on Command breaks down public speaking fundamentals — controlling nerves, vocal variety, eye contact, and how to structure a compelling talk.',
  'HQzoZfc3GwQ': 'Graham Stephan walks through a complete money management system: budgeting, emergency funds, debt payoff order, and how to start investing on any income.',
};

async function generateSummary(video, category) {
  const context = VIDEO_CONTEXT[video.youtubeId];
  const prompt = context
    ? `You are summarizing a video for the Apex learning platform. Based on this description of the video "${video.title}" by ${video.author} in the ${category} course:\n\n${context}\n\nWrite a 3-bullet summary of the key takeaways. Each bullet should be one clear, actionable sentence. Start each bullet with "•". No intro text, just the 3 bullets.`
    : `Write a 3-bullet summary of what someone watching "${video.title}" by ${video.author} would learn about ${category}. Each bullet should be one clear, actionable sentence. Start each bullet with "•". No intro text, just the 3 bullets.`;

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      category,
      videoTitle: video.title,
    }),
  });
  const data = await res.json();
  return data.reply || '';
}

export default function VideoPage() {
  const { category, index } = useParams();
  const navigate = useNavigate();
  const video = videos[category]?.[index];
  const [watched, setWatched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    async function init() {
      if (!video) return;

      // Check watched status
      if (user) {
        const ref = doc(db, 'users', user.uid, 'watched', category + '-' + index);
        const snap = await getDoc(ref);
        if (snap.exists()) setWatched(true);
      }

      // Load summary — check Firestore cache first
      try {
        const cacheRef = doc(db, 'summaries', `${category}-${index}`);
        const cached = await getDoc(cacheRef);
        if (cached.exists() && cached.data().text) {
          setSummary(cached.data().text);
          setSummaryLoading(false);
          return;
        }

        // Not cached — generate it
        const text = await generateSummary(video, category);
        if (text) {
          setSummary(text);
          // Cache it so we don't regenerate every time
          await setDoc(cacheRef, { text, createdAt: new Date() });
        }
      } catch (e) {
        console.error('Summary error:', e);
        setSummary('');
      }
      setSummaryLoading(false);
    }
    init();
  }, [category, index, user, video]);

  async function markWatched() {
    if (!user) { navigate('/login'); return; }
    setSaving(true);
    const ref = doc(db, 'users', user.uid, 'watched', category + '-' + index);
    await setDoc(ref, { category, index, title: video.title, watchedAt: new Date() });
    setWatched(true);
    setSaving(false);
  }

  if (!video) return (
    <div style={{ color: color.textPrimary, background: color.bg, minHeight: '100vh', padding: 40, fontFamily: font.body }}>
      Video not found. <span onClick={() => navigate('/')} style={{ color: color.gold, cursor: 'pointer' }}>Go home</span>
    </div>
  );

  const bullets = summary.split('\n').filter(l => l.trim().startsWith('•'));

  return (
    <div style={{ background: color.bg, minHeight: '100vh', fontFamily: font.body }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 40px', borderBottom: '1px solid ' + color.border }}>
        <div onClick={() => navigate('/')} style={{ fontFamily: font.display, fontSize: 20, fontWeight: 600, letterSpacing: '0.04em', color: color.textPrimary, cursor: 'pointer', textTransform: 'uppercase' }}>
          A<span style={{ color: color.gold }}>.</span>PEX
        </div>
        <button onClick={() => navigate(-1)} style={{ fontSize: 13, color: color.textSecondary, background: 'transparent', border: '1px solid ' + color.border, padding: '7px 16px', borderRadius: 6, cursor: 'pointer' }}>
          &#8592; Back
        </button>
      </nav>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '44px 40px 80px' }}>

        <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.1em', color: color.gold, marginBottom: 14 }}>{category.toUpperCase()}</div>
        <h1 style={{ fontFamily: font.display, fontSize: 28, fontWeight: 600, color: color.textPrimary, marginBottom: 10, lineHeight: 1.25 }}>{video.title}</h1>
        <div style={{ fontFamily: font.mono, fontSize: 12, color: color.textMuted, marginBottom: 32 }}>{video.author.toUpperCase()} · {video.duration}</div>

        {/* Thumbnail / play */}
        <div onClick={() => window.open(youtubeUrl(video.youtubeId), '_blank')}
          style={{ background: color.surface, border: '1px solid ' + color.border, borderRadius: 10, height: 220, position: 'relative', overflow: 'hidden', marginBottom: 20, cursor: 'pointer' }}>
          <img
            src={youtubeThumbnail(video.youtubeId, 'maxresdefault')}
            alt={video.title}
            onError={e => { e.target.src = youtubeThumbnail(video.youtubeId, 'hqdefault'); }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11,13,16,0.4)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, background: color.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 12px', color: '#0B0D10' }}>&#9654;</div>
              <div style={{ fontFamily: font.mono, fontSize: 12, color: color.textPrimary, letterSpacing: '0.03em' }}>WATCH ON YOUTUBE</div>
            </div>
          </div>
        </div>

        {/* Mark watched */}
        <button
          onClick={markWatched}
          disabled={watched || saving}
          style={{
            width: '100%',
            background: watched ? color.sageMuted : color.gold,
            color: watched ? color.sage : '#0B0D10',
            border: watched ? '1px solid ' + color.sage : 'none',
            padding: '13px', borderRadius: 6,
            fontFamily: font.display, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase',
            fontSize: 13, cursor: watched ? 'default' : 'pointer', marginBottom: 28,
          }}>
          {watched ? '✓ MARKED AS WATCHED' : saving ? 'SAVING...' : 'MARK AS WATCHED'}
        </button>

        {/* AI Summary */}
        <div style={{ background: color.surface, border: '1px solid ' + color.border, borderRadius: 10, padding: '24px', boxShadow: shadow.md }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ fontFamily: font.mono, fontSize: 11, color: color.gold, letterSpacing: '0.1em' }}>AI SUMMARY</div>
            <div style={{ fontFamily: font.mono, fontSize: 9, color: color.textMuted, letterSpacing: '0.06em', background: color.goldMuted, border: '1px solid ' + color.goldDim, padding: '2px 7px', borderRadius: 3 }}>POWERED BY CLAUDE</div>
          </div>

          {summaryLoading ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '8px 0' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: color.gold, opacity: 0.6, animation: `apexPulse 1.2s ${i*0.2}s ease-in-out infinite` }} />
              ))}
              <span style={{ fontFamily: font.mono, fontSize: 11, color: color.textMuted, marginLeft: 6 }}>Generating summary...</span>
            </div>
          ) : bullets.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bullets.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: color.goldMuted, border: '1px solid ' + color.goldDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: color.gold, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <div style={{ fontSize: 14, color: color.textSecondary, lineHeight: 1.6 }}>{b.replace(/^•\s*/, '')}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 14, color: color.textMuted }}>Summary unavailable for this video.</div>
          )}
        </div>

      </div>

      <AiTutor category={category} videoTitle={video?.title} youtubeId={video?.youtubeId} />
      <style>{`@keyframes apexPulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
