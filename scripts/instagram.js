// Remove div to allow right-clicking on images
// Because class names change, we need to do something a bit weird
setTimeout(() => {
    let img = false;
    let imgwidth = 0;

    $("img").each((index, el) => {
        let width = $(el).width();

        if (width > imgwidth) {
            img = el;
            imgwidth = width;
        }
    });

    $(img).parent().parent().find("div").eq(1).remove();
}, 2000);