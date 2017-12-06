const log = console.log.bind(console);
const hosts = {};
const queries = {};

function getHostname(url) {
    url = new URL(url);
    return url.hostname.replace('www.', '');
}

// Why doesn't Promise have this natively?
function runPromises(series) {
    return series.reduce((p, fn) => p.then(fn), Promise.resolve());
};

function executeScripts(tabId, scripts) {
    scripts = scripts.map((script) => {
        return new Promise( (resolve) => {
            log(`Loading ${script}`);
            chrome.tabs.executeScript(tabId, { file : script }, resolve);
        });
    });

    runPromises(scripts).then(() => log('Loaded all scripts'));
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

function getScriptsInDirectory(directory, callback) {
    chrome.runtime.getPackageDirectoryEntry((entry) => {
        entry.getDirectory(directory, { create : false }, (dir) => {
            const reader = dir.createReader();
            reader.readEntries((results) => {
                results = results.map(entry => `./${directory}/${entry.name}`);
                callback(results);
            });
        });
    })
}

function executeModuleInTab(tabId, module) {
    log(`Loading module ${module.src}`);

    if (module.css) {
        chrome.tabs.insertCSS(tabId, {
            code : module.css
        });
    }
}

function parseModule(module, src) {
    // For easy reference later
    module.src = src;

    if (module.host) {
        hosts[module.host] = module;
    } else if (module.query) {
        queries[module.query] = module;
    }
}

function setupInjector() {
    chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
        if (change.status === 'complete') {
            const hostname = getHostname(tab.url);

            if (hostname in hosts) {
                executeModuleInTab(tabId, hosts[hostname]);
                return;
            }

            for (let query in queries) {
                chrome.tabs.executeScript(tabId, {
                    code : `!!document.querySelector('${query}');`
                }, (result) => {
                    if (result[0]) {
                        executeModuleInTab(tabId, queries[query])
                    }
                });
            }
        }
    });
}

function main() {
    getScriptsInDirectory("scripts2", (scripts) => {
        scripts = scripts.map((script) => {
            return import(script).then(m => parseModule(m.default, script));
        });

        Promise.all(scripts).then(() => {
            setupInjector();
        });
    });

    /*
    var scriptsUrl = chrome.extension.getURL('scripts.json');

    fetch(scriptsUrl).then((res) => res.json()).then((scripts) => {
        sites = scripts;
        chrome.tabs.onUpdated.addListener(handleUpdate);
    });
    */
}

main();