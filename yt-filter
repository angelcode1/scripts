// ==UserScript==
// @name         YouTube Keyword Filter
// @namespace    https://greasyfork.org/
// @version      2.0.0
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
  ];

  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const isAscii = s => /^[\x00-\x7F]+$/.test(s);
  const bounded = BLOCKED.filter(isAscii).map(esc);
  const substrs = BLOCKED.filter(k => !isAscii(k)).map(esc);
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
  injectStyle();

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

  const evaluate = el => {
    const text = textOf(el);
    if (el.dataset.kfText === text) return;
    el.dataset.kfText = text;
    el.classList.toggle('kf-hidden', text !== '' && PATTERN.test(text.normalize('NFC')));
  };

  const scan = () => {
    for (const el of document.querySelectorAll(ITEMS)) evaluate(el);
  };

  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scan();
    });
  };

  const start = () => {
    injectStyle(); // re-assert in case of early document-start race
    scan();
    new MutationObserver(schedule).observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
