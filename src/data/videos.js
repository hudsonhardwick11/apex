// Single source of truth for all video + category data.
// Home.js, Browse.js, Category.js, and VideoPage.js all import from here
// so counts and content never get out of sync again.

export const videos = {
  Investing: [
    { title: 'How to start investing at any age', author: 'Graham Stephan', duration: '12 min', youtubeId: 'gFQNPmLKj1k' },
    { title: 'Index funds explained simply', author: 'Andrei Jikh', duration: '8 min', youtubeId: '3TElSPaNrg0' },
    { title: 'How compound interest works', author: 'Mark Tilbury', duration: '10 min', youtubeId: 'm6lhOGnRHMo' },
    { title: 'Stocks vs ETFs — which is better?', author: 'Graham Stephan', duration: '15 min', youtubeId: 'AqnGWIBITw4' },
  ],
  'Making money': [
    { title: 'How I made $100M by 30', author: 'Alex Hormozi', duration: '18 min', youtubeId: 'gIYvr6M0G2E' },
    { title: 'Best side hustles for teenagers', author: 'Sunny Lenarduzzi', duration: '11 min', youtubeId: '5GC6XHFGpVo' },
    { title: 'How to freelance with no experience', author: 'Kalle Hallden', duration: '14 min', youtubeId: 'r5OeADDWBmQ' },
    { title: 'Selling digital products online', author: 'Ali Abdaal', duration: '20 min', youtubeId: '1OhCMQFTdpE' },
  ],
  'Tech & AI': [
    { title: 'Build your first AI app in one hour', author: 'Fireship', duration: '22 min', youtubeId: 'ky5ZB-mqZKM' },
    { title: 'How AI is changing everything', author: 'Mark Zuckerberg', duration: '16 min', youtubeId: 'bc6uFV9CJGg' },
    { title: 'Learn to code in 2025', author: 'Traversy Media', duration: '25 min', youtubeId: 'ysEN5RaKOlA' },
    { title: 'The most useful AI tools right now', author: 'Matt Wolfe', duration: '13 min', youtubeId: 'SlRzTFx8Qtg' },
  ],
  'Building apps': [
    { title: 'Build a React app from scratch', author: 'Traversy Media', duration: '45 min', youtubeId: 'w7ejDZ8SWv8' },
    { title: 'How to launch your first app', author: 'Fireship', duration: '19 min', youtubeId: 'iWTBMVmlAFQ' },
    { title: 'React Native for beginners', author: 'William Candillon', duration: '30 min', youtubeId: '0-S5a0eXPoc' },
    { title: 'How to monetize your app', author: 'Kalle Hallden', duration: '17 min', youtubeId: 'oRkNaF0QvnI' },
  ],
  Fitness: [
    { title: 'How to build muscle as a teenager', author: 'Jeff Nippard', duration: '14 min', youtubeId: '_fbkHGMjAls' },
    { title: 'Best beginner workout routine', author: 'AthleanX', duration: '20 min', youtubeId: 'xasFmAaLKVA' },
    { title: 'How to eat for muscle gain', author: 'Jeff Nippard', duration: '16 min', youtubeId: 'GxGAXbr-VEk' },
    { title: 'How to stay consistent at the gym', author: 'Chris Heria', duration: '11 min', youtubeId: 'BoYfFKDRqKM' },
  ],
  'Life skills': [
    { title: 'How to manage your money at any age', author: 'Graham Stephan', duration: '18 min', youtubeId: 'HQzoZfc3GwQ' },
    { title: 'How to be more productive', author: 'Ali Abdaal', duration: '15 min', youtubeId: 'n3kNlFMXslo' },
    { title: 'Public speaking for beginners', author: 'Charisma on Command', duration: '12 min', youtubeId: 'AykFBRynO2E' },
    { title: 'How to build good habits', author: 'James Clear', duration: '22 min', youtubeId: 'PZ7lDrwYdZc' },
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

// Category list with REAL video counts (derived from the data above, never hardcoded)
export const categories = Object.keys(videos).map(name => ({
  name,
  count: videos[name].length,
  description: categoryMeta[name]?.description || '',
}));

export function youtubeThumbnail(youtubeId, quality = 'hqdefault') {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
}

export function youtubeUrl(youtubeId) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}


