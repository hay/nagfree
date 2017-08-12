var img = $("#topview_container .hoofdafbeelding img");

if (img.length) {
    $("#topview_container").css({
        width : 'inherit',
        height : 'inherit'
    });

    var src = img.attr('src').replace('250x250', '500x500');
    img.attr('src', src);
}