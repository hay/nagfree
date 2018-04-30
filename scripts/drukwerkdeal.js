import { $, $$, waitFor } from '../utils.js';

function addPricePerPiece() {
    $$(".js-price-table [data-count]").forEach((row) => {
        const count = parseInt(row.dataset.count);
        Array.from(row.querySelectorAll('.PriceTable__Cell--HasPrice')).forEach((cell) => {
            let price = cell.querySelector('.PriceTable__Price').innerText;
            price = price.replace('€ ', '').replace(',', '.');
            price = parseFloat(price);

            let pricePerPiece = (price / count).toFixed(2).replace('.', ',');

            cell.querySelector(".text-dimmed").innerText += ` / € ${pricePerPiece} per stuk`;
        });
    });
}

export default {
    host : 'drukwerkdeal.nl',

    js : {
        run() {
            if (!$("#js-price-table")) {
                return;
            }

            function hasPriceTable() {
                return !!$(".js-price-table");
            }

            waitFor(hasPriceTable, 1000, 200).then(addPricePerPiece);
        }
    }
};