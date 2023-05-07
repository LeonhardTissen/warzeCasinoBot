const { createCanvas } = require("canvas");
const { hslToHex } = require("./hsltorgb");
const { assets } = require('./images');
const { randChoice, randRange } = require("./random")

const colors = []
for (let hue = 0; hue < 360; hue += 10) {
    colors.push(hslToHex(hue, 77, 42))
    colors.push(hslToHex(hue, 77, 52))
    colors.push(hslToHex(hue, 100, 35))
    colors.push(hslToHex(hue, 100, 48))
    colors.push(hslToHex(hue, 100, 60))
}

const pattern_types = ['rotsquare', 'diaglines', 'windows', 'towers', 'circle', 'waves', 'arrow', 'triangle', 'thunder', 'heart', 'rainbow', 'gradient', 'moon', 'wind', 'cubes', 'warts', 'stripes'];

function randomCustomCard() {
    return `cc-${randRange(0, 179)}-${randChoice(pattern_types)}`
}
exports.randomCustomCard = randomCustomCard;

function drawCustomCard(code, shopPreview = false) {
    const codeData = code.replace('customcard-','').replace('cc-','').split('-')

    // Pattern
    const pattern_name = codeData[1];
    const pt = assets[`pattern${pattern_name}`]
    if (!pattern_types.includes(pattern_name)) {
        console.log(pattern_name, 'is not valid');
        return;
    }

    // Sub canvas for the pattern
    const pcvs = createCanvas(pt.width, pt.height);
    const pctx = pcvs.getContext('2d');

    // Draw the color of the pattern
    pctx.fillStyle = colors[parseInt(codeData[0])];
    pctx.fillRect(0, 0, pt.width, pt.height);

    pctx.fillStyle = 'white';
    pctx.globalAlpha = 0.5;


    // Draw the pattern
    pctx.drawImage(assets[`pattern${pattern_name}`], 0, 0);

    // New canvas
    const cvs = createCanvas(72, 72);
    const ctx = cvs.getContext('2d');

    // Draw the pattern across the entire canvas
    const pattern = ctx.createPattern(pcvs, 'repeat');

    // Draw the overlay
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, 72, 72);
    ctx.drawImage(assets['shopcardover'], 0, 0, 72, 72);

    if (!shopPreview) {
        const fcvs = createCanvas(48, 72);
        const fctx = fcvs.getContext('2d');

        fctx.drawImage(cvs, 12, 0, 48, 72, 0, 0, 48, 72);

        // Remove corners
        //  Top left
        fctx.clearRect(0, 0, 5, 1);
        fctx.clearRect(0, 1, 3, 1);
        fctx.clearRect(0, 2, 2, 1);
        fctx.clearRect(0, 3, 1, 1);
        fctx.clearRect(0, 4, 1, 1);
        //  Top right
        fctx.clearRect(43, 0, 5, 1);
        fctx.clearRect(45, 1, 3, 1);
        fctx.clearRect(46, 2, 2, 1);
        fctx.clearRect(46, 3, 1, 1);
        fctx.clearRect(47, 4, 1, 1);
        //  Bottom left
        fctx.clearRect(0, 67, 1, 1);
        fctx.clearRect(0, 68, 1, 1);
        fctx.clearRect(0, 69, 2, 1);
        fctx.clearRect(0, 70, 3, 1);
        fctx.clearRect(0, 71, 5, 1);
        //  Bottom right
        fctx.clearRect(43, 67, 1, 1);
        fctx.clearRect(45, 68, 1, 1);
        fctx.clearRect(46, 69, 2, 1);
        fctx.clearRect(46, 70, 3, 1);
        fctx.clearRect(47, 71, 5, 1);

        return fcvs;
    } else {
        const size = 72 * 5;
        const fcvs = createCanvas(size, size);
        const fctx = fcvs.getContext('2d');

        fctx.imageSmoothingEnabled = false;
        fctx.drawImage(cvs, 0, 0, size, size)

        return fcvs;
    }
}
exports.drawCustomCard = drawCustomCard