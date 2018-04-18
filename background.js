const log = console.log.bind(console);
const SCRIPTS_PATH = 'scripts';
const modules = [];

chrome.runtime.onMessage.addListener((req, sender, res) => {
    console.log('message');
    console.log(req);
});

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log('ja ho');
    console.log(request);
  });


function getHostname(url) {
    url = new URL(url);
    return url.hostname.replace('www.', '');
}

// Yes, this is pretty much voodoo
function injectScripts(tabId, scripts) {
    console.log('Injecting loader');
    scripts = JSON.stringify(scripts);
    console.log(scripts);

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

function loadModules() {
    log('Queing up modules');

    chrome.webNavigation.onCompleted.addListener((details) => {
        const modulesToLoad = [];
        const { tabId, url } = details;
        const hostname = getHostname(url);

        const modulesPromises = modules.map((module) => {
            return new Promise((resolve, reject) => {
                if (module.host && module.host === hostname) {
                    log(`Hostname found, executing module ${module.src}`);
                    modulesToLoad.push({tabId, module});
                }

                if (module.query) {
                    chrome.tabs.executeScript(tabId, {
                        code : `!!document.querySelector('${module.query}');`
                    }, (result) => {
                        if (result[0]) {
                            log(`Query '${module.query}' found, executing module ${module.src}`);
                            modulesToLoad.push({tabId, module});
                        }

                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        });

        Promise.all(modulesPromises).then(() => {
            // Just take the first tabId, we may want to customize this
            // later, but haven't yet found a usecase for using different
            // tabIds
            const tabId = modulesToLoad[0].tabId;

            // Make an array of all scripts of modules with a js function,
            // we need to inject those
            const scripts = modulesToLoad
                .filter(m => !!m.module.js)
                .map(m => m.module.src);

            // Inject CSS
            const css = modulesToLoad
                .filter(m => !!m.module.css)
                .map(m => m.module.css)
                .join('\n');

            // Inject styles
            chrome.tabs.insertCSS(tabId, {
                code : css
            });

            // Finally inject scripts
            injectScripts(tabId, scripts);
        });

    });
}

function main() {
    getScriptsInDirectory(SCRIPTS_PATH).then((scripts) => {
        scripts = scripts.map((script) => {
            return import(script).then((module) => {
                module.default.src = script;
                modules.push(module.default)
            });
        });

        Promise.all(scripts).then(loadModules);
    });
}

main();