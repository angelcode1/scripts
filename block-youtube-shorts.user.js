// ==UserScript==
// @name         Block YouTube Shorts (Mobile)
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  Hides Shorts shelves, tabs, and links on m.youtube.com. Redirects /shorts/ URLs to regular /watch/ player.
// @author       You
// @match        *://m.youtube.com/*
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  function redirectShorts() {
    const match = location.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
    if (match) {
      const videoId = match[1];
      location.replace('/watch?v=' + videoId);
    }
  }
  redirectShorts();

  const css = `
    /* Shorts shelf / reel shelf on home & search */
    ytm-reel-shelf-renderer,
    ytm-shorts-lockup-view-model,
    ytm-shorts-lockup-view-model-v2,
    ytm-reel-item-renderer,
    ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"],

    ytd-reel-shelf-renderer,
    ytd-rich-shelf-renderer[is-shorts],
    ytd-guide-entry-renderer a[title="Shorts"],

    yt-chip-cloud-chip-renderer:has(yt-formatted-string[title="Shorts"]),
    ytm-chip-cloud-chip-renderer:has([aria-label="Shorts"]),

    ytm-video-with-context-renderer:has(ytm-badge-and-byline-renderer [aria-label*="Short"]),

    ytm-pivot-bar-item-renderer:has(a[href*="/shorts"]),

    ytd-mini-guide-entry-renderer a[title="Shorts"],

    ytm-reel-player-overlay-renderer,

    a[href^="/shorts"],
    a[href*="/shorts/"] {
      display: none !important;
    }
  `;

  function injectStyles() {
    if (document.getElementById('yt-no-shorts-css')) return;
    const style = document.createElement('style');
    style.id = 'yt-no-shorts-css';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  }

  const SHORTS_SELECTORS = [
    'ytm-reel-shelf-renderer',
    'ytm-shorts-lockup-view-model',
    'ytm-shorts-lockup-view-model-v2',
    'ytm-reel-item-renderer',
    'ytd-reel-shelf-renderer',
    'ytd-rich-shelf-renderer[is-shorts]',
  ];

  function removeNodes() {
    for (const sel of SHORTS_SELECTORS) {
      document.querySelectorAll(sel).forEach(el => el.remove());
    }
    document.querySelectorAll('a[href^="/shorts"]').forEach(link => {
      const container =
        link.closest('ytm-video-with-context-renderer') ||
        link.closest('ytm-compact-video-renderer') ||
        link.closest('ytd-video-renderer') ||
        link.closest('ytd-compact-video-renderer');
      if (container) container.remove();
    });
  }

  const observer = new MutationObserver(() => {
    redirectShorts();
    removeNodes();
  });

  function startObserver() {
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.body) {
    startObserver();
  } else {
    document.addEventListener('DOMContentLoaded', startObserver);
  }

  const origPushState = history.pushState;
  const origReplaceState = history.replaceState;

  history.pushState = function () {
    origPushState.apply(this, arguments);
    redirectShorts();
  };

  history.replaceState = function () {
    origReplaceState.apply(this, arguments);
    redirectShorts();
  };

  window.addEventListener('popstate', redirectShorts);
  window.addEventListener('yt-navigate-finish', redirectShorts);
})();
