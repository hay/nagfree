// @description Add an option to filter by a minimum amount of ratings

import { $, $$, waitForSelector } from '../utils.js';

const ratingInput = document.createElement('div');
ratingInput.innerHTML = `
    <input id="minimalratings" placeholder="Minimal ratings" />
    <button id="minimalratings-go">Go</button>
`;

export default {
    host : 'aliexpress.com',

    css : `
        #minimalratings {
            height: 30px;
            margin-left: 30px;
        }
    `,

    js() {
        function addMinimalRatings() {
            const $viewFilter = $("#view-filter");

            if (!$viewFilter) return;

            $viewFilter.appendChild(ratingInput);

            $("#minimalratings-go").addEventListener('click', () => {
                let minimalratings = parseInt($("#minimalratings").value);

                if (!minimalratings) {
                    let minimalratings = 0;
                }

                $$(".list-item").forEach((item) => {
                    let ratings = item.querySelector('.rate-num');

                    if (!ratings) {
                        return;
                    }

                    ratings = ratings.innerText.match(/\d+/);

                    if (ratings.length && ratings[0] < minimalratings) {
                        item.style.opacity = 0.1;
                    } else {
                        item.style.opacity = 1;
                    }
                });
            });
        }

        function addPricesWithShipping() {
            function nr(str) {
                return Number(str.match(/\d|,|\./g).join('').replace(',', '.'));
            }

            $$('.product-card').forEach((card) => {
                let price = card.querySelector('.price-current').textContent;
                let shipping = card.querySelector('.shipping-value').textContent;
                let total = (nr(price) + nr(shipping)).toFixed(2);
                let label = `<span> (total: €${total})</span>`;
                let el = card.querySelector('.item-price-row');

                if (el) {
                    el.innerHTML += label;
                }
            });
        }

        addMinimalRatings();

        waitForSelector('.product-card', 1000).then(() => {
            addPricesWithShipping();
        });
    }
}