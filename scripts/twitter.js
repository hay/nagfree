// @description Hide retweets, 'liked by', promoted tweets and other crap

import { $, $$, Storage } from '../utils.js';
import Vue from '../node_modules/vue/dist/vue.esm.browser.js';

const storage = new Storage({
    favs : false,
    retweets : false
});

export default {
    host : 'twitter.com',

    css : `
        .has-recap,
        .js-activity-generic,
        .wtf-module,
        .promoted-tweet,
        body.no-likedby [data-is-likedby],
        body.no-retweets [data-is-retweet] {
            display: none !important;
        }
    `,

    js() {
        function addTypes() {
            function add() {
                // Tag 'liked by'
                $$(".Icon--heartBadge").forEach((el) => {
                    el.parentNode.parentNode.parentNode.parentNode.setAttribute('data-is-likedby', '');
                });

                // Tag retweets
                $$("[data-retweet-id]").forEach((el) => {
                    el.parentNode.setAttribute('data-is-retweet', '');
                })
            }

            setInterval(add, 2000);
            add();
        }

        function addButtons() {
            const body = $("body");

            alert('addbUt');

            $("#global-actions").innerHTML += `
                <li>
                    <a>
                        <span class="text">
                            <label v-on:click="toggle('retweets')">
                                <input type="checkbox"
                                       v-model="retweets" />
                                No retweets
                            </label>

                            <label v-on:click="toggle('favs')">
                                <input type="checkbox"
                                       v-model="favs" />
                                No favs
                            </label>
                    </a>
                </li>
            `;

            new Vue({
                el : "#global-actions",

                methods : {
                    toggle(key) {
                        this[key] = !this[key];
                        storage.set(key, this[key]);
                        alert('toggle');
                    }
                },

                watch : {
                    favs(bool) {
                        body.classList.toggle('no-favs', bool);
                    },

                    retweets(bool) {
                        body.classList.toggle('no-retweets', bool);
                    }
                },

                data: {
                    retweets : storage.get('retweets'),
                    favs : storage.get('favs')
                }
            });
        }

        // addTypes();
        // addButtons();
    }
}