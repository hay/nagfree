// @description Remove nonsense
export default {
    query : 'meta[name="twitter:app:name:iphone"][content="Medium"]',

    css : `
        .js-stickyFooter,
        .metabar--spacer,
        .postActionsBar,
        .js-postShareWidget {
            display: none;
        }

        .metabar {
            position: relative !important;
        }
    `,

    js() {
        document.querySelector(".metabar").classList.remove('u-fixed');
    }
};