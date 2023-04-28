const { loadImage } = require('canvas');

const assets = {}

const filenames = ['cardclosed', 'card1', 'card2', 'card3', 'card4', 'card5', 'card6'];
filenames.forEach((filename) => {
    path = 'images/' + filename + '.png';
    loadImage(path).then((img) => {
        assets[filename] = img;
    })
})
exports.assets = assets;