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

function onDomChange(selector, cb) {
    var el = document.querySelector(selector);

    console.log(el);

    var observer = new MutationObserver((mut, obs) => {
        console.log(mut);
        if (mut[0].addedNodes.length || mut[0].removedNodes.length) {
            cb();
        }
    });

    observer.observe(el, {
        childList : true,
        subtree : true
    });
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

function parseConf(inputConf) {
    var conf = {
        waitFor : false,
        runWhen : false
    };

    if (typeof inputConf === 'string') {
        conf.siteId = inputConf;
        return conf;
    }

    for (var key in inputConf) {
        conf[key] = inputConf[key];
    }

    return conf;
}

function main(sites) {
    var url = new URL(window.location);
    var hostname = url.hostname.replace('www.', '');

    if (!sites[hostname]) return;

    var siteconf = parseConf(sites[hostname]);
    var path = `scripts/${siteconf.siteId}.js`;

    if (siteconf.waitFor) {
        waitForSelector(siteconf.waitFor).then(() => { loadPath(path); });
    } else {
        loadPath(path);
    }

    if (siteconf.runWhen) {
        onDomChange(siteconf.runWhen, window.__nagfree_script__());
    }
}

fetch(chrome.extension.getURL('scripts.json')).then((res) => res.json()).then(main);