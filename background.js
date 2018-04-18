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

function onLoad() {
    return new Promise((resolve, reject) => {
        chrome.webNavigation.onCompleted.addListener((details) => {
            const { tabId, url } = details;
            const hostname = getHostname(url);
            resolve({ tabId, hostname });
        });
    });
}

function moduleToCheckPromise({ tabId, hostname, module }) {
    return new Promise((resolve, reject) => {
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
    });
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

async function main() {
    let scripts = await getScriptsInDirectory(SCRIPTS_PATH);
    scripts = scripts.map(async (script) => await loadModule(script));

    let modules = await Promise.all(scripts);
    const { tabId, hostname } = await onLoad();
    modules = modules.map(async (module) => {
        return await moduleToCheckPromise({ tabId, hostname, module });
    });

    modules = await Promise.all(modules);
    modules = modules.filter(m => !!m);

    injectCss(tabId, modules);
    injectScripts(tabId, modules)
}

main();