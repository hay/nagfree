function load(filename) {
    import(filename).then((test) => {
        test = test.default;
        console.log(test.name);
        test.run();
    });
}

[
    './scripts/test.js',
    './scripts/test2.js'
].forEach(load);