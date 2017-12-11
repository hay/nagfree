// The voodoo bootstrap to import the actual extension code
const extension = document.querySelector('[nagfree-extension]');

if (extension) {
    const src = extension.getAttribute('nagfree-extension');
    import(src).then((module) => {
        if (module.default && module.default.js) {
            module.default.js();
        }
    });
}