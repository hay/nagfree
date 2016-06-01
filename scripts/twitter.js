const PROMOTED_SELECTOR = '.Icon--promoted';

function removePromoted() {
    console.log('Removing promoted tweets');

    $(PROMOTED_SELECTOR).each(function() {
        $(this).parents(".stream-item").remove();
    });
}

nagfree.waitForSelector(PROMOTED_SELECTOR).then(removePromoted);

nagfree.onDomChange('.stream-items', () => {
    nagfree.waitForSelector(PROMOTED_SELECTOR).then(removePromoted);
});