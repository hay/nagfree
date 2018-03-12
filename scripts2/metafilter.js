import { $, $$ } from '../utils.js';

export default {
    host : 'ask.metafilter.com',

    js() {
        function addSortByFavorites() {
            const btn = ' - <a sort-by-favorites style="cursor:pointer;">Sort by favorites</a>';
            $("#posts .copy .smallcopy").innerHTML += btn;

            $("[sort-by-favorites]").addEventListener('click', () => {
                const posts = [];

                $$("#posts .comments").forEach((el) => {
                    let favorites = 0;
                    const favorited = el.querySelector('a[href*="/favorited/"]');

                    if (favorited) {
                        favorites = parseInt(favorited.innerText.split(' ')[0]);
                    }

                    posts.push({
                        html : el.outerHTML,
                        favorites
                    })
                });

                posts.sort((a,b) => a.favorites > b.favorites ? -1 : 1);

                $$("#posts .copy ~ *").forEach(e => e.remove());

                const html = posts.map((p) => `<br><br>${p.html}<br>`).join('');
                $("#posts").innerHTML += html;
            });
        }

        // Only show on threads
        if (!!$("body.thread")) {
            addSortByFavorites();
        }
    }
};