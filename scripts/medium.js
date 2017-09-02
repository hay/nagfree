// Remove nonsense
$("body").append(`<style>
    .js-stickyFooter,
    .metabar--spacer,
    .js-postShareWidget {
        display: none;
    }

    .metabar {
        position: relative !important;
    }
</style>`);