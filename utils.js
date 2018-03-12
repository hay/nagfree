export function $(selector) {
    return document.querySelector(selector);
}

export function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}

export function waitFor(fn, timeout) {
    let tries = 10;

    return new Promise((resolve, reject) => {
        function check() {
            if (fn() || tries === 0) {
                resolve();
            } else {
                tries--;
                window.requestIdleCallback(check, { timeout });
            }
        }

        check();
    });
}

export function waitForSelector(selector, timeout) {
    function check() {
        return !!$(selector);
    }

    return waitFor(check, timeout);
}