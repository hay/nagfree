import { $, $$, elementFromHtml } from '../utils.js';

const $page = $(".object-detail");
const $search = $$(".search-result-content");

function nr(str) {
    return parseFloat(str.match(/\d/g).join(''));
}

function getPricePerSqm(size, price) {
    const pricePerSqm = Math.round(price / size).toLocaleString().replace(',', '.');
    return `€${pricePerSqm} p/m²`;
}

function page() {
    let size = 0;

    $$(".kenmerken-highlighted__term").forEach((term) => {
        if (term.textContent === 'Wonen') {
            size = nr(term.nextElementSibling.textContent);
            return;
        }
    });

    const $price = $(".object-header__price");
    const price = nr($price.textContent);

    if (!$price.querySelector('[data-price-per-sqm]')) {
        $price.innerHTML += `<span data-price-per-sqm> / ${size}m² / ${getPricePerSqm(size, price)}</span>`;
    }
}

function search() {
    $search.forEach(($s) => {
        const size = nr($s.querySelector('[title="Gebruiksoppervlakte wonen"]').textContent);
        const price = nr($s.querySelector('.search-result-price').textContent);
        const priceEl = elementFromHtml(`<li><span>${getPricePerSqm(size, price)}</span></li>`);
        $s.querySelector('.search-result-kenmerken').append(priceEl);
    });
}

export default {
    host : 'funda.nl',

    css : `
        .top-position,
        .makelaar-ads,
        .related-search {
            display: none;
        }
    `,

    js : {
        runOnUrlChange : true,

        run() {
            if (!!$page) {
                page();
            }

            if (!!$search) {
                search();
            }
        }
    }
};