function loadScript(src, cb = function(){}) {
    var script = document.createElement('script');
    script.src = chrome.extension.getURL(src);
    script.addEventListener('load', cb);
    document.head.appendChild(script);
}

function main(sites) {
    var url = new URL(window.location);
    var hostname = url.hostname.replace('www.', '');

    if (!sites[hostname]) return;

    var path = `scripts/${sites[hostname]}.js`;

    if ('jQuery' in window) {
        loadScript(path);
    } else {
        loadScript('lib/jquery.js', () => loadScript(path));
    }
}

fetch(chrome.extension.getURL('scripts.json')).then((res) => res.json()).then(main);