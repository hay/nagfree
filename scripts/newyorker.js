import { $, countWords, elementFromHtml, numberWithCommas } from '../utils.js';

const article = $("#articleBody");

export default {
    host : 'newyorker.com',

    js() {
        const words = numberWithCommas(countWords(article.textContent));
        const count = elementFromHtml(`<p><em>${words} words</em></p>`);
        article.prepend(count);
    }
}