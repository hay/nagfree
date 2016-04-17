function loadScript(src, cb = function(){}) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL(src);
    script.addEventListener('load', cb);
    document.head.appendChild(script);
}

function loadPath(path) {
    if ('jQuery' in window) {
        loadScript(path);
    } else {
        loadScript('lib/jquery.js', () => loadScript(path));
    }
}

function waitForSelector(selector) {
    var times = 5;

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

function main(sites) {
    var url = new URL(window.location);
    var hostname = url.hostname.replace('www.', '');

    if (!sites[hostname]) return;

    if (typeof sites[hostname] === 'string') {
        var siteId = sites[hostname];
        var waitFor = false;
    } else {
        var siteId = sites[hostname].script;
        var waitFor = sites[hostname].waitFor;
    }

    var path = `scripts/${siteId}.js`;

    if (waitFor) {
        waitForSelector(waitFor).then(() => { loadPath(path); });
    } else {
        loadPath(path);
    }
}

fetch(chrome.extension.getURL('scripts.json')).then((res) => res.json()).then(main);