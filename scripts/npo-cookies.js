// @description Automatically deny all tracking and social media NPO cookies

const DENY_COOKIES = ['social', 'advertising'];

import { $$ } from '../utils.js';

export default {
    query : '#ccm_notification_wrapper',

    js() {
        // First get all the false checkmarks
        $$('.ccm_col_content_cookieitem-radio > input[value="false"]').forEach((input) => {
            const id = input.getAttribute('name');

            if (DENY_COOKIES.includes(id)) {
                input.parentElement.click();
            }
        });

        $$("#ccm_col_content_footer > .ccm_btn").forEach(btn => btn.click());
    }
}