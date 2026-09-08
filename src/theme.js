// Apex design tokens.
// Direction: "trailhead / summit" — the app is literally named for a peak,
// so progress reads as elevation gained, and depth in the UI reads as
// literal elevation (layered ridgelines, shadow depth) rather than a
// generic flat-dark-mode + single-accent look.

export const color = {
  bg: '#0B0D10',
  bgDeep: '#07080A',
  surface: '#15181C',
  surfaceRaised: '#1B1F24',
  border: '#262B31',
  borderStrong: '#3A4148',

  gold: '#7F77DD',
  goldDim: '#4A4390',
  goldMuted: 'rgba(127, 119, 221, 0.12)',
  glow: 'rgba(127, 119, 221, 0.35)',

  sage: '#7A9B7E',
  sageMuted: 'rgba(122, 155, 126, 0.14)',

  textPrimary: '#EDEAE3',
  textSecondary: '#9CA3A9',
  textMuted: '#5C6167',
  textFaint: '#3A3E43',
};

export const font = {
  display: "'Oswald', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

export const eyebrow = {
  fontFamily: font.mono,
  fontSize: 11,
  letterSpacing: '0.12em',
  color: color.gold,
  textTransform: 'uppercase',
};

// Elevation shadows — every raised surface gets one of these instead of
// sitting flush with the background. This is what gives the app "layers."
export const shadow = {
  sm: '0 2px 10px rgba(0,0,0,0.30)',
  md: '0 10px 28px rgba(0,0,0,0.38)',
  lg: '0 22px 50px rgba(0,0,0,0.48)',
  glow: '0 10px 28px rgba(0,0,0,0.38), 0 0 0 1px rgba(127,119,221,0.18)',
};
