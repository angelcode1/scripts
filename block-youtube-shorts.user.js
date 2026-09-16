// ==UserScript==
// @name         Block YouTube Shorts (Mobile)
// @namespace    https://greasyfork.org/
// @version      1.1.0
// @description  Hides Shorts shelves, tabs, and feed items on m.youtube.com. Redirects /shorts/ URLs to the regular /watch player. (Desktop www.youtube.com is handled by the separate desktop script.)
// @author       You
// @match        *://m.youtube.com/*
// @grant        none
// @inject-into  content
// @run-at       document-start
// @license      MIT
// ==/UserScript==
(function () {
  'use strict';

  const STYLE_ID = 'yt-no-shorts-css';
  const CSS = `
ytm-reel-shelf-renderer,
ytm-shorts-lockup-view-model,
ytm-shorts-lockup-view-model-v2,
ytm-reel-item-renderer,
ytm-reel-player-overlay-renderer,
ytm-rich-section-renderer:has(
  ytm-reel-shelf-renderer,
  ytm-shorts-lockup-view-model,
  ytm-shorts-lockup-view-model-v2
),
grid-shelf-view-model:has(
  a[href^="/shorts"],
  ytm-shorts-lockup-view-model,
  ytm-shorts-lockup-view-model-v2
),
ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"],
ytm-pivot-bar-item-renderer:has(a[href^="/shorts"], .pivot-shorts),
yt-tab-shape[tab-title="Shorts"],
ytm-chip-cloud-chip-renderer:has([aria-label="Shorts"]),
ytm-rich-item-renderer:has(a[href^="/shorts"]),
ytm-video-with-context-renderer:has(a[href^="/shorts"]),
ytm-compact-video-renderer:has(a[href^="/shorts"]),
a[href^="/shorts"] {
  display: none !important;
}`;

  let styleEl = null;

  function injectCSS() {
    if (styleEl && styleEl.isConnected) return;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      styleEl.textContent = CSS;
    }
    (document.head || document.documentElement).appendChild(styleEl);
  }

  let lastPath = null;

  function checkPath() {
    const path = location.pathname;
    if (path === lastPath) return;
    lastPath = path;
    const m = path.match(/^\/shorts\/([\w-]+)/);
    if (m) location.replace('/watch?v=' + m[1]);
  }

  let scheduled = false;

  function onMutations() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      checkPath();
      injectCSS();
    });
  }

  function start() {
    checkPath();
    injectCSS();
    new MutationObserver(onMutations).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    window.addEventListener('popstate', checkPath);
    window.addEventListener('yt-navigate-finish', checkPath);
  }

  if (document.documentElement) {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }
})();
