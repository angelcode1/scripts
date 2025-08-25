// ==UserScript==
// @name         YouTube Shorts Remover
// @namespace    https://youtube.com/
// @version      1.0
// @description  Removes YouTube Shorts and related UI elements from YouTube and YouTube Mobile
// @author       ChatGPT
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const selectors = [
        'ytd-guide-renderer a.yt-simple-endpoint path[d^="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33"]',
        'ytd-mini-guide-renderer a.yt-simple-endpoint path[d^="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33"]',
        'ytd-browse[page-subtype="home"] .ytd-thumbnail[href^="/shorts/"]',
        'ytd-browse[page-subtype="subscriptions"] .ytd-thumbnail[href^="/shorts/"]',
        'ytd-search .ytd-thumbnail[href^="/shorts/"]',
        'ytd-browse[page-subtype="subscriptions"] ytd-video-renderer .ytd-thumbnail[href^="/shorts/"]',
        'ytd-watch-next-secondary-results-renderer .ytd-thumbnail[href^="/shorts/"]',
        'ytd-browse[page-subtype="trending"] .ytd-thumbnail[href^="/shorts/"]',
        'ytd-search .ytd-thumbnail[href^="/shorts/"]',
        'ytd-notification-renderer a[href^="/shorts/"]',
        'ytd-rich-shelf-renderer[is-shorts]',
        'ytd-rich-shelf-renderer[is-shorts].ytd-rich-section-renderer',
        'ytd-reel-shelf-renderer',
        'ytm-reel-shelf-renderer',
        'ytm-pivot-bar-renderer div.pivot-shorts',
        'ytm-browse ytm-item-section-renderer ytm-thumbnail-overlay-time-status-renderer[data-style="SHORTS"]',
        'ytm-search ytm-thumbnail-overlay-time-status-renderer[data-style="SHORTS"]',
        'ytm-single-column-watch-next-results-renderer ytm-thumbnail-overlay-time-status-renderer span'
    ];

    const removeShorts = () => {
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                // Traverse upward to find the parent container to hide
                let container = el.closest('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer, ytd-item-section-renderer, ytd-compact-video-renderer, ytd-shelf-renderer, ytd-rich-section-renderer, ytm-video-with-context-renderer, ytm-compact-video-renderer, ytm-pivot-bar-item-renderer');
                if (!container) container = el;
                container.style.display = 'none';
            });
        });

        // Specific case: shorts on homepage as grid
        const richGrids = document.querySelectorAll('ytd-rich-grid-row, #contents.ytd-rich-grid-row');
        richGrids.forEach(el => el.style.display = 'contents');
    };

    // Run once on page load and also when new elements are loaded
    const observer = new MutationObserver(removeShorts);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    removeShorts();
})();
