const style = `
    .searchResultImage td:nth-child(2),
    .mw-search-result-heading,
    .searchresult,
    .mw-search-result-data {
        display: none;
    }

    .mw-search-results,
    .mw-gallery-traditional {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center;
        justify-content: center;
    }

    .mw-gallery-traditional > li,
    .mw-gallery-traditional > li > div,
    .mw-gallery-traditional .thumb {
        width: inherit !important;
    }

    .mw-gallery-traditional .thumb > div {
        margin: 0 !important;
    }

    .mw-gallery-traditional .gallerybox[type="image"] .gallerytext {
        display: none;
    }

    .mw-gallery-traditional .image img {
        width: calc(25vw - 5em) !important;
        height: inherit !important;
    }
`;

// Make sure non-image files are still clickable
$(".gallery .thumb img").parents(".gallerybox").attr('type', 'image');

$("body").append(`<style>${style}</style>`);