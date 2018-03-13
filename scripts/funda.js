import { $, $$, elementFromHtml } from '../utils.js';

const priceSelector = ".object-header__price";
const $price = $(priceSelector);
const searchSelector = ".search-result-content";

function nr(str) {
    return parseFloat(str.match(/\d/g).join(''));
}

function getPricePerSqm(size, price) {
    const pricePerSqm = Math.round(price / size).toLocaleString().replace(',', '.');
    return `€${pricePerSqm} p/m²`;
}

function page() {
    let size = 0;

    $$(".object-kenmerken-group-list dt").forEach((dt) => {
        if (dt.textContent === 'Woonoppervlakte') {
            size = nr(dt.nextElementSibling.textContent);
            return;
        }
    });

    const price = nr($price.textContent);

    $price.innerHTML += ` / ${size}m² / ${getPricePerSqm(size, price)}`;
}

function search() {
    $$(searchSelector).forEach(($s) => {
        const size = nr($s.querySelector('[title="Woonoppervlakte"]').textContent);
        const price = nr($s.querySelector('.search-result-price').textContent);
        const rooms = nr($s.querySelector('.search-result-kenmerken li:last-child').textContent);
        const zip = nr($s.querySelector(".search-result-subtitle").textContent);
        const $street = $s.querySelector(".search-result-title");
        const street = $street.textContent.trim().replace(/\n|\t| {2,}/g, '').trim();
        const id = $s.querySelector("a[data-search-result-item-anchor]").getAttribute('data-search-result-item-anchor').trim();
        const searchLine = (`${id} - ${street} - size ${size} price ${price} rooms ${rooms} zip ${zip}`);

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
            if ($price) {
                page();
            }

            if ($(searchSelector)) {
                search();
            }
        }
    }
};