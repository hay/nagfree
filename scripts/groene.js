// @description Add word count / reading time

import { $, countWords, elementFromHtml, numberWithCommas } from '../utils.js';

const article = $("section.article-container");
const WORDS_PER_MINUTE = 350;

export default {
    host : 'groene.nl',

    js() {
        const words = countWords(article.textContent);
        const minutes = Math.round(words / WORDS_PER_MINUTE);
        const count = elementFromHtml(`<p>
            <em>${numberWithCommas(words)} woorden, leestijd ${minutes} minuten</em>
        </p>`);
        article.prepend(count);
    }
}