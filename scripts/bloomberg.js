// @description Remove paywall banner

export default {
    host : 'bloomberg.com',
    css : `
        #paywall-banner {
            display:none;
        }

        #navi {
            position: inherit;
        }
    `
}