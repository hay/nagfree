window.nagfree = (() => {
    var log = console.log.bind(console);
    log('nagfree active');
    log('jQuery version: ', $.fn.jquery);

    function onDomChange(selector, callback) {
        log(`Trying to register onDomChange handler for ${selector}`);
        var el = document.querySelector(selector);

        if (!el) {
            log(`${el} is not a domNode`);
        }

        log(`onDomChange registered for ${el}`);

        function handleMutation(mut, obs) {
            if (mut[0].addedNodes.length || mut[0].removedNodes.length) {
                log('onDomChange: callback');
                callback();
            }
        };

        var observer = new MutationObserver(_.debounce(handleMutation, 1000));

        observer.observe(el, {
            childList : true,
            subtree : false
        });
    }

    function waitForSelector(selector) {
        var times = 5;
        log('waitForSelector: ' + selector);

        return new Promise(function(resolve, reject) {
            function check() {
                log(`checking for ${selector}`);

                if (!!document.querySelector(selector)) {
                    log(`found it!`);
                    resolve();
                } else {
                    times--;

                    if (times > 0) {
                        log(`checking ${times} more`);
                        setTimeout(check, 300);
                    } else {
                        log(`didn't find the selector :(`);
                    }
                }
            }

            check();
        });
    }

    return { onDomChange, waitForSelector };
})();