import { $, $$ } from '../utils.js';

export default {
    query : '#tvcap, #bottomads',

    css : `
        body.hidecruft #tvcap,
        body.hidecruft .cu-container,
        body.hidecruft #bottomads {
            display: none;
        }

        [toggleCruft] {
            text-decoration: underline !important;
            cursor: pointer;
        }
    `,

    js() {
        $("body").classList.add('hidecruft');

        $("#resultStats").innerHTML += '| <a toggleCruft>Toggle cruft</a>';

        $('[toggleCruft]').addEventListener('click', () => {
            $("body").classList.toggle('hidecruft');
        });
    }
}