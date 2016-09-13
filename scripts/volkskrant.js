function getLink(e) {
    var regex = /\&url=(.*)\&?/;
    var tweet = $(".share-bar__item--twitter a").attr('href');
    var link = regex.exec(tweet);
    var url = decodeURIComponent(link[1]);

    $(".tweetlink").html(`
        <li class="share-bar__item"><input style="font-family:monospace;" value="${url}"></li>
    `);

    $(".tweetlink input").get(0).select();

    if (document.execCommand('copy')) {
        $(".tweetlink").html('Link copied');
    }
}

$(".share-bar__list").append(`
    <div class="share-bar__item tweetlink"><button>Get URL</button></div>
`);

$(".share-bar__list").on('click', '.tweetlink', getLink);