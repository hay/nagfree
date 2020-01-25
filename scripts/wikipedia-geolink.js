// @description Directly link the coordinates in articles to Google Maps instead of the geohack tool
import { $ } from '../utils.js';

export default {
    host : 'wikipedia.org',

    js() {
        const coord = $("#coordinates");

        if (!coord) return;

        let coordDec = coord.querySelector('.geo-nondefault .geo').innerText;
        coordDec = coordDec.replace('; ',',');
        const link = coord.querySelector('a.external');

        link.href = `https://www.google.com/maps/?q=${coordDec}`;
        link.target = '_blank';
    }
};