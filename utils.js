export function $(selector) {
    return document.querySelector(selector);
}

export function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}

export function countWords(string) {
    return string.split(/\n/)
                 .map((l) => l.trim())
                 .filter((l) => l !== '')
                 .join('. ')
                 .split(/(\b[^\s]+\b)/)
                 .map((w) => w.trim())
                 .filter((w) => ['', '.', "'", ','].indexOf(w) === -1)
                 .length;
}

export function elementFromHtml(html) {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function tryFor(times = 10, timeout = 1000, fn) {
    function go() {
        fn();

        if (times > 0) {
            window.requestIdleCallback(go, { timeout });
        } else {
            times--;
        }
    }

    go();
}

export function waitFor(fn, timeout, tries = 10) {
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