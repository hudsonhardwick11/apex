import React from 'react';

// Clean line-style category icons (replaces emoji icons).
// All use currentColor so they inherit whatever color is passed in.

const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function InvestingIcon(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="3 17 9 11 13 15 21 6" />
      <polyline points="15 6 21 6 21 12" />
    </svg>
  );
}

export function MoneyIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="3" />
      <line x1="6" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="18" y2="12" />
    </svg>
  );
}

export function TechAIIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="5" width="14" height="14" rx="3" />
      <circle cx="9.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <path d="M9 15c.8.7 1.9 1 3 1s2.2-.3 3-1" />
      <line x1="12" y1="5" x2="12" y2="2" />
      <line x1="5" y1="10" x2="2" y2="10" />
      <line x1="19" y1="10" x2="22" y2="10" />
    </svg>
  );
}

export function BuildingAppsIcon(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="8 8 3 12 8 16" />
      <polyline points="16 8 21 12 16 16" />
      <line x1="13.5" y1="5" x2="10.5" y2="19" />
    </svg>
  );
}

export function FitnessIcon(props) {
  return (
    <svg {...base} {...props}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <rect x="1.5" y="9" width="3" height="6" rx="1" />
      <rect x="19.5" y="9" width="3" height="6" rx="1" />
      <rect x="5.5" y="7" width="2.5" height="10" rx="1" />
      <rect x="16" y="7" width="2.5" height="10" rx="1" />
    </svg>
  );
}

export function LifeSkillsIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.1V16h6v-.4c0-.8.4-1.5 1-2.1A6 6 0 0 0 12 3z" />
    </svg>
  );
}

export const categoryIcons = {
  Investing: InvestingIcon,
  'Making money': MoneyIcon,
  'Tech & AI': TechAIIcon,
  'Building apps': BuildingAppsIcon,
  Fitness: FitnessIcon,
  'Life skills': LifeSkillsIcon,
};
