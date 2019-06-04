export default {
    host : 'wikidata.org',

    disabled : true,

    js() {
        const $ = window.jQuery;
        const mw = window.mediaWiki;
        const USER_LANGUAGE = mw.config.get('wgUserLanguage');

        function getQueryModelItems(qid, language = 'en') {
            return `
                select ?item ?itemLabel ?itemDescription where {
                  wd:${qid} wdt:P5869 ?item.
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],${language}". }
                }
            `;
        }

        function getQueryPopularItems(qid, language = 'en') {
            return `
                select ?item ?itemLabel ?itemDescription ?linkCount with {
                  select ?item where {
                    ?item wdt:P31 wd:${qid}.
                  } limit 100
                } as %result where {
                  include %result
                  ?item wikibase:sitelinks ?linkCount.
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],${language}". }
                } order by desc(?linkCount) limit 3
            `;
        }

        async function query(query) {
            query = encodeURIComponent(query.trim());
            const endpoint = `https://query.wikidata.org/sparql?query=${query}&format=json`;
            const req = await fetch(endpoint);
            const data = await req.json();
            return data.results.bindings;
        }

        function addButtons($el) {
            $el.find(".wikibase-statementview").each((index, el) => {
                const qid = $(el).find(".wikibase-snakview-value a").attr('title');
                let button = `<a href="${qid}">◫ Lookup model item</a>`;
                button = `<div data-lookup-modelitem="${qid}" class="wikibase-statementview-references-container">${button}</div>`;
                $(el).find(".wikibase-statementview-references-heading").prepend(button);
                $(el).on('click', '[data-lookup-modelitem]', (e) => {
                    e.preventDefault();
                    lookupModelItem(e.currentTarget);
                });
            });
        }

        function displayModelItems(el, message, results) {
            let list = '';

            results.forEach((result) => {
                list += `
                <li>
                    <a href="${result.item.value}">
                        ${result.itemLabel.value ? result.itemLabel.value : ''}
                    </a>

                    <p>${result.itemDescription ? result.itemDescription.value : ''}</p>
                </li>
                `
            });

            list = `<p>${message}</p><ul>${list}</ul>`;

            el.innerHTML = list;
        }

        async function lookupModelItem(el) {
            const qid = el.dataset.lookupModelitem;
            delete el.dataset.lookupModelitem;
            el.innerHTML = 'One moment...';
            let results = await query(getQueryModelItems(qid));

            if (results.length) {
                displayModelItems(el, `${results.length} model items found:`, results);
            } else {
                el.innerHTML = 'No model items found. Fetching likely candidates...';
                results = await query(getQueryPopularItems(qid));

                if (results.length) {
                    displayModelItems(el, 'No model items found. Here are likely candidates:', results);
                } else {
                    el.innerHTML = "No likely candidates or model items found.";
                }
            }
        }

        function main() {
            // Only add the button on items with a P31 item
            const $el = $('[data-property-id="P31"]');

            if ($el.length) {
                addButtons($el);
            }
        }

        mw.hook('wikibase.entityPage.entityView.rendered').add(main);
    }
};