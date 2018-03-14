import { $, $$ } from '../utils.js';

export default {
    host : 'twitter.com',

    css : `
        .has-recap,
        .js-activity-generic,
        .wtf-module,
        .promoted-tweet {
            display: none !important;
        }

        body.nocruft [data-is-likedby],
        body.nocruft [data-is-retweet] {
            display: none !important;
        }

        [data-toggle-nocruft] {
            cursor: pointer;
        }
    `,

    js() {
        function addTypes() {
            // Tag 'liked by'
            $$(".Icon--heartBadge").forEach((el) => {
                el.parentNode.parentNode.parentNode.parentNode.setAttribute('data-is-likedby', '');
            });

            // Tag retweets
            $$("[data-retweet-id]").forEach((el) => {
                el.parentNode.setAttribute('data-is-retweet', '');
            })
        }

        setInterval(addTypes, 2000);

        addTypes();

        $("#global-actions").innerHTML += `
            <li>
                <a data-toggle-nocruft>
                    <span class="text">No RT / Favs</span>
                </a>
            </li>
        `;

        $("[data-toggle-nocruft]").addEventListener('click', () => {
            $("body").classList.toggle('nocruft');
        });

        $("body").classList.add('nocruft');
    }
}