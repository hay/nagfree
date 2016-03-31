(() => {
// Only show on threads
if (!$("body").is(".thread")) return;

var btn = $('<a style="cursor:pointer;">Sort by favorites</a>');
btn.click(function() {
    var posts = [];

    $("#posts .comments").each(function() {
        var $el = $(this);
        var favorites = 0;
        var $favorited = $el.find('a[href^="/favorited/"]');

        if ($favorited.length) {
            favorites = parseInt($favorited.text().split(' ')[0]);
        }

        posts.push({
            html : $el.prop('outerHTML'),
            favorites : favorites
        })
    });

    posts.sort((a,b) => a.favorites > b.favorites ? -1 : 1);

    $("#posts .copy").nextAll().remove();

    var html = posts.map((p) => `<br><br>${p.html}<br>`).join('');
    $("#posts").append(html);
});

$("#posts .copy").eq(0).find('.smallcopy').append(btn);
})();