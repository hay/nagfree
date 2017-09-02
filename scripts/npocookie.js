// Remove cookie nonsense
$("body").append(`<style>
    #npo_cc_notification,
    .navigation-overlay-npo-button {
        display: none;
    }

    body {
        margin-top: 0 !important;
    }
</style>`);