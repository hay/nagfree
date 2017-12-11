const log = console.log.bind(console);
const SCRIPTS_PATH = 'scripts2';
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

function getScriptsInDirectory(directory) {
    log('Loading scripts');

    return new Promise((resolve, reject) => {
        chrome.runtime.getPackageDirectoryEntry((entry) => {
            entry.getDirectory(directory, { create : false }, (dir) => {
                const reader = dir.createReader();

                reader.readEntries((results) => {
                    results = results.map(entry => `./${directory}/${entry.name}`);
                    resolve(results);
                });
            });
        })
    });
}

function moduleLoaded(tabId) {
    return new Promise((resolve, reject) => {
        chrome.tabs.executeScript(tabId, {
            code : `document.querySelector('html').setAttribute('nagfree-loaded', '');`
        }, (result) => {
            log('moduleLoadedAttribute');
            resolve();
        });
    });
}

function executeModuleInTab(tabId, module) {
    log(`Loading module ${module.src}`);

    // We know we can load a module, first set the 'nagfree-loaded' attribute, then
    // load the actual module
    moduleLoaded(tabId).then(() => {
        if (module.css) {
            log('Inserting CSS');

            chrome.tabs.insertCSS(tabId, {
                code : module.css
            });
        }

        if (module.js) {
            const src = chrome.runtime.getURL(module.src);
            log(`Injecting Javascript ${src}`);
        }
    });
}

function moduleExecutedOnPage(tabId) {
    return new Promise((resolve, reject) => {
        chrome.tabs.executeScript(tabId, {
            code : `document.documentElement.hasAttribute('nagfree-loaded');`
        }, (result) => {
            log('moduleExecutedOnPage', result);
            resolve(result && result.length && result[0])
        });
    });
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
    log('Setting up injector');

    chrome.webNavigation.onCompleted.addListener((details) => {
        const { tabId, url } = details;
        const hostname = getHostname(url);

        if (hostname in hosts) {
            log('Hostname found, executing module');
            executeModuleInTab(tabId, hosts[hostname]);
            return;
        }

        for (let query in queries) {
            chrome.tabs.executeScript(tabId, {
                code : `!!document.querySelector('${query}');`
            }, (result) => {
                if (result[0]) {
                    log(`Query '${query}' found, executing module`);
                    executeModuleInTab(tabId, queries[query])
                }
            });
        }
    });

    /*
    chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
        if (change.status === 'complete') {
            log('changes', change);

            moduleExecutedOnPage(tabId).then((isExecuted) => {
                if (isExecuted) {
                    log('Already executed!');
                    return;
                }

                const hostname = getHostname(tab.url);

                if (hostname in hosts) {
                    log('Hostname found, executing module');
                    executeModuleInTab(tabId, hosts[hostname]);
                    return;
                }

                for (let query in queries) {
                    chrome.tabs.executeScript(tabId, {
                        code : `!!document.querySelector('${query}');`
                    }, (result) => {
                        if (result[0]) {
                            log('Query found, executing module');
                            executeModuleInTab(tabId, queries[query])
                        }
                    });
                }
            });
        }
    });
    */
}

function main() {
    getScriptsInDirectory(SCRIPTS_PATH).then((scripts) => {
        scripts = scripts.map((script) => {
            return import(script).then(m => parseModule(m.default, script));
        });

        Promise.all(scripts).then(setupInjector);
    });
}

main();