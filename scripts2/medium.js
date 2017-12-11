function run() {
    document.querySelector(".metabar").classList.remove('u-fixed');
}

// Remove nonsense
export default {
    query : 'meta[name="twitter:app:name:iphone"][content="Medium"]',

    css : `
        .js-stickyFooter,
        .metabar--spacer,
        .js-postShareWidget {
            display: none;
        }

        .metabar {
            position: relative !important;
        }
    `,

    js : run
};