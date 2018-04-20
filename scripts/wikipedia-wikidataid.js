import { $ } from '../utils.js';

export default {
    // Make sure we target only WMF MediaWiki sites
    query : 'meta[name="generator"][content^="MediaWiki"][content*="wmf"]',

    css : `
        .nf-wikibase-link {
            font-size: 14px;
        }
    `,

    js() {
        // Add Wikidata ID to title
        const itemId = mw.config.get('wgWikibaseItemId');

        if (!itemId) return;

        $("#firstHeading").innerHTML += `
            <sup class="nf-wikibase-link">
                <a href="https://www.wikidata.org/wiki/Special:EntityPage/${itemId}">
                    ${itemId}
                </a>
            </sup>
        `;
    }
};