import React, { useEffect, useRef, useState, useCallback } from 'react';
import { categoryIcons } from '../icons';
import { color, font, shadow } from '../theme';
import { CanyonFlight, cameraAt } from './Backdrop';

const STOP_VH_FACTOR = 0.72;

export default function FlightPath({ categories, onSelect }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [rawIndex, setRawIndex] = useState(0);
  const N = categories.length;

  const posRef = useRef(0);
  const velRef = useRef(0);
  const lastScrollY = useRef(0);

  const scrollToIndex = useCallback(() => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const stopDistance = window.innerHeight * STOP_VH_FACTOR;
    return Math.max(0, Math.min(N - 0.0001, -rect.top / stopDistance));
  }, [N]);

  useEffect(() => {
    const onScroll = () => {
      const target = scrollToIndex();
      if (target === null) return;
      const dy = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      const stopDistance = window.innerHeight * STOP_VH_FACTOR;
      const impulse = dy / stopDistance;
      // Higher blend weight on new impulse = more responsive feel
      // Multiplier 2.2 means each scroll tick punches harder so
      // you need fewer ticks to get momentum — makes it feel effortless
      velRef.current = velRef.current * 0.6 + impulse * 1.4;
    };

    const tick = () => {
      const target = scrollToIndex();
      if (target !== null) {
        // 0.97 friction = very slow decay — the camera glides for a long
        // time after each scroll gesture instead of stopping abruptly
        velRef.current *= 0.97;
        posRef.current += velRef.current;

        // Extremely soft spring — just enough to prevent runaway drift,
        // not enough to feel like a snap or magnet
        const diff = target - posRef.current;
        posRef.current += diff * 0.006;

        posRef.current = Math.max(0, Math.min(N - 0.0001, posRef.current));
        setRawIndex(posRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    lastScrollY.current = window.scrollY;
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrollToIndex, N]);

  const index = Math.floor(rawIndex);
  const localProgress = rawIndex - index;
  const cam = cameraAt(rawIndex * 1400);
  const hudDrift = -cam.x * 0.045;
  const neighborOffsets = [-1, 0, 1];

  return (
    <div ref={containerRef} style={{ position: 'relative', height: `${N * STOP_VH_FACTOR * 100}vh` }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: color.bgDeep }}>

        <CanyonFlight rawIndex={rawIndex} categories={categories} />

        <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 14, zIndex: 5 }}>
          {categories.map((c, i) => (
            <div key={c.name} style={{
              width: i === index ? 10 : 6, height: i === index ? 10 : 6,
              borderRadius: '50%',
              background: i === index ? color.gold : color.border,
              boxShadow: i === index ? shadow.glow : 'none',
              transition: 'all 0.25s ease',
            }} />
          ))}
        </div>

        <div style={{ position: 'absolute', top: 48, left: 0, right: 0, textAlign: 'center', zIndex: 5 }}>
          <div style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: '0.12em', color: color.textMuted }}>
            {String(index + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
          </div>
        </div>

        <div style={{ position: 'absolute', inset: 0, perspective: '1100px', perspectiveOrigin: '50% 50%', transformStyle: 'preserve-3d', zIndex: 2, pointerEvents: 'none' }}>
          {neighborOffsets.map(offset => {
            const i = index + offset;
            if (i < 0 || i >= N) return null;
            return (
              <CategoryStop key={i} category={categories[i]} distance={rawIndex - i} drift={hudDrift} onSelect={onSelect} />
            );
          })}
        </div>

        {index === 0 && (
          <div style={{
            position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
            textAlign: 'center', zIndex: 5, opacity: Math.max(0, 1 - localProgress * 5),
            fontFamily: font.mono, fontSize: 11, color: color.textMuted, letterSpacing: '0.1em',
          }}>
            SCROLL
            <div style={{ marginTop: 6, fontSize: 16, animation: 'apex-bounce 1.6s ease-in-out infinite' }}>&#8595;</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryStop({ category, distance, drift, onSelect }) {
  const Icon = categoryIcons[category.name];
  const d = Math.max(-1.4, Math.min(1.4, distance));
  const z = d * 620;

  let opacity;
  if (d < -0.9) opacity = 0;
  else if (d < -0.5) opacity = (d + 0.9) / 0.4;
  else if (d <= 0.35) opacity = 1;
  else if (d <= 0.75) opacity = 1 - (d - 0.35) / 0.4;
  else opacity = 0;

  if (opacity <= 0.01) return null;

  const blur = d > 0.35 ? Math.min(2.5, (d - 0.35) * 6) : 0;

  return (
    <div
      onClick={() => onSelect(category.name)}
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%, -50%) translateX(${drift}px) translateZ(${z}px)`,
        textAlign: 'center', cursor: 'pointer',
        opacity,
        filter: blur > 0.3 ? `blur(${blur}px)` : 'none',
        maxWidth: 480, padding: '0 24px',
        willChange: 'transform, opacity, filter',
        pointerEvents: 'auto',
      }}
    >
      <div style={{ width: 72, height: 72, borderRadius: 16, background: color.goldMuted, border: `1px solid ${color.goldDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: shadow.glow }}>
        <Icon width={34} height={34} style={{ color: color.gold }} />
      </div>
      <div style={{ fontFamily: font.display, fontSize: 40, fontWeight: 600, color: color.textPrimary, textTransform: 'uppercase', letterSpacing: '0.01em', marginBottom: 12, textShadow: `0 4px 24px ${color.bgDeep}` }}>
        {category.name}
      </div>
      <div style={{ fontSize: 14, color: color.textSecondary, marginBottom: 8, lineHeight: 1.6, textShadow: `0 2px 12px ${color.bgDeep}` }}>
        {category.description}
      </div>
      <div style={{ fontFamily: font.mono, fontSize: 11, color: color.gold, letterSpacing: '0.05em' }}>
        {category.count} VIDEOS &#8594;
      </div>
    </div>
  );
}
