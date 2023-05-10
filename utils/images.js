const { loadImage } = require('canvas');
const { readdirSync } = require('fs');

// Preload all images to use in canvases, is ran on startup
const assets = {}

// Go through all the files in the "/images/load" directory
const files = readdirSync('./images/load/');
files.forEach((filename) => {
    path = 'images/load/' + filename;
    loadImage(path).then((img) => {
        // Save the loaded image in the assets object
        assets[filename.split('.')[0]] = img;
    })
})
exports.assets = assets;