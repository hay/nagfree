const log = console.log.bind(console);
const SCRIPTS_PATH = 'scripts';
const modules = [];

function getHostname(url) {
    url = new URL(url);
    return url.hostname.replace('www.', '');
}

// Yes, this is pretty much voodoo
function getJsModuleLoader(extensionSrc) {
    return `
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '${chrome.runtime.getURL('nagfree-loader.js')}';
        script.setAttribute('nagfree-extension', '${extensionSrc}');
        document.querySelector('body').appendChild(script);
    `;
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

function executeModuleInTab(tabId, module) {
    log(`Loading module ${module.src}`);

    if (module.css) {
        log('Inserting CSS');

        chrome.tabs.insertCSS(tabId, {
            code : module.css
        });
    }

    if (module.js) {
        const src = chrome.runtime.getURL(module.src);
        log(`Injecting Javascript ${src}`);

        chrome.tabs.executeScript(tabId, {
            code : getJsModuleLoader(src)
        }, () => {
            chrome.tabs.sendMessage(tabId, { injectModule : src });
        });
    }
}

function setupInjector() {
    log('Setting up injector');

    chrome.webNavigation.onCompleted.addListener((details) => {
        const { tabId, url } = details;
        const hostname = getHostname(url);

        modules.forEach((module) => {
            if (module.host && module.host === hostname) {
                log('Hostname found, executing module');
                executeModuleInTab(tabId, module);
                return;
            }

            if (module.query) {
                chrome.tabs.executeScript(tabId, {
                    code : `!!document.querySelector('${module.query}');`
                }, (result) => {
                    if (result[0]) {
                        log(`Query '${module.query}' found, executing module`);
                        executeModuleInTab(tabId, module)
                    }
                });
            }
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

        Promise.all(scripts).then(setupInjector);
    });
}

main();