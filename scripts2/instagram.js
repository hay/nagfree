import { $$, waitFor } from '../utils.js';

export default {
    host : 'instagram.com',

    js : {
        runOnUrlChange : true,

        run() {
            // Remove div to allow right-clicking on images
            // Because class names change, we need to do something a bit weird

            $$("img").forEach((img) => {
                if (img.hasAttribute('srcset')) {
                    // This is pretty horrible
                    function check() {
                        return img.parentNode.parentNode.children.length === 2;
                    }

                    waitFor(check, 200).then(() => {
                        img.parentNode.parentNode.children[1].remove();
                    });
                }
            });
        }
    }
}