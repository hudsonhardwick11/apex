import React, { useState, useRef, useEffect, useCallback } from 'react';
import { color, font, shadow } from '../theme';

// Video-specific knowledge base — what each video actually covers so the
// tutor can give a real opening summary instead of a generic greeting.
const VIDEO_CONTEXT = {
  // Investing
  'zBNpqSMiffY': 'This video by Graham Stephan walks through a beginner-friendly investing guide: why starting early matters, how to open a brokerage account, what index funds are, and why consistently investing beats trying to time the market.',
  '_NAgAUpN0pQ': 'Graham Stephan breaks down 5 concrete ways to invest $100 right now — index funds, ETFs, high-yield savings accounts, investing in yourself through skills, and fractional shares.',
  'LQZ7hSpow3Y': 'Andrei Jikh explains how compound interest works over time and lays out a realistic 3-step plan to reach $1M by your 30s: earn more, spend less, and invest the difference consistently in index funds.',
  '3TElSPaNrg0': 'Andrei Jikh explains index funds in plain English — what they are, why they beat most actively managed funds over the long run, and how to pick one.',
  'm6lhOGnRHMo': 'Mark Tilbury walks through how compound interest actually works with real numbers, showing why starting to invest even small amounts in your teens beats waiting until you have "enough" money.',
  'OqRvmJ2eyBA': 'Jeff Nippard uses sports science research to break down exactly how to structure a bulking phase — calorie surplus size, protein targets, training volume, and how to minimize fat gain while maximizing muscle.',
  // Tech & AI
  '-uleG_Vecis': 'Fireship rapid-fires through 100+ computer science concepts every developer should know — from bits and bytes up through algorithms, data structures, networking, and system design.',
  'lkIFF4maKMU': 'Fireship covers 100+ JavaScript concepts in about 10 minutes — variables, functions, closures, async/await, the event loop, promises, prototypes, and more.',
  'erEgovG9WBs': 'A 100-concept crash course in web development: HTML, CSS, JavaScript, browsers, HTTP, APIs, databases, security, performance, and the tools modern developers use.',
  'DHjqpvDnNGE': 'Fireship explains JavaScript in 100 seconds — why it was created, how it runs in the browser, what makes it unique (single-threaded, event-driven), and its role in modern web dev.',
  'zQnBQ4tB3ZA': 'TypeScript in 100 seconds — what it adds on top of JavaScript (static types, interfaces, generics), why teams use it, and how to get started.',
  'Tn6-PIqc4UM': 'React in 100 seconds — the virtual DOM, JSX, components, props, and state explained as simply as possible.',
  // Fitness
  'nxisr1AalNc': 'Jeff Nippard presents the science-based case for full-body training 3-4x per week — higher muscle protein synthesis frequency, better volume distribution, and sample workouts.',
  'eTxO5ZMxcsc': 'Jeff Nippard argues for training each muscle 5x per week and explains the research behind why high frequency can accelerate muscle growth, with a sample split.',
  '_fbkHGMjAls': 'Jeff Nippard addresses the specific challenges teenagers face building muscle — hormones working in your favor, recovery advantages, and a beginner program structure.',
  'GxGAXbr-VEk': 'Jeff Nippard covers evidence-based nutrition for muscle gain: total calories, protein per pound of bodyweight, meal timing, and what actually matters vs. what\'s marketing noise.',
  'xasFmAaLKVA': 'AthleanX lays out a complete beginner workout routine — which exercises to prioritize, how many sets and reps, rest periods, and how to progress week over week.',
  'BoYfFKDRqKM': 'Chris Heria talks through the mental and habit side of gym consistency — building a routine that sticks, dealing with motivation dips, and making fitness a lifestyle.',
  // Making money
  'i7bLRKwKSms': 'Alex Hormozi walks through exactly how he would start a business from zero today: picking a niche, your first offer, getting your first 10 customers, and reinvesting to scale.',
  '5NPd_p8oyUI': 'A compiled hour of Alex Hormozi\'s best advice on building wealth — how to think about money, leverage, value creation, and why most people stay broke.',
  'Af0UZpc4lRw': 'Alex Hormozi explains the fundamental blueprint for making money: skill acquisition, value creation, and how to sell that value without a large audience or capital.',
  'sdd4BST87ks': 'Alex Hormozi talks about how he built Gym Launch into a $150M business, the mistakes he made, and what principles he\'d apply if starting over.',
  // Life skills
  'FWTyFa42fHk': 'Ali Abdaal breaks down the psychology of procrastination and gives specific actionable techniques — implementation intentions, temptation bundling, and removing friction.',
  'n3kNlFMXslo': 'Ali Abdaal shares his evidence-based productivity framework including time blocking, energy management, and the weekly review system he uses.',
  'g5v_P5EpPJw': 'Ali Abdaal explains his feel-good productivity theory — that enjoying your work is not a luxury but a prerequisite for sustained high performance.',
  'PZ7lDrwYdZc': 'James Clear explains the science of habit formation from Atomic Habits — the habit loop, identity-based habits, and the 1% improvement compounding effect.',
  'AykFBRynO2E': 'Charisma on Command breaks down public speaking fundamentals — controlling nerves, vocal variety, eye contact, and how to structure a compelling talk.',
  'HQzoZfc3GwQ': 'Graham Stephan walks through a complete money management system: budgeting, emergency funds, debt payoff order, and how to start investing on any income.',
};

function getVideoSummary(videoTitle, category, youtubeId) {
  if (youtubeId && VIDEO_CONTEXT[youtubeId]) return VIDEO_CONTEXT[youtubeId];
  return `This video covers key concepts in ${category} that will help you build real-world knowledge and skills.`;
}

export default function AiTutor({ category, videoTitle, youtubeId }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const hasOpened = useRef(false);

  const openWithSummary = useCallback(async () => {
    if (hasOpened.current) return;
    hasOpened.current = true;
    setLoading(true);

    const videoContext = getVideoSummary(videoTitle, category, youtubeId);

    // Build an opening message that summarises the video and asks a check
    // question — this is what makes it feel like a tutor, not a chatbot.
    const systemPrompt = `You are an expert tutor on the Apex learning platform for the topic "${category}".
${videoTitle ? `The student just watched: "${videoTitle}".` : ''}
${videoContext ? `What the video covered: ${videoContext}` : ''}

For your FIRST response only: write a 2-sentence plain-English summary of what the video covered, then ask ONE specific check-for-understanding question based on the content. Keep it under 80 words total. Be direct and friendly — no fluff.

After that first message, answer any questions the student has about ${category}. Keep answers under 150 words unless a longer explanation is genuinely needed.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hi, I just finished watching the video.' }],
          category,
          videoTitle,
          systemOverride: systemPrompt,
        }),
      });
      const data = await res.json();
      setMessages([{ role: 'assistant', content: data.reply || `Hey! I'm your ${category} tutor. Ask me anything.` }]);
    } catch {
      setMessages([{ role: 'assistant', content: `Hey! I'm your ${category} tutor. What questions do you have?` }]);
    } finally {
      setLoading(false);
    }
  }, [category, videoTitle, youtubeId]);

  useEffect(() => {
    if (open && !hasOpened.current) {
      openWithSummary();
    }
  }, [open, openWithSummary]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })), category, videoTitle }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, something went wrong.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error — try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const pulseStyle = (i) => ({
    width: 6, height: 6, borderRadius: '50%', background: color.gold,
    animation: `apexPulse 1.2s ${i * 0.2}s ease-in-out infinite`,
  });

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, width: 340, zIndex: 100,
          background: color.surface, border: `1px solid ${color.border}`,
          borderRadius: 14, boxShadow: shadow.lg,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', maxHeight: 500,
        }}>
          <div style={{ padding: '13px 16px', background: color.bgDeep, borderBottom: `1px solid ${color.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: font.display, fontSize: 13, fontWeight: 600, color: color.textPrimary, letterSpacing: '0.02em' }}>
                A<span style={{ color: color.gold }}>.</span>PEX TUTOR
              </div>
              <div style={{ fontFamily: font.mono, fontSize: 9, color: color.textMuted, letterSpacing: '0.08em', marginTop: 2 }}>
                {category.toUpperCase()}{videoTitle ? ` · ${videoTitle.slice(0, 28)}…` : ''}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: color.textMuted, fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '83%', padding: '9px 12px',
                  borderRadius: m.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  background: m.role === 'user' ? color.gold : color.surfaceRaised,
                  color: m.role === 'user' ? color.bgDeep : color.textPrimary,
                  fontSize: 13, lineHeight: 1.55, fontFamily: font.body,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', borderRadius: '12px 12px 12px 3px', background: color.surfaceRaised, display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => <div key={i} style={pulseStyle(i)} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '10px 12px', borderTop: `1px solid ${color.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask anything..."
              disabled={loading && messages.length === 0}
              style={{ flex: 1, background: color.surfaceRaised, border: `1px solid ${color.border}`, borderRadius: 8, padding: '8px 12px', color: color.textPrimary, fontSize: 13, outline: 'none', fontFamily: font.body }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{ width: 34, height: 34, borderRadius: 8, background: input.trim() && !loading ? color.gold : color.border, border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <span style={{ color: color.bgDeep, fontSize: 14 }}>↑</span>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 101,
          width: 54, height: 54, borderRadius: '50%',
          background: open ? color.surfaceRaised : color.gold,
          border: `1px solid ${open ? color.border : color.gold}`,
          boxShadow: shadow.glow, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: open ? 20 : 22,
          transition: 'all 0.15s ease',
          transform: open ? 'scale(0.92)' : 'scale(1)',
        }}
      >
        {open ? <span style={{ color: color.textSecondary }}>×</span> : <span style={{ color: color.bgDeep }}>✦</span>}
      </button>

      <style>{`
        @keyframes apexPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
