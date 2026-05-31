const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'node_modules/iyzipay/lib/Iyzipay.js');
let code = fs.readFileSync(file, 'utf8');

// If already patched, revert first to make string replacement easy
code = code.replace(/var resources = \[.*?\];/s, `var resources = [];`);

const resourcesDir = path.join(__dirname, 'node_modules/iyzipay/lib/resources');
const resourceFiles = fs.readdirSync(resourcesDir)
    .filter(f => f.endsWith('.js'))
    .map(f => f.replace('.js', ''));

const resourceArrayStr = '[\n        ' + resourceFiles.map(f => `'${f}'`).join(', ') + '\n    ]';

const target = `    var resources = [];\n    resources.forEach(function(resourceName) {`;

const replacement = `    var resources = ${resourceArrayStr};\n    resources.forEach(function(resourceName) {`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched successfully with correct resources array!");
} else {
    // maybe it wasn't patched properly, let's just do a clean reinstall and patch
    console.log("Re-installing clean iyzipay");
    require('child_process').execSync('rm -rf node_modules/iyzipay && npm install iyzipay', {stdio: 'inherit'});
    
    let freshCode = fs.readFileSync(file, 'utf8');
    const freshTarget = `    fs.readdirSync(modelsPath).forEach(function (fileName) {
        if (~fileName.indexOf('.js')) {
            var resource = require(modelsPath + '/' + fileName);
            var resourceName = fileName.split('.js')[0];
            _self[resourceName[0].toLowerCase() + resourceName.substring(1)] = new resource(_self._config);
        }
    });`;
    const freshReplacement = `    var resources = ${resourceArrayStr};
    resources.forEach(function(resourceName) {
        var resource = require('./resources/' + resourceName + '.js');
        _self[resourceName[0].toLowerCase() + resourceName.substring(1)] = new resource(_self._config);
    });`;
    
    freshCode = freshCode.replace(freshTarget, freshReplacement);
    fs.writeFileSync(file, freshCode);
    console.log("Clean patched successfully!");
}
