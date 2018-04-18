import { $ } from '../utils.js';

function getPageviewLink() {
    const url = window.location.href;
    const matches = url.match(/https?:\/\/(.*)\/wiki\/(.*)#?/);
    const project = matches[1];
    const pages = matches[2];

    return `https://tools.wmflabs.org/pageviews/?project=${project}&platform=all-access&agent=user&range=latest-20&pages=${pages}`;
}

export default {
    // Make sure we target only WMF MediaWiki sites
    query : 'meta[name="generator"][content^="MediaWiki"][content*="wmf"]',

    js() {
        // Add link to pageviews in toolbox
        const link = getPageviewLink();
        const list = $("#p-tb .body > ul");
        list.innerHTML += `<li><a href="${link}">Page statistics</a></li>`;
    }
};