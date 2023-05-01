const { loadImage } = require('canvas');

// Preload all images to use in canvases, is ran on startup
const assets = {}

// Go through the "/images" directory and save the loaded image in the object
const { readdirSync } = require('fs');
const files = readdirSync('./images/load/');
files.forEach((filename) => {
    path = 'images/load/' + filename;
    loadImage(path).then((img) => {
        assets[filename.split('.')[0]] = img;
    })
})
exports.assets = assets;