// ==UserScript==
// @name         YouTube Shorts Remover (Desktop, CSS)
// @namespace    yt-shorts-desktop-css
// @version      1.2.0
// @description  Fast, flicker-free removal of YouTube Shorts on desktop via CSS injection
// @match        https://www.youtube.com/*
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==
(() => {
  'use strict';

  const CSS = `
:is(ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer):has(a[href^="/shorts"]),

:is(ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer,
    ytd-compact-video-renderer, yt-lockup-view-model):has(a[href^="/shorts"], [overlay-style="SHORTS"]),

ytd-notification-renderer:has(a[href^="/shorts"], a[href*="youtube.com/shorts"]),

ytd-reel-shelf-renderer,
ytd-rich-shelf-renderer[is-shorts],
ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
ytd-rich-section-renderer:has(a[href^="/shorts"]),
grid-shelf-view-model:has(a[href^="/shorts"]),

ytd-secondary-search-container-renderer:has(a[href^="/shorts"]) {
  display: none !important;
}

@supports selector(:has(a)) {
  ytd-rich-grid-row,
  #contents.ytd-rich-grid-row {
    display: contents !important;
  }
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

  const toWatch = () => {
    const m = location.pathname.match(/^\/shorts\/([\w-]{5,})/);
    if (m) location.replace(`/watch?v=${m[1]}`);
  };
  toWatch();
  window.addEventListener('yt-navigate-start', toWatch, true);
})();
