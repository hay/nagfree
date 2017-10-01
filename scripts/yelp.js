// Remove sponsored content
$("body").append(`<style>
    [data-ad-placement],
    .related-search-links,
    .talk-list-container {
        display: none;
    }
</style>`);