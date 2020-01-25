// @description Add more sane numbers

import { $$ } from '../utils.js';

export default {
    host : 'oddschecker.com',

    js() {
        $$(".match-on").forEach((el) => {
            const cells = el.querySelectorAll("[data-best-odds]");
            let total = 0;

            cells.forEach((cell) => {
                total += parseFloat(cell.getAttribute('data-best-odds'));
            });

            cells.forEach((cell) => {
                const odds = parseFloat(cell.getAttribute('data-best-odds'));
                const percentage = ((1 / odds) * 100).toFixed(2);
                cell.querySelector(".odds").innerText = `(${odds} / ${percentage}%)`;
            });
        });
    }
};