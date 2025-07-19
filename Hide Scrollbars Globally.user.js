// ==UserScript==
// @name         Hide Scrollbars Globally
// @namespace    https://example.com
// @version      1.0
// @description  Hides all scrollbars on every website without breaking scrolling functionality
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* Hide scrollbars but keep scrolling enabled */
        ::-webkit-scrollbar {
            display: none !important;
        }
        html, body {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;     /* Firefox */
        }
    `;
    document.head.appendChild(style);
})();
