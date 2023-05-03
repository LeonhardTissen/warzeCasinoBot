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

const pattern_types = ['rotsquare', 'diaglines', 'windows', 'towers', 'circle', 'waves', 'arrow', 'triangle'];

function randomCustomCard() {
    return `customcard-${randRange(0, 180)}-${randChoice(pattern_types)}`
}
exports.randomCustomCard = randomCustomCard;

function drawCustomCard(code, shopPreview = false) {
    const codeData = code.replace('customcard-','').split('-')
    const pcvs = createCanvas(8, 8);
    const pctx = pcvs.getContext('2d');

    const pattern_name = codeData[1];
    pctx.fillStyle = colors[parseInt(codeData[0])];
    pctx.fillRect(0, 0, 8, 8);

    pctx.fillStyle = 'white';
    pctx.globalAlpha = 0.5;

    if (!pattern_types.includes(pattern_name)) {
        console.log(pattern_name, 'is not valid');
        return;
    }

    const pattern_type = pattern_name;
    switch (pattern_type) {
        case 'rotsquare':
            pctx.fillRect(3, 0, 1, 1);
            pctx.fillRect(2, 1, 3, 1);
            pctx.fillRect(1, 2, 5, 1);
            pctx.fillRect(0, 3, 7, 1);
            pctx.fillRect(1, 4, 5, 1);
            pctx.fillRect(2, 5, 3, 1);
            pctx.fillRect(3, 6, 1, 1);
            break;
        case 'diaglines':
            for (let i = 0; i < 8; i ++) {
                pctx.fillRect(14 - i, i, 3, 1);
                pctx.fillRect(6 - i, i, 3, 1);
                pctx.fillRect(-2 - i, i, 3, 1);
            }
            break;
        case 'windows':
            pctx.fillRect(0, 0, 2, 4);
            pctx.fillRect(4, 0, 2, 4);
            pctx.fillRect(2, 4, 2, 4);
            pctx.fillRect(6, 4, 2, 4);
            break;
        case 'towers':
            pctx.fillRect(1, 0, 4, 4);
            pctx.fillRect(3, 4, 4, 4);
            break;
        case 'circle':
            pctx.fillRect(3, 1, 2, 1);
            pctx.fillRect(2, 2, 4, 1);
            pctx.fillRect(1, 3, 6, 1);
            pctx.fillRect(1, 4, 6, 1);
            pctx.fillRect(2, 5, 4, 1);
            pctx.fillRect(3, 6, 2, 1);
            break;
        case 'waves':
            pctx.fillRect(5, 0, 1, 3);
            pctx.fillRect(0, 5, 3, 1);
            pctx.fillRect(2, 2, 3, 1);
            pctx.fillRect(2, 3, 1, 2);
            pctx.fillRect(5, 5, 3, 1);
            pctx.fillRect(5, 6, 1, 2);
            break;
        case 'arrow':
            pctx.fillRect(2, 0, 4, 4);
            pctx.fillRect(0, 4, 8, 1);
            pctx.fillRect(1, 5, 6, 1);
            pctx.fillRect(2, 6, 4, 1);
            pctx.fillRect(3, 7, 2, 1);
            break;
        case 'triangle':
            pctx.fillRect(3, 0, 1, 2);
            pctx.fillRect(2, 2, 3, 2);
            pctx.fillRect(1, 4, 5, 2);
            pctx.fillRect(0, 6, 7, 2);
            break;
    }
    pctx.globalAlpha = 1;
    
    const cvs = createCanvas(72, 72);
    const ctx = cvs.getContext('2d');
    const pattern = ctx.createPattern(pcvs, 'repeat');

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