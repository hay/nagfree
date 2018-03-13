import { $, tryFor } from '../utils.js';

// data-ajax-url

export default {
    host : 'volkskrant.nl',

    js() {
        let article = $(".article__content");

        if (!article) {
            return;
        }

        const articleMeta = $(".article__meta--v2")
        articleMeta.innerHTML += '- <span count-words></span>'

        function countWords() {
            let article = $(".article__content");

            const text = article.textContent
                .split(/\n/)
                .map((l) => l.trim())
                .filter((l) => l !== '')
                .join('. ');

            const words = text
                .split(/(\b[^\s]+\b)/)
                .map((w) => w.trim())
                .filter((w) => ['', '.', "'", ','].indexOf(w) === -1);

            articleMeta.querySelector('[count-words]').innerHTML = `${words.length} woorden`;
        }

        // Okay, first check if this is a paid article by looking if it has an
        // AMP tag
        const isFree = !!$('link[rel="amphtml"]');

        if (isFree) {
            // Not a paid article, just get count words now
            countWords();
        } else {
            // We do something pretty ugly here, just count the words in the
            // article every second for 10 times
            tryFor(10, 1000, countWords);
        }
    }
};