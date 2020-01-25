// @description Remove paywall / anti adblock thing

export default {
    host : 'wired.com',

    css : `
        .paywall-container-component {
            display: none !important;
        }

        .header {
            position: relative !important;
        }
    `
}