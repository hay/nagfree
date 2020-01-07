// Remove anti-adblocker messages
import { $$ } from '../utils.js';

export default {
    host : 'nytimes.com',

    js() {
        // No obvious ways to hide the anti-adblocker stuff, so we need to do
        // something quirky
        $$('a[href*="allow-ads-on-nytimes-com"]').forEach((el) => {
            el.parentElement.style.display = 'none';
        });
    },

    css : `
        .adblock_sub,
        .gdpr,
        .recipe-page #appContainer,
        #ribbon,
        .expanded-dock,
        .meter_default {
            display: none !important;
        }
    `
}
