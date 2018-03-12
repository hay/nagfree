import { $, waitForSelector } from './utils.js';

// The voodoo bootstrap to import the actual extension code
const extension = $('[nagfree-extension]');
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

function runJs(js) {
    // If we have a function, run immediately, otherwise look at the
    // options
    if (typeof js === 'function') {
        js();
    } else {
        function run() {
            if (js.waitForSelector) {
                waitForSelector(js.waitForSelector, WAIT_FOR_SELECTOR_TIMEOUT).then(js.run);
            } else {
                js.run();
            }
        }

        if (js.runOnUrlChange) {
            // Run every time the URL changes and one time at load
            onUrlChange(() => {
                run();
            });

            run();
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