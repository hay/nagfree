// @description Add reading time / wordcount

import { $, countWords, elementFromHtml, numberWithCommas } from '../utils.js';

const article = $('[data-attribute-verso-pattern="article-body"]');
const author = $('[itemprop="author"]');
const WORDS_PER_MINUTE = 350;

export default {
    host : 'newyorker.com',

    js() {
        const words = countWords(article.textContent);
        const minutes = Math.round(words / WORDS_PER_MINUTE);
        const count = elementFromHtml(`<p>
            <em>${numberWithCommas(words)} words, ${minutes} minutes to read</em>
        </p>`);

        author.prepend(count);
    }
}