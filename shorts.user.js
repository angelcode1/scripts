// ==UserScript==
// @name         YouTube Shorts Remover (Desktop, CSS)
// @namespace    yt-shorts-desktop-css
// @version      2.0.0
// @description  Fast, flicker-free removal of YouTube Shorts on desktop via pure CSS injection — no per-frame DOM scanning, no framework churn.
// @match        https://www.youtube.com/*
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==
(() => {
  'use strict';

  const CSS = `
/* ---- Sidebar Shorts entry (expanded + collapsed rail) ---- */
ytd-guide-entry-renderer:has(a[href^="/shorts"]),
ytd-mini-guide-entry-renderer:has(a[href^="/shorts"]),

/* ---- Individual Shorts cards ----
   Matched two ways: by /shorts URL, and by the thumbnail's SHORTS overlay
   (catches cards that render without an obvious /shorts href, e.g. in
   mixed grids and the subscriptions feed). ---- */
ytd-rich-item-renderer:has(a[href^="/shorts"]),
ytd-video-renderer:has(a[href^="/shorts"]),
ytd-grid-video-renderer:has(a[href^="/shorts"]),
ytd-compact-video-renderer:has(a[href^="/shorts"]),
ytd-rich-item-renderer:has([overlay-style="SHORTS"]),
ytd-video-renderer:has([overlay-style="SHORTS"]),
ytd-grid-video-renderer:has([overlay-style="SHORTS"]),

/* ---- Notifications linking to a Short ---- */
ytd-notification-renderer:has(a[href^="/shorts"]),

/* ---- Shorts shelves / sections ----
   Remove the whole section wrapper, not just the inner shelf, so no empty
   container is left behind. grid-shelf-view-model is the newer Lit component
   used for Shorts grids on the search page. ---- */
ytd-reel-shelf-renderer,
ytd-rich-shelf-renderer[is-shorts],
ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
ytd-rich-section-renderer:has(a[href^="/shorts"]),
grid-shelf-view-model:has(a[href^="/shorts"]),

/* ---- Shorts in the search-page right-hand rail (optional; remove this line
   if it ever hides a wanted panel) ---- */
ytd-secondary-search-container-renderer:has(a[href^="/shorts"]) {
  display: none !important;
}

/* ---- Collapse homepage grid rows so hidden cards leave no gaps ---- */
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
    // documentElement exists at document-start (before <head>); a <style>
    // parented there still applies globally. Re-affirm on DOMContentLoaded
    // in case <head> construction ever discards the early node.
    (document.head || document.documentElement).appendChild(style);
  };

  inject();
  document.addEventListener('DOMContentLoaded', inject, { once: true });
})();
