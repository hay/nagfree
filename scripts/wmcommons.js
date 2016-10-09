var style = `
    .searchResultImage td:nth-child(2),
    .mw-search-result-heading,
    .searchresult,
    .mw-search-result-data {
        display: none;
    }

    .mw-search-results {
        display: flex;
        flex-wrap: wrap;
    }
`;

$("body").append(`<style>${style}</style>`);