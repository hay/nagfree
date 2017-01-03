var style = `
    .margin, .banner {
        display: none;
    }

    .ladder {
        max-width: 100%;
    }

    .sheet {
        display: flex;
        flex-wrap: wrap;
    }

    .sheet > div.collapsed {
        display: block;
        width: 140px;
        height: 240px;
        overflow: hidden;
    }
`;

const $movies = $(".city-movie");

function collapse(index, el) {
    const $el = $(el);
    $el.addClass('collapsed');

    $el.on('click', '[collapse-times]', () => $el.toggleClass('collapsed'));
    $el.find(".info h3").append('<button collapse-times>🕒</button>');
}

if ($movies.length) {
    $movies.each(collapse);
    $("body").append(`<style>${style}</style>`);
}