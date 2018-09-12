import { $, $$ } from '../utils.js';

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

        .ui-alluser-layer-dialog,
        .ui-mask {
            display: none !important;
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

        addMinimalRatings();
    }
}