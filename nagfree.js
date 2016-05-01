console.log('jQuery', window.jQuery);

if (!('jQuery' in window)) {
    throw new Error('[nagfree] jQuery could not be loaded...');
}

window.nagfree = (() => {
    const DEBUG = window.location.href.indexOf('debug') !== -1;

    function log(msg) {
        if (DEBUG) {
            if (typeof msg === 'object') {
                msg = JSON.stringify(msg, null, 4);
            }

            console.log(`[nagfree] ${msg}`);
        }
    }

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

    return { onDomChange, waitForSelector, log };
})();