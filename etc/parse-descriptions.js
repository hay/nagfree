// Get all @description descriptions from scripts and add them to README.md
const fs = require('fs').promises;
const glob = require('glob-promise');
const pathlib = require('path');

const DESCRIPTION_REGEX = / *(?:\/\/|\/\*){1} *\@description(.*)/;

async function getDescriptionFromPath(path) {
    let lines = await fs.readFile(path);
    lines = lines.toString().split('\n');

    for (let line of lines) {
        if (DESCRIPTION_REGEX.test(line)) {
            const matches = line.match(DESCRIPTION_REGEX);
            const match = matches[1].trim();
            return match;
        }
    }

    return 'No description';
}

async function main() {
    let scripts = await glob('../scripts/*.js');
    let descriptions = [];

    for (let path of scripts) {
        const basename = pathlib.basename(path, pathlib.extname(path));
        const description = await getDescriptionFromPath(path);
        descriptions.push(`* \`${basename}\` - ${description}`);
    }

    descriptions = descriptions.join('\n');
    console.log(descriptions);
}

main();