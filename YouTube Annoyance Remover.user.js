// ==UserScript==
// @name         YouTube Annoyance Remover
// @namespace    https://example.com
// @version      1.0
// @description  Removes Shorts, mixes, playlists, end screens, and other clutter from YouTube including search results.
// @author       You
// @match        *://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/fe2e8d9b/img/favicon.ico
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    function deepCleanYouTube() {
        const blockedKeywords = [
            'shorts', 'mix', 'supermix', 'playlist', 'your mix', 'my mix',
            'created for you', 'recommended', 'because you watched'
        ];

        const isChannelPage = window.location.pathname.startsWith("/@") ||
                               window.location.pathname.includes("/channel/");

        function cleanByKeywords(selectors, aggressive = false) {
            document.querySelectorAll(selectors.join(', ')).forEach(el => {
                const text = el.textContent.toLowerCase();
                if (blockedKeywords.some(keyword => text.includes(keyword))) {
                    const isInSidebar = el.closest('#related');
                    const isAggressiveAllowed = aggressive && !isChannelPage;
                    if (isAggressiveAllowed || (!isInSidebar && !isChannelPage)) {
                        el.remove();
                    }
                }
            });
        }

        // Clean search results
        document.querySelectorAll('ytd-search ytd-item-section-renderer #contents > :is(:not(ytd-video-renderer,yt-showing-results-for-renderer,[icon-name="promo-full-height:EMPTY_SEARCH"]),ytd-video-renderer:has([aria-label="Shorts"]))').forEach(el => {
             el.remove();
        });
        document.querySelectorAll('ytd-secondary-search-container-renderer').forEach(el => {
            el.remove();
        });

        // Remove Shorts shelf and buttons
        document.querySelectorAll('ytd-reel-shelf-renderer').forEach(el => el.remove());
        const shortsSidebarBtn = document.querySelector('a[title="Shorts"], ytd-mini-guide-entry-renderer[title="Shorts"]');
        if (shortsSidebarBtn) shortsSidebarBtn.style.display = 'none';

        // Hide end screens
        const endScreen = document.querySelector('ytd-watch-next-end-screen-renderer');
        if (endScreen) endScreen.style.display = 'none';
        document.querySelectorAll('.ytp-ce-element').forEach(el => el.style.display = 'none');

        cleanByKeywords([
            'ytd-rich-grid-row',
            'ytd-rich-item-renderer',
            'ytd-video-renderer',
            'ytd-grid-video-renderer',
            'ytd-radio-renderer',
            'ytd-playlist-renderer',
            'ytd-grid-playlist-renderer',
            'ytd-shelf-renderer',
            'ytd-rich-shelf-renderer',
        ], true);

        cleanByKeywords([
            'ytd-compact-video-renderer',
            'ytd-compact-radio-renderer',
            'ytd-compact-autoplay-renderer'
        ]);
    }

    function removeInfiniteScrollBar() {
        document.querySelectorAll('ytd-continuation-item-renderer').forEach(el => {
            const prev = el.previousElementSibling;
            const isAfterDeadRow = prev && (
                prev.tagName.includes('REEL') ||
                prev.textContent.toLowerCase().includes('shorts')
            );
            if (isAfterDeadRow) el.remove();
        });

        document.querySelectorAll('yt-page-spinner, tp-yt-paper-spinner').forEach(el => {
            if (el.offsetParent !== null) el.remove();
        });
    }

    const observer = new MutationObserver(() => {
        deepCleanYouTube();
        removeInfiniteScrollBar();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    deepCleanYouTube();
    removeInfiniteScrollBar();
})();
