const DEBUG = window.location.href.indexOf('debug') !== -1;
const log = function(msg) {
    if (DEBUG) {
        if (typeof msg === 'object') {
            msg = JSON.stringify(msg, null, 4);
        }

        console.log(`[nagfree] ${msg}`);
    }
}

// Why doesn't Promise have this natively?
Promise.series = function(series) {
    return series.reduce((p, fn) => p.then(fn), Promise.resolve());
};

function loadScript(src) {
    return new Promise( (resolve) => {
        log(`Now loading ${src}`);
        var script = document.createElement('script');
        script.src = chrome.extension.getURL(src);
        script.addEventListener('load', resolve);
        document.head.appendChild(script);
    });
}

function main(sites) {
    log('Loaded sites');
    log(sites);

    var url = new URL(window.location);
    var hostname = url.hostname.replace('www.', '');

    log(`Checking hostname ${hostname}`);

    if (!sites[hostname]) {
        log('No filters found');
        return;
    }

    var path = `scripts/${sites[hostname]}.js`;
    log(`Script: ${path}`);

    var scripts = [];

    if (!('jQuery' in window)) {
        scripts.push(loadScript('lib/jquery.js'));
    }

    scripts.push(loadScript('nagfree.js'), loadScript(path));

    Promise.series(scripts).then(() => log('All promises'));
}

fetch(chrome.extension.getURL('scripts.json')).then((res) => res.json()).then(main);