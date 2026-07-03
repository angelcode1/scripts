// ==UserScript==
// @name         Block YouTube Shorts (Mobile)
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Hides Shorts shelves, tabs, and feed items on m/www.youtube.com. Redirects /shorts/ URLs to the regular /watch player.
// @author       You
// @match        *://m.youtube.com/*
// @match        *://www.youtube.com/*
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
ytm-rich-section-renderer:has(ytm-reel-shelf-renderer),
ytm-shorts-lockup-view-model,
ytm-shorts-lockup-view-model-v2,
ytm-reel-item-renderer,
ytm-reel-player-overlay-renderer,
ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"],
ytm-pivot-bar-item-renderer:has(a[href^="/shorts"]),
ytm-chip-cloud-chip-renderer:has([aria-label="Shorts"]),
ytm-rich-item-renderer:has(a[href^="/shorts"]),
ytm-video-with-context-renderer:has(a[href^="/shorts"]),
ytm-compact-video-renderer:has(a[href^="/shorts"]),
ytd-reel-shelf-renderer,
ytd-rich-shelf-renderer[is-shorts],
ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
ytd-rich-item-renderer:has(a[href^="/shorts"]),
ytd-video-renderer:has(a[href^="/shorts"]),
ytd-compact-video-renderer:has(a[href^="/shorts"]),
ytd-guide-entry-renderer:has(a[title="Shorts"]),
ytd-mini-guide-entry-renderer:has(a[title="Shorts"]),
yt-chip-cloud-chip-renderer:has(yt-formatted-string[title="Shorts"]),
a[href^="/shorts"] {
  display: none !important;
}`;

  let lastPath = null;

  function checkPath() {
    const path = location.pathname;
    if (path === lastPath) return;
    lastPath = path;
    const m = path.match(/^\/shorts\/([\w-]+)/);
    if (m) location.replace('/watch?v=' + m[1]);
  }

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
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
