const { loadImage } = require('canvas');

// Preload all images to use in canvases, is ran on startup
const assets = {}

// Go through the "/images" directory and save the loaded image in the object
const { readdirSync } = require('fs');
const files = readdirSync('./images');
files.forEach((filename) => {
    path = 'images/' + filename;
    loadImage(path).then((img) => {
        assets[filename] = img;
    })
})
exports.assets = assets;