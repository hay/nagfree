function downloadAlbum() {
    var photos = $(".uiMediaThumbMedium").map((index, el) => {
        var href = $(el).attr('href');

        if (typeof href === 'string') {
            return href.match(/fbid=(\d+)/)[1];
        } else {
            return null;
        }
    }).get().map((id) => {
        return `curl -L "https://www.facebook.com/photo/download/?fbid=${id}" > ${id}.jpg`;
    }).join('\n');

    $(".fbPhotoAlbumHeaderText").html(`<textarea style="width:100%;height:200px;">${photos}</textarea>`);

    console.log(photos);
}

// Add a button that gives a list of curl commands to download all photos in an album
nagfree.waitForSelector('.uiMediaThumb').then(() => {
    $(".fbPhotoAlbumActions").on('click', '.nagfree-download', downloadAlbum);
    $(".fbPhotoAlbumActions").append('<button class="nagfree-download">Download album</button>');
});