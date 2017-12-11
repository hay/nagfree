// The voodoo bootstrap to import the actual extension code
const extension = document.querySelector('[nagfree-extension]');
const $ = document.querySelector.bind(document);

function waitForSelector(selector) {
    let tries = 10;

    return new Promise((resolve, reject) => {
        function check() {
            if (!!$(selector) || tries === 0) {
                resolve();
            } else {
                tries--;
                window.requestIdleCallback(check, { timeout : 300 });
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
        const run = js.run;

        if (js.waitForSelector) {
            waitForSelector(js.waitForSelector).then(run);
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