// @description Add a better search results page to Wikimedia Commons

import { $, $$, elementFromHtml } from '../utils.js';

const style = `
    .searchResultImage td:nth-child(2),
    .mw-search-result-heading,
    .searchresult,
    .mw-search-result-data,
    .body.show-on-commons {
        display: none !important;
    }

    .mw-search-results,
    .mw-gallery-traditional {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center;
        justify-content: center;
    }

    .mw-search-results {
        max-width: inherit;
    }

    .mw-gallery-traditional > li,
    .mw-gallery-traditional > li > div,
    .mw-gallery-traditional .thumb {
        width: inherit !important;
    }

    .mw-gallery-traditional .thumb > div {
        margin: 0 !important;
    }

    .mw-gallery-traditional .gallerybox[type="image"] .gallerytext {
        display: none;
    }

    .mw-gallery-traditional .image img {
        width: calc(25vw - 5em) !important;
        height: inherit !important;
    }
`;

const styleTag = elementFromHtml(`<style id="nagfree-style">${style}</style>`);
const toggleButton = elementFromHtml(`<li><a toggle-style style="float:right;">Toggle style</a></li>`);
const buttonParent = $('#search .search-types ul');

function enlargeImages() {
    $$(".searchResultImage img").forEach((img) => {
        img.src = img.src.replace('120px', '300px');
        img.removeAttribute('width');
        img.removeAttribute('height');
    });
}

function toggleStyle() {
    if ($("#nagfree-style")) {
        $("#nagfree-style").remove();
    } else {
        $("body").append(styleTag);
    }
}

export default {
    host : 'commons.wikimedia.org',

    js() {
        if (!$(".mw-search-results")) {
            return;
        }

        enlargeImages();

        buttonParent.append(toggleButton);
        $("[toggle-style]").addEventListener('click', toggleStyle);

        toggleStyle();
    }
};