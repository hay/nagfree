import { $ } from '../utils.js';

export default {
    host : 'beeldbank.amsterdam.nl',

    js() {
        const img = $("#topview_container .hoofdafbeelding img");

        if (img) {
            const container = $("#topview_container");
            container.style.width = 'inherit';
            container.style.height = 'inherit';

            const src = img.getAttribute('src').replace('250x250', '500x500');
            img.setAttribute('src', src);
        }
    }
}