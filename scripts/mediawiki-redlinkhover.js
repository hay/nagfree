import { $, $$ } from '../utils.js';

const WD_ENDPOINT = 'https://www.wikidata.org/w/api.php?';
const SERVER = mw.config.get('wgServer');
const SITE_ENDPOINT = `https:${SERVER}/w/api.php?`;
const LANG = 'en';
const LANGUAGES = ['en', 'de', 'fr', 'es', 'nl'];

function cardHtml(props) {
    return `
        <div class="mwe-popups mwe-popups-type-page mwe-popups-fade-in-up mwe-popups-no-image-pointer mwe-popups-is-not-tall"
             role="tooltip"
             data-redlinkhover
             style="left: ${props.left}px; top: ${props.top}px; display: block; position: absolute;"
             aria-hidden="">
            <div class="mwe-popups-container">
                <div class="mwe-popups-extract">
                    ${props.html}
                </div>
            </div>
        </div>"
    `
}

function showPopup(props) {
    if (hasPopup()) {
        removePopup();
    }

    const html = cardHtml(props);
    const el = document.createElement('div');
    el.innerHTML = html;
    $("body").appendChild(el);
}

function buildUrl(url, params) {
    let query = [];

    for (let key in params) {
        let val = encodeURIComponent(params[key]);
        query.push(`${key}=${val}`);
    }

    return `${url}${query.join('&')}`;
}

async function getJson(url) {
    const req = await fetch(url);
    const data = await req.json();
    return data;
}

async function getBabelForUser(user) {
    const url = buildUrl(SITE_ENDPOINT, {
        action : 'query',
        format : 'json',
        origin : '*',
        meta : 'babel',
        babuser : 'Husky'
    });
}

function getSearchUrl(q) {
    return buildUrl(WD_ENDPOINT, {
        'action' : 'query',
        'list' : 'search',
        'srsearch' : q,
        'srlimit' : 1,
        'srnamespace' : 0,
        'format' : 'json',
        'origin' : '*'
    });
}

function hasPopup() {
    return !!$('[data-redlinkhover]');
}

function removePopup() {
    $$("[data-redlinkhover]").forEach(card => card.remove());
}

function parseItem(item) {
    const data = {}

    for (let lang in item.labels) {
        const label = item.labels[lang];

        data[lang] = {
            label : label.value
        };
    }

    for (let lang in item.descriptions) {
        const description = item.descriptions[lang];

        if (lang in data) {
            data[lang].description = description.value;
        } else {
            data[lang] = { description : description.value };
        }
    }

    for (let wiki in item.sitelinks) {
        const sitelink = item.sitelinks[wiki];
        const wikilang = wiki.replace('wiki', '');

        if (wikilang in data) {
            const href = `https://${wikilang}.wikipedia.org/wiki/${sitelink.title}`;
            data[wikilang].sitelink = href;
        }
    }

    return data;
}

function createHtml(item) {
    let html = '';

    for (let lang in item) {
        let props = item[lang];
        html += `<li><em>${lang}</em> `;

        if (props.sitelink) {
            html += `<a href="${props.sitelink}">${props.label}</a>`;
        } else {
            html += `<b>${props.label}</b>`;
        }

        if (props.description) {
            html += props.description;
        }

        html += `</li>`;
    }

    return html;
}

async function lookup(qid) {
    const url = buildUrl(WD_ENDPOINT, {
        'action' : 'wbgetentities',
        'format' : 'json',
        'props'  : 'descriptions|labels|sitelinks',
        'ids' : qid,
        'languages' : LANGUAGES.join('|'),
        'origin' : '*'
    });

    const data = await getJson(url);
    const item = data.entities[qid];
    const parsedItem = parseItem(item);
    const html = createHtml(parsedItem);

    return html;
}

async function search(q) {
    const url = getSearchUrl(q);
    const data = await getJson(url);

    if (!!data.query.search.length) {
        return data.query.search[0].title;
    } else {
        return false;
    }
}

function main() {
    console.log('mediawiki-redlinkhover.js');

    $$(".new").forEach((a) => {
        a.addEventListener('mouseenter', async (e) => {
            // Lose title attribute
            a.removeAttribute('title');

            const title = a.innerText;
            const qid = await search(title);
            const popup = {
                left : e.pageX,
                top : e.pageY + 20,
                lang : LANG
            }

            if (qid) {
                const html = await lookup(qid);
                popup.html = html;
            } else {
                popup.html = `<b>No search results</b>`;
            }

            showPopup(popup);
        });

        a.addEventListener('mouseout', () => {
            removePopup();
        });
    });
}

export default {
    // Make sure we target only WMF MediaWiki sites
    query : 'meta[name="generator"][content^="MediaWiki"][content*="wmf"]',

    js() {
        main();
    }
};