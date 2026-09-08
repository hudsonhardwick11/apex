import React from 'react';
import { color, font } from '../theme';
import { categoryIcons } from '../icons';

export function TopoBackdrop() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="apex-topo" width="420" height="280" patternUnits="userSpaceOnUse">
          <path d="M-20 40 Q 90 8, 200 40 T 440 40" fill="none" stroke={color.border} strokeWidth="1" opacity="0.55" />
          <path d="M-20 104 Q 100 64, 210 104 T 440 104" fill="none" stroke={color.border} strokeWidth="1" opacity="0.4" />
          <path d="M-20 168 Q 110 208, 220 168 T 440 168" fill="none" stroke={color.gold} strokeWidth="1" opacity="0.10" />
          <path d="M-20 228 Q 90 188, 200 228 T 440 228" fill="none" stroke={color.border} strokeWidth="1" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#apex-topo)" />
    </svg>
  );
}

export function HeroPeaks({ height = 240 }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height, zIndex: 0, pointerEvents: 'none' }}
    >
      <defs>
        <radialGradient id="apex-peak-glow" cx="50%" cy="10%" r="65%">
          <stop offset="0%" stopColor={color.glow} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="320" fill="url(#apex-peak-glow)" opacity="0.5" />
      <polygon points="0,320 0,210 180,120 340,190 520,90 700,180 860,60 1040,170 1220,100 1440,200 1440,320" fill={color.surface} opacity="0.6" />
      <polygon points="0,320 0,250 220,160 420,230 640,140 880,220 1080,130 1280,210 1440,150 1440,320" fill={color.surfaceRaised} opacity="0.8" />
      <polygon points="0,320 0,280 260,220 480,270 720,200 960,260 1200,210 1440,260 1440,320" fill={color.bg} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CANYON FLIGHT
// ---------------------------------------------------------------------------

const STOP_DEPTH = 1400;
const FOCAL = 720;
const VB_W = 1200;
const VB_H = 700;
const CX = VB_W / 2;
const CY = VB_H / 2;
const NEAR = 260;
const FAR = 9000;
const SAMPLES = 60;
const FLOOR_Y = 600;

export function cameraAt(camZ) {
  const x = Math.sin(camZ * 0.00085) * 300 + Math.sin(camZ * 0.00042 + 1.1) * 120;
  const y = Math.sin(camZ * 0.00061 + 0.6) * 40;
  return { x, y };
}

function wallOffset(z, baseDist) {
  return baseDist + Math.sin(z * 0.00048 + baseDist * 0.001) * 140;
}

// ---- Distinct mountain peaks ----
// Instead of one smooth sine-wave ridge, we place discrete Gaussian peaks
// at known world-Z positions along each side. Each peak has its own height,
// width, and x offset, so you get short-tall-short-tall variation as you fly
// past rather than a monotonous rolling wave. A slow background undulation
// is added on top so the base is never perfectly flat.
function rand(n) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

const PEAK_SPACING = 2200; // world-Z gap between major peaks
const NUM_PEAKS = 12;

// Pre-compute peak table for each seed so the pattern is stable across frames.
// Heights alternate short/tall to give the varied silhouette you described.
function buildPeaks(seed) {
  return Array.from({ length: NUM_PEAKS }, (_, i) => {
    const r = rand(seed + i * 3.7);
    const heightClass = i % 3 === 0 ? 0.35 : i % 3 === 1 ? 1.0 : 0.6; // short/tall/medium
    return {
      z: i * PEAK_SPACING + rand(seed + i * 1.3) * 600,
      h: (280 + r * 320) * heightClass,
      w: 900 + rand(seed + i * 5.1) * 700,
      dx: (rand(seed + i * 2.2) - 0.5) * 80, // slight lateral shift so peaks aren't in a straight line
    };
  });
}

const PEAK_TABLE_L = [buildPeaks(1.7), buildPeaks(4.1)]; // near + far ridges
const PEAK_TABLE_R = [buildPeaks(8.3), buildPeaks(11.6)];

function peakRidgeHeight(wz, seed, tableIdx, peaksArr) {
  // Sum Gaussian contributions from all peaks within range
  let h = 0;
  for (const p of peaksArr) {
    const dz = wz - p.z;
    h += p.h * Math.exp(-(dz * dz) / (2 * p.w * p.w));
  }
  // Slow background undulation so the valley floor between peaks isn't flat
  h += (Math.sin(wz * 0.00028 + seed) * 0.5 + Math.sin(wz * 0.00071 + seed * 2.1) * 0.3) * 80;
  return h;
}

function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
}

function Ridge({ camZ, cam, side, baseDist, peaksArr, seedOff, fill, rimOpacity }) {
  const sign = side === 'left' ? -1 : 1;
  const top = [];
  const bottom = [];

  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const dz = NEAR * Math.pow(FAR / NEAR, t);
    const wz = camZ + dz;
    const wx = sign * (wallOffset(wz, baseDist) + (peaksArr[Math.floor(t * peaksArr.length)] || peaksArr[0]).dx * 0.3) - cam.x;
    const scale = FOCAL / dz;
    const h = peakRidgeHeight(wz, seedOff, 0, peaksArr);
    const peakY = CY + (-h * 0.85 - cam.y) * scale;
    const floorY = CY + (FLOOR_Y - cam.y) * scale;
    top.push([CX + wx * scale, peakY]);
    bottom.push([CX + wx * scale, floorY]);
  }

  const d = smoothPath(top) +
    ` L ${bottom[bottom.length - 1][0].toFixed(2)} ${bottom[bottom.length - 1][1].toFixed(2)}` +
    ` L ${bottom[0][0].toFixed(2)} ${bottom[0][1].toFixed(2)} Z`;

  return (
    <g>
      <path d={d} fill={fill} />
      {/* snow-cap / rim glow just along the ridge top */}
      <path d={smoothPath(top)} fill="none" stroke={color.gold} strokeWidth="1.8" opacity={rimOpacity} />
    </g>
  );
}

function River({ camZ, cam }) {
  const left = [], right = [], center = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    const dz = NEAR * Math.pow(FAR / NEAR, t);
    const wz = camZ + dz;
    const path = cameraAt(wz).x;
    const wander = Math.sin(wz * 0.00135 + 2.2) * 70;
    const cxw = path + wander - cam.x;
    const halfW = 150 - 40 * t;
    const scale = FOCAL / dz;
    const y = CY + (FLOOR_Y - cam.y) * scale;
    left.push([CX + (cxw - halfW) * scale, y]);
    right.push([CX + (cxw + halfW) * scale, y]);
    center.push([CX + cxw * scale, y]);
  }
  const band = smoothPath(left) +
    ` L ${right[right.length - 1][0].toFixed(2)} ${right[right.length - 1][1].toFixed(2)} ` +
    smoothPath(right.slice().reverse()).replace(/^M/, 'L') + ' Z';
  const spine = smoothPath(center);
  return (
    <g>
      <path d={band} fill="url(#apex-river-fill)" filter="url(#apex-river-blur)" opacity="0.85" />
      <path d={band} fill="url(#apex-river-fill)" opacity="0.55" />
      <path d={spine} fill="none" stroke={color.gold} strokeWidth="3" opacity="0.9" filter="url(#apex-river-blur)" />
      <path d={spine} fill="none" stroke="#CFC9FF" strokeWidth="1.2" opacity="0.75" />
    </g>
  );
}

function Marker({ category, i, camZ, cam, isCurrent }) {
  const worldZ = i * STOP_DEPTH + STOP_DEPTH * 0.45;
  const dz = worldZ - camZ;
  if (dz < 220 || dz > FAR * 0.75) return null;
  const sign = i % 2 === 0 ? -1 : 1;
  const jitter = Math.sin(i * 12.9898) * 0.5 + 0.5;
  const wx = sign * (wallOffset(worldZ, 760) - 120 - jitter * 220) - cam.x;
  const wy = -180 - jitter * 260 - cam.y;
  const scale = FOCAL / dz;
  const sx = CX + wx * scale;
  const sy = CY + wy * scale;
  const r = 96 * scale;
  if (r < 5) return null;
  const fadeIn = Math.min(1, (FAR * 0.75 - dz) / 2600);
  const fadeOut = Math.min(1, (dz - 220) / 420);
  const op = Math.max(0, Math.min(1, fadeIn * fadeOut));
  if (op <= 0.02) return null;
  const Icon = categoryIcons[category.name];
  const stroke = isCurrent ? color.gold : color.goldDim;
  return (
    <g opacity={op}>
      <circle cx={sx} cy={sy} r={r} fill={color.bgDeep} stroke={stroke} strokeWidth={Math.max(0.8, 1.8 * scale * 40)} />
      {isCurrent && <circle cx={sx} cy={sy} r={r * 1.25} fill="none" stroke={color.gold} strokeWidth={Math.max(0.5, scale * 30)} opacity="0.35" />}
      <svg x={sx - r * 0.42} y={sy - r * 0.55} width={r * 0.84} height={r * 0.84} viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
        <Icon width={24} height={24} style={{ color: stroke }} />
      </svg>
      <text x={sx} y={sy + r * 0.72} textAnchor="middle" fill={color.textMuted} style={{ fontFamily: font.mono, fontSize: Math.max(4, r * 0.24), letterSpacing: '0.08em' }}>
        {String(i + 1).padStart(2, '0')}
      </text>
      <text x={sx} y={sy + r * 1.75} textAnchor="middle" fill={isCurrent ? color.gold : color.textMuted} style={{ fontFamily: font.mono, fontSize: Math.max(5, r * 0.26), letterSpacing: '0.12em' }}>
        {category.name.toUpperCase()}
      </text>
    </g>
  );
}

export function CanyonFlight({ rawIndex, categories }) {
  const camZ = rawIndex * STOP_DEPTH;
  const cam = cameraAt(camZ);
  const currentIndex = Math.floor(rawIndex);
  const roll = Math.cos(camZ * 0.00085) * 1.6;

  // Two ridges per side: far one (lighter, taller) sits behind the near one
  // (darker, stops at camera level). The gap between them is what gives the
  // canyon its sense of real depth rather than flat cardboard walls.
  const leftLayers = [
    { peaksArr: PEAK_TABLE_L[1], baseDist: 1900, seedOff: 4.1, fill: color.surface,      rimOpacity: 0.10 },
    { peaksArr: PEAK_TABLE_L[0], baseDist: 860,  seedOff: 1.7, fill: color.bgDeep,       rimOpacity: 0.22 },
  ];
  const rightLayers = [
    { peaksArr: PEAK_TABLE_R[1], baseDist: 1900, seedOff: 11.6, fill: color.surface,     rimOpacity: 0.10 },
    { peaksArr: PEAK_TABLE_R[0], baseDist: 860,  seedOff: 8.3,  fill: color.bgDeep,      rimOpacity: 0.22 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', background: color.bgDeep }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="apex-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color.bgDeep} />
            <stop offset="55%" stopColor={color.bg} />
            <stop offset="100%" stopColor={color.surface} />
          </linearGradient>
          <radialGradient id="apex-haze" cx="50%" cy="50%" r="45%">
            <stop offset="0%" stopColor={color.gold} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color.gold} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="apex-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color.bg} stopOpacity="0" />
            <stop offset="100%" stopColor={color.bgDeep} stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="apex-river-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color.gold} stopOpacity="0.25" />
            <stop offset="100%" stopColor="#B9B2FF" stopOpacity="0.95" />
          </linearGradient>
          <filter id="apex-river-blur" x="-60%" y="-200%" width="220%" height="500%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#apex-sky)" />
        <ellipse cx={CX - cam.x * 0.04} cy={CY} rx="300" ry="200" fill="url(#apex-haze)" />

        <g transform={`rotate(${roll.toFixed(3)} ${CX} ${CY})`}>
          {/* Far ridges first so the near ones overlap them correctly */}
          {leftLayers.map((L, li) => (
            <Ridge key={`L${li}`} camZ={camZ} cam={cam} side="left" {...L} />
          ))}
          {rightLayers.map((L, li) => (
            <Ridge key={`R${li}`} camZ={camZ} cam={cam} side="right" {...L} />
          ))}

          <rect x="0" y={CY + 40} width={VB_W} height={VB_H - CY - 40} fill="url(#apex-floor)" />
          <River camZ={camZ} cam={cam} />

          {categories.map((c, i) => (
            <Marker key={c.name} category={c} i={i} camZ={camZ} cam={cam} isCurrent={i === currentIndex} />
          ))}
        </g>
      </svg>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 80% 75% at 50% 50%, transparent 50%, ${color.bgDeep} 100%)` }} />
    </div>
  );
}
