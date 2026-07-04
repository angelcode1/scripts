// ==UserScript==
// @name         YouTube Shorts Remover (Desktop, CSS)
// @namespace    yt-shorts-desktop-css
// @version      1.0.0
// @description  Fast, flicker-free removal of YouTube Shorts on desktop via pure CSS injection — no per-frame DOM scanning, no framework churn.
// @match        https://www.youtube.com/*
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==
(() => {
  'use strict';

  const CSS = `
ytd-guide-entry-renderer:has(a[href^="/shorts"]),
ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),

ytd-rich-item-renderer:has(a[href^="/shorts"]),
ytd-video-renderer:has(a[href^="/shorts"]),
ytd-grid-video-renderer:has(a[href^="/shorts"]),
ytd-compact-video-renderer:has(a[href^="/shorts"]),
ytd-rich-item-renderer:has([overlay-style="SHORTS"]),
ytd-video-renderer:has([overlay-style="SHORTS"]),
ytd-grid-video-renderer:has([overlay-style="SHORTS"]),

ytd-notification-renderer:has(a[href^="/shorts"]),

ytd-reel-shelf-renderer,
ytd-rich-shelf-renderer[is-shorts],
ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
ytd-rich-section-renderer:has(a[href^="/shorts"]),
grid-shelf-view-model:has(a[href^="/shorts"]),

ytd-secondary-search-container-renderer:has(a[href^="/shorts"]) {
  display: none !important;
}

ytd-rich-grid-row,
#contents.ytd-rich-grid-row {
  display: contents !important;
}
`;

  const STYLE_ID = 'yt-shorts-remover-css';

  const inject = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  };

  inject();
  document.addEventListener('DOMContentLoaded', inject, { once: true });
})();
