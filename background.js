var sites = null;
var log = console.log.bind(console);

function getFilterPath(url) {
    var url = new URL(url);
    const hostname = url.hostname.replace('www.', '');
    return sites[hostname] ? `scripts/${sites[hostname]}.js` : false;
}

// Why doesn't Promise have this natively?
Promise.series = function(series) {
    return series.reduce((p, fn) => p.then(fn), Promise.resolve());
};

function executeScripts(tabId, scripts) {
    scripts = scripts.map((script) => {
        return new Promise( (resolve) => {
            log(`Loading ${script}`);
            chrome.tabs.executeScript(tabId, { file : script }, resolve);
        });
    });

    Promise.series(scripts).then(() => log('Loaded all scripts'));
}

function handleUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status !== 'complete') return;

    var path = getFilterPath(tab.url);

    if (!path) {
        log(`No filter found for ${tab.url}`);
        return;
    }

    log(`Found filter for ${tab.url}, now injecting`);

    executeScripts(tabId, [
        'lib/jquery/dist/jquery.js',
        'lib/underscore/underscore-min.js',
        'nagfree.js',
        path
    ]);
}

function main() {
    var scriptsUrl = chrome.extension.getURL('scripts.json');

    fetch(scriptsUrl).then((res) => res.json()).then((scripts) => {
        sites = scripts;
        chrome.tabs.onUpdated.addListener(handleUpdate);
    });
}

main();