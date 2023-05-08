const { loadImage } = require('canvas');

// Preload all images to use in canvases, is ran on startup
const assets = {}

// Go through all the "/images" directory
const { readdirSync } = require('fs');
const files = readdirSync('./images/load/');
files.forEach((filename) => {
    path = 'images/load/' + filename;
    loadImage(path).then((img) => {
        // Save the loaded image in the assets object
        assets[filename.split('.')[0]] = img;
    })
})
exports.assets = assets;