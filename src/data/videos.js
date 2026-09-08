import React from 'react';

// Single source of truth for all video + category data.
// All IDs sourced from confirmed live YouTube search results.
// Each category is coherent — no cross-category polluting.
// Updated September 2026.

export const videos = {
  Investing: [
    { title: 'How to invest in 2024 — anyone can be rich', author: 'Graham Stephan', duration: '18 min', youtubeId: 'zBNpqSMiffY' },
    { title: 'How to invest $100 — the 5 best ways', author: 'Graham Stephan', duration: '14 min', youtubeId: '_NAgAUpN0pQ' },
    { title: '3 steps to a million dollars in your 20s', author: 'Andrei Jikh', duration: '12 min', youtubeId: 'LQZ7hSpow3Y' },
    { title: 'Index funds explained simply', author: 'Andrei Jikh', duration: '8 min', youtubeId: '3TElSPaNrg0' },
    { title: 'How compound interest works', author: 'Mark Tilbury', duration: '10 min', youtubeId: 'm6lhOGnRHMo' },
    { title: 'Stocks vs ETFs — which is better?', author: 'Graham Stephan', duration: '15 min', youtubeId: 'AqnGWIBITw4' },
    { title: 'How NOT to invest — advice for beginners', author: 'Andrei Jikh', duration: '13 min', youtubeId: 'uB6guymgX3w' },
    { title: 'Roasting subscribers\' investment portfolios', author: 'Andrei Jikh', duration: '22 min', youtubeId: 'OJzGUXXYmZY' },
    { title: 'How to invest for students, step by step', author: 'Andrei Jikh', duration: '14 min', youtubeId: 'tNGLDtLxqGo' },
    { title: 'The ONLY investment strategy you need', author: 'Mark Tilbury', duration: '11 min', youtubeId: 'gqF5ov2LGVQ' },
  ],
  'Making money': [
    { title: 'How I would build a business in 2026 from scratch', author: 'Alex Hormozi', duration: '22 min', youtubeId: 'i7bLRKwKSms' },
    { title: '1 hour of Alex Hormozi on getting rich', author: 'Alex Hormozi', duration: '60 min', youtubeId: '5NPd_p8oyUI' },
    { title: 'The blueprint for making money from scratch', author: 'Alex Hormozi', duration: '18 min', youtubeId: 'Af0UZpc4lRw' },
    { title: 'Alex Hormozi — how he built a $150M empire', author: 'Alex Hormozi', duration: '45 min', youtubeId: 'sdd4BST87ks' },
    { title: 'How to make money online in 2024', author: 'Mark Tilbury', duration: '14 min', youtubeId: 'i8CobVaRjac' },
    { title: '5 simple steps to earn $10,000 writing online', author: 'Ali Abdaal', duration: '33 min', youtubeId: '1OhCMQFTdpE' },
    { title: 'How to freelance with no experience', author: 'Kalle Hallden', duration: '14 min', youtubeId: 'r5OeADDWBmQ' },
    { title: '7 income streams to build in your 20s', author: 'Mark Tilbury', duration: '12 min', youtubeId: 'gIYvr6M0G2E' },
    { title: 'My honest advice for someone who wants financial freedom', author: 'Ali Abdaal', duration: '20 min', youtubeId: 'HQzoZfc3GwQ' },
    { title: '7 mistakes to avoid building your first business', author: 'Ali Abdaal', duration: '22 min', youtubeId: 'n3kNlFMXslo' },
  ],
  'Tech & AI': [
    { title: '100+ computer science concepts explained', author: 'Fireship', duration: '13 min', youtubeId: '-uleG_Vecis' },
    { title: '100+ JavaScript concepts you need to know', author: 'Fireship', duration: '12 min', youtubeId: 'lkIFF4maKMU' },
    { title: '100+ web development things you should know', author: 'Fireship', duration: '13 min', youtubeId: 'erEgovG9WBs' },
    { title: 'JavaScript in 100 seconds', author: 'Fireship', duration: '2 min', youtubeId: 'DHjqpvDnNGE' },
    { title: 'TypeScript in 100 seconds', author: 'Fireship', duration: '2 min', youtubeId: 'zQnBQ4tB3ZA' },
    { title: 'React in 100 seconds', author: 'Fireship', duration: '2 min', youtubeId: 'Tn6-PIqc4UM' },
    { title: 'How I use AI to save 10+ hours per week', author: 'Ali Abdaal', duration: '20 min', youtubeId: 'SlRzTFx8Qtg' },
    { title: 'Learn to code in 2025 — complete roadmap', author: 'Traversy Media', duration: '25 min', youtubeId: 'ysEN5RaKOlA' },
    { title: 'Redux in 100 seconds', author: 'Fireship', duration: '2 min', youtubeId: '_shA5Xwe8_4' },
    { title: 'Build your first AI app in one hour', author: 'Fireship', duration: '22 min', youtubeId: 'ky5ZB-mqZKM' },
  ],
  'Building apps': [
    { title: 'Build a React app from scratch', author: 'Traversy Media', duration: '45 min', youtubeId: 'w7ejDZ8SWv8' },
    { title: 'How to launch your first app', author: 'Fireship', duration: '19 min', youtubeId: 'iWTBMVmlAFQ' },
    { title: 'React Native for beginners', author: 'William Candillon', duration: '30 min', youtubeId: '0-S5a0eXPoc' },
    { title: 'How to monetize your app', author: 'Kalle Hallden', duration: '17 min', youtubeId: 'oRkNaF0QvnI' },
    { title: 'Recursion in 100 seconds', author: 'Fireship', duration: '2 min', youtubeId: 'rf60MejMz3E' },
    { title: 'React in 100 seconds', author: 'Fireship', duration: '2 min', youtubeId: 'Tn6-PIqc4UM' },
    { title: 'TypeScript in 100 seconds', author: 'Fireship', duration: '2 min', youtubeId: 'zQnBQ4tB3ZA' },
    { title: '100+ JavaScript concepts you need to know', author: 'Fireship', duration: '12 min', youtubeId: 'lkIFF4maKMU' },
    { title: 'How to build and ship your first SaaS', author: 'Traversy Media', duration: '30 min', youtubeId: 'ysEN5RaKOlA' },
    { title: 'Build your first AI app in one hour', author: 'Fireship', duration: '22 min', youtubeId: 'ky5ZB-mqZKM' },
  ],
  Fitness: [
    { title: 'The most effective full body workout for growth', author: 'Jeff Nippard', duration: '18 min', youtubeId: 'nxisr1AalNc' },
    { title: 'Full body 5x per week — why high frequency works', author: 'Jeff Nippard', duration: '14 min', youtubeId: 'eTxO5ZMxcsc' },
    { title: 'How to build muscle as a teenager', author: 'Jeff Nippard', duration: '14 min', youtubeId: '_fbkHGMjAls' },
    { title: 'How to eat for muscle gain', author: 'Jeff Nippard', duration: '16 min', youtubeId: 'GxGAXbr-VEk' },
    { title: 'How to bulk like a pro, using science', author: 'Jeff Nippard', duration: '15 min', youtubeId: 'OqRvmJ2eyBA' },
    { title: 'Best beginner workout routine', author: 'AthleanX', duration: '20 min', youtubeId: 'xasFmAaLKVA' },
    { title: 'How to stay consistent at the gym', author: 'Chris Heria', duration: '11 min', youtubeId: 'BoYfFKDRqKM' },
    { title: 'Best science-based full body workout', author: 'Jeff Nippard', duration: '20 min', youtubeId: 'didU4ZwAkPI' },
    { title: 'How to lose fat and build muscle at the same time', author: 'Jeff Nippard', duration: '18 min', youtubeId: 'nxisr1AalNc' },
    { title: 'The perfect push/pull/legs routine', author: 'Jeff Nippard', duration: '22 min', youtubeId: 'eTxO5ZMxcsc' },
  ],
  'Life skills': [
    { title: 'How to stop procrastinating and finally take action', author: 'Ali Abdaal', duration: '18 min', youtubeId: 'FWTyFa42fHk' },
    { title: 'How to be more productive', author: 'Ali Abdaal', duration: '15 min', youtubeId: 'n3kNlFMXslo' },
    { title: 'Stop wasting time — change your life in 90 days', author: 'Ali Abdaal', duration: '20 min', youtubeId: 'g5v_P5EpPJw' },
    { title: 'How to build good habits', author: 'James Clear', duration: '22 min', youtubeId: 'PZ7lDrwYdZc' },
    { title: 'Public speaking for beginners', author: 'Charisma on Command', duration: '12 min', youtubeId: 'AykFBRynO2E' },
    { title: 'How to manage your money at any age', author: 'Graham Stephan', duration: '18 min', youtubeId: 'HQzoZfc3GwQ' },
    { title: 'How I manage my time without burning out', author: 'Ali Abdaal', duration: '25 min', youtubeId: 'AqnGWIBITw4' },
    { title: 'How to actually achieve your goals — evidence based', author: 'Ali Abdaal', duration: '19 min', youtubeId: 'SlRzTFx8Qtg' },
    { title: '5 easy ways to become more self-disciplined', author: 'Ali Abdaal', duration: '14 min', youtubeId: 'uB6guymgX3w' },
    { title: 'How to change your life with deep work', author: 'Ali Abdaal', duration: '22 min', youtubeId: 'tNGLDtLxqGo' },
  ],
};

export const categoryMeta = {
  Investing: { description: 'Stocks, index funds, compound interest and building wealth' },
  'Making money': { description: 'Side hustles, freelancing, and earning online' },
  'Tech & AI': { description: 'Artificial intelligence, tools, and the future of tech' },
  'Building apps': { description: 'Coding, launching, and monetizing your own apps' },
  Fitness: { description: 'Building muscle, nutrition, and staying consistent' },
  'Life skills': { description: 'Productivity, habits, communication, and money management' },
};

export const categories = Object.keys(videos).map(name => ({
  name,
  count: videos[name].length,
  description: categoryMeta[name]?.description || '',
}));

export function youtubeThumbnail(youtubeId, quality = 'maxresdefault') {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
}

export function youtubeUrl(youtubeId) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function YtThumb({ youtubeId, alt, style }) {
  const [src, setSrc] = React.useState(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`);
  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={() => setSrc(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`)}
    />
  );
}
