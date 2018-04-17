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

    css : `
        .nf-wikibase-link {
            font-size: 14px;
        }
    `,

    js() {
        // Add link to pageviews in toolbox
        const link = getPageviewLink();
        const list = document.querySelector("#p-tb .body > ul");
        list.innerHTML += `<li><a href="${link}">Page statistics</a></li>`;

        // Add Wikidata ID to title
        const itemId = mw.config.get('wgWikibaseItemId');
        $("#firstHeading").innerHTML += `
            <sup class="nf-wikibase-link">
                <a href="https://www.wikidata.org/wiki/Special:EntityPage/${itemId}">
                    ${itemId}
                </a>
            </sup>
        `;
    }
};