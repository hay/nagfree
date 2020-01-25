// @description Add option to see times with movie listings

import { $, $$ } from '../utils.js';

export default {
    disabled : true,

    host : 'filmladder.nl',

    css : `
        .margin, .banner {
            display: none;
        }

        .ladder {
            max-width: 100%;
        }

        .sheet {
            display: flex;
            flex-wrap: wrap;
        }

        .sheet > div.collapsed {
            display: block;
            width: 140px;
            height: 240px;
            overflow: hidden;
            margin: 10px;
        }

        .sheet > div.collapsed .hall-container {
            display: none;
        }

        [collapse-times] {
            cursor: pointer;
            text-transform: uppercase;
            text-decoration: underline;
        }
    `,

    js() {
        const $movies = $$(".city-movie");

        function collapse(el) {
            el.classList.add('collapsed');
            el.querySelector('.info h3').innerHTML += '<span collapse-times>tijden</span>';
            el.querySelector('[collapse-times]').addEventListener('click', () => {
                el.classList.toggle('collapsed');
            });
        }

        if ($movies.length) {
            $movies.forEach(collapse);
        }
    }
};