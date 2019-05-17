import { $, countWords, elementFromHtml, numberWithCommas } from '../utils.js';

const article = $("#main-content");
const WORDS_PER_MINUTE = 350;

export default {
    host : 'volkskrant.nl',

    js() {
        const words = countWords(article.textContent);
        const minutes = Math.round(words / WORDS_PER_MINUTE);
        const count = elementFromHtml(`<span style="margin-left: 4px;">
            ${numberWithCommas(words)} woorden | Leestijd ${minutes} minuten</em>
        </span>`);

        const byline = $('[data-element-id="article-element-authors"]');

        if (byline) {
            byline.append(count);
        }
    }
}