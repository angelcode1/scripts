// ==UserScript==
// @name         YouTube Shorts Remover (Updated 2025)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Removes YouTube Shorts from all views (Home, Subscriptions, Search, etc.)
// @author       Updated by ChatGPT
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // Optional: Redirect if user is directly on a Shorts video
    if (window.location.pathname.startsWith('/shorts/')) {
        window.location.href = 'https://www.youtube.com';
        return;
    }

    const isShorts = (el) => {
        // Catch elements that link to shorts or have visual clues
        return (
            el?.href?.includes('/shorts/') ||
            el?.querySelector?.('a[href*="/shorts/"], ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts]') ||
            el?.getAttribute?.('is-shorts') !== null
        );
    };

    const removeShorts = () => {
        const all = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-reel-shelf-renderer, ytd-rich-shelf-renderer, ytd-compact-video-renderer');
        all.forEach(el => {
            if (isShorts(el)) {
                el.style.display = 'none';
            }
        });

        // For mobile
        const mobileShorts = document.querySelectorAll('ytm-reel-shelf-renderer, ytm-item-section-renderer div[title="Shorts"]');
        mobileShorts.forEach(el => el.style.display = 'none');
    };

    // Observe changes in DOM
    const observer = new MutationObserver(() => removeShorts());
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    removeShorts();
})();
