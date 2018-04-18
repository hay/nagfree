const SCRIPTS_PATH = 'scripts';

function getHostname(url) {
    url = new URL(url);
    return url.hostname.replace('www.', '');
}

// Yes, this is pretty much voodoo
function injectScripts(tabId, modules) {
    let scripts = modules.filter(m => !!m.module.js).map(m => m.module.src);
    scripts = JSON.stringify(scripts);

    chrome.tabs.executeScript(tabId, {
        code : `
            (function() {
                const script = document.createElement('script');
                script.type = 'module';
                script.dataset.scripts = '${scripts}';
                script.src = '${chrome.runtime.getURL('nagfree-loader.js')}';
                document.querySelector('body').appendChild(script);
            })();
        `
    });
}

function getScriptsInDirectory(directory) {
    console.log('Loading scripts');

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

// Because this can happen multiple times, we can't make this a promise!
function onLoad(resolve) {
    chrome.webNavigation.onCompleted.addListener((details) => {
        const { tabId, url } = details;
        const hostname = getHostname(url);
        resolve({ tabId, hostname });
    });
}

function checkModule({ tabId, hostname, module }, resolve) {
    let passed = false;

    if (module.host && module.host === hostname) {
        console.log(`Hostname found, executing module ${module.src}`);
        passed = true;
    }

    if (module.query) {
        chrome.tabs.executeScript(tabId, {
            code : `!!document.querySelector('${module.query}');`
        }, (result) => {
            if (result[0]) {
                console.log(`Query '${module.query}' found, executing module ${module.src}`);
                resolve({tabId, module});
            } else {
                resolve(false);
            }
        });
    } else {
        if (passed) {
            resolve({tabId, module});
        } else {
            resolve(false);
        }
    }
}

function injectCss(tabId, modules) {
    const css = modules.map(m => m.module.css ? m.module.css : '').join('\n');

    chrome.tabs.insertCSS(tabId, {
        code : css
    });
}

async function loadModule(script) {
    const module = await import(script);
    module.default.src = script;
    return module.default;
}

function mapCallbacks(chain, callback) {
    let tries = chain.length;

    for (let i = 0; i < chain.length; i++) {
        const fn = chain[i];

        fn((result) => {
            chain[i] = result;
            tries--;

            if (tries === 0) {
                callback(chain);
            }
        });
    }
}

async function main() {
    let scripts = await getScriptsInDirectory(SCRIPTS_PATH);
    scripts = scripts.map(async (script) => await loadModule(script));

    const allModules = await Promise.all(scripts);

    // Note how we use old fashioned callbacks here instead of promises,
    // because the background.js runs all the time but needs to execute this
    // stuff every time we have a page reload, we can't use promises
    // because they only execute *once*. Instead of that, we use some
    // old school async stuff
    onLoad(({ tabId, hostname }) => {
        let modules = allModules.map((module) => {
            return function(resolve) {
                checkModule({ tabId, hostname, module }, resolve);
            };
        });

        mapCallbacks(modules, (modules) => {
            modules = modules.filter(m => !!m);
            injectCss(tabId, modules);
            injectScripts(tabId, modules)
        });
    });
}

main();