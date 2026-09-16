// ==UserScript==
// @name         YouTube Keyword Filter
// @namespace    https://greasyfork.org/
// @version      2.1.0
// @description  Hide YouTube videos, channels and playlists by keywords.
// @author       You
// @match        https://www.youtube.com/*
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==
(() => {
  'use strict';
  const BLOCKED = [
    'bhajan', 'aarti', 'mantra', 'kirtan', 'hanuman', 'shiv', 'krishna',
    'sanatan', 'dharma', 'bhakti', 'mahadev', 'ram', 'radha', 'bajrangbali',
    'bhagavad', 'gita', 'chanakya', 'niti', 'karma', 'mahabharata',
    'ramayana', 'diwali', 'navratri', 'shivratri', 'holi', 'ganesh',
    'chaturthi', 'puja', 'vidhi', 'chalisa', 'jagran', 'mandir', 'satsang',
    'vishnu', 'durga', 'lakshmi', 'saraswati', 'ganesha', 'ganpati',
    'vedic', 'upanishad', 'purana', 'iskcon', 'vrindavan', 'tirupati',
    'quran', 'tilawat', 'dua', 'namaz', 'azan', 'yaseen', 'rahman',
    'ayatul', 'kursi', 'roza', 'niyat', 'naat', 'nasheed', 'hamd',
    'qawwali', 'jumma', 'jummah', 'deeni', 'madina', 'makkah', 'muharram',
    'ramadan', 'bayan', 'hadith', 'tafseer', 'prophet', 'muhammad',
    'karbala', 'mufti', 'menk', 'tariq jameel', 'surah', 'allah',
    'bismillah', 'alhamdulillah', 'inshallah', 'subhanallah', 'tajweed',
    'ruqyah', 'seerah', 'sunnah', 'umrah', 'hajj', 'iftar', 'eid',
    'dhikr', 'zikr', 'maulana', 'moulana',
    'gurbani', 'shabad', 'waheguru', 'gurdwara', 'nitnem', 'paath',
    'ardas', 'satnam',
    'भजन', 'आरती', 'कीर्तन', 'हनुमान', 'कृष्ण', 'महादेव', 'रामायण',
    'नमाज', 'क़ुरान', 'कुरान', 'तिलावत',
    'قرآن', 'نعت', 'اذان', 'تلاوت', 'نماز', 'درود',
    'tarot', 'psychic', 'clairvoyant', 'mediumship', 'card reading',
    'palm reading', 'palmistry', 'astrology', 'horoscope', 'zodiac',
    'numerology', 'divination', 'occult', 'witchcraft', 'wicca',
    'wiccan', 'pagan', 'paganism', 'ouija', 'seance', 'crystal healing',
    'reiki', 'chakra', 'kundalini', 'third eye', 'law of attraction',
    'manifestation', 'spirit guide', 'spirit guides', 'akashic',
    'twin flame', 'twin flames', 'starseed', 'lightworker',
    'angel number', 'angel numbers', 'astral projection',
    'past life regression', 'energy healing', 'oracle card',
    'oracle cards', 'shaman', 'shamanic', 'new age',
    'buddha', 'buddhist', 'buddhism', 'dalai lama', 'vipassana',
    'theravada', 'mahayana', 'zen buddhism', 'taoism', 'taoist',
    'daoism', 'daoist', 'tao te ching', 'shinto', 'jainism', 'mahavir',
    'zoroastrian', 'bahai', 'sufi', 'sufism',
    'mormon', 'mormonism', 'lds', 'latter-day', 'latter day',
    'joseph smith', 'watchtower', 'catholic', 'catholicism',
    'rosary', 'novena', 'vatican', 'pope', 'latin mass', 'catechism',
    'eucharist', 'orthodox', 'coptic',
    'amish', 'mennonite', 'christian science',
    'scientology', 'dianetics',
  ];

  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const isAscii = s => /^[\x00-\x7F]+$/.test(s);
  const norm = BLOCKED.map(k => k.normalize('NFC')); // match form of normalized page text
  const bounded = norm.filter(isAscii).map(esc);
  const substrs = norm.filter(k => !isAscii(k)).map(esc);
  const parts = [];
  if (bounded.length) parts.push(`\\b(?:${bounded.join('|')})\\b`);
  if (substrs.length) parts.push(`(?:${substrs.join('|')})`);
  const PATTERN = new RegExp(parts.join('|'), 'i');

  const CSS = `
.kf-hidden { display: none !important; }
ytd-rich-grid-row,
#contents.ytd-rich-grid-row { display: contents !important; }
`;
  const STYLE_ID = 'kf-style';
  const injectStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  };

  const ITEMS = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-grid-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-playlist-renderer',
    'ytd-channel-renderer',
    'yt-lockup-view-model',
  ].join(',');

  const TITLE_SEL = '#video-title, #channel-title, h3';
  const BYLINE_SEL = '#channel-name, ytd-channel-name';

  const textOf = el => {
    const title = el.querySelector(TITLE_SEL)?.textContent ?? '';
    const byline = el.querySelector(BYLINE_SEL)?.textContent ?? '';
    const label = title
      ? ''
      : (el.querySelector('a[aria-label]')?.getAttribute('aria-label') ?? '');
    return `${title} ${byline} ${label}`.replace(/\s+/g, ' ').trim();
  };

  const seen = new WeakMap(); // item element -> last evaluated text

  const evaluate = el => {
    const text = textOf(el);
    if (seen.get(el) === text) return;
    seen.set(el, text);
    el.classList.toggle('kf-hidden', text !== '' && PATTERN.test(text.normalize('NFC')));
  };

  const scan = () => {
    for (const el of document.querySelectorAll(ITEMS)) evaluate(el);
  };

  // Targeted processing: only evaluate items whose subtree actually mutated,
  // instead of rescanning the whole document on every mutation frame.
  const pending = new Set();
  let queued = false;
  const flush = () => {
    queued = false;
    for (const el of pending) {
      if (el.isConnected) evaluate(el);
    }
    pending.clear();
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(flush);
  };

  const ownerItem = node => {
    const el = node.nodeType === 1 ? node : node.parentElement;
    return el ? el.closest(ITEMS) : null;
  };

  const onMutations = records => {
    for (const r of records) {
      const host = ownerItem(r.target);
      if (host) pending.add(host);
      if (r.type !== 'childList') continue;
      for (const n of r.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.matches(ITEMS)) pending.add(n);
        else for (const el of n.querySelectorAll(ITEMS)) pending.add(el);
      }
    }
    if (pending.size) schedule();
  };

  injectStyle();
  scan();
  new MutationObserver(onMutations).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true, // title text swapped in-place during DOM recycling
  });
  document.addEventListener('DOMContentLoaded', injectStyle, { once: true });
  window.addEventListener('yt-navigate-finish', scan); // belt-and-braces per SPA navigation
})();
