window.nagfree = (() => {
    var log = console.log.bind(console);
    log('nagfree active');
    log('jQuery version: ', $.fn.jquery);

    function onDomChange(selector, callback) {
        var el = document.querySelector(selector);
        log(`onDomChange for ${el}`);

        var observer = new MutationObserver((mut, obs) => {
            if (mut[0].addedNodes.length || mut[0].removedNodes.length) {
                log('onDomChange: callback');
                callback();
            }
        });

        observer.observe(el, {
            childList : true,
            subtree : true
        });
    }

    function waitForSelector(selector) {
        var times = 5;
        log('waitForSelector: ' + selector);

        return new Promise(function(resolve, reject) {
            function check() {
                if (!!document.querySelector(selector)) {
                    resolve();
                } else {
                    times--;

                    if (times > 0) {
                        setTimeout(check, 300);
                    }
                }
            }

            check();
        });
    }

    return { onDomChange, waitForSelector };
})();