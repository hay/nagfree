// The voodoo bootstrap to import the actual extension code
const extension = document.querySelector('[nagfree-extension]');
const $ = document.querySelector.bind(document);
const URL_CHANGE_TIMEOUT = 300;
const WAIT_FOR_SELECTOR_TIMEOUT = 300;

function onUrlChange(callback) {
    // This is pretty horrible
    let oldUrl = window.location.href;

    function check() {
        let newUrl = window.location.href;

        if (newUrl !== oldUrl) {
            callback();
            oldUrl = newUrl;
        }

        window.requestIdleCallback(check, { timeout : URL_CHANGE_TIMEOUT });
    }

    check();
}

function waitForSelector(selector) {
    let tries = 10;

    return new Promise((resolve, reject) => {
        function check() {
            if (!!$(selector) || tries === 0) {
                resolve();
            } else {
                tries--;
                window.requestIdleCallback(check, { timeout : WAIT_FOR_SELECTOR_TIMEOUT });
            }
        }

        check();
    });
}

function runJs(js) {
    // If we have a function, run immediately, otherwise look at the
    // options
    if (typeof js === 'function') {
        js();
    } else {
        function run() {
            if (js.waitForSelector) {
                waitForSelector(js.waitForSelector).then(js.run);
            } else {
                js.run();
            }
        }

        if (js.runOnUrlChange) {
            // Run every time the URL changes
            onUrlChange(() => {
                run();
            });
        } else {
            run();
        }
    }
}

if (extension) {
    const src = extension.getAttribute('nagfree-extension');

    import(src).then((module) => {
        if (module.default && module.default.js) {
            runJs(module.default.js);
        }
    });
}