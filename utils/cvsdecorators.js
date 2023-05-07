const { createCanvas } = require("canvas");
const settings = require('../settings.json');

function pickTextColor(bgColor) {
    var r = parseInt(bgColor.substring(0, 2), 16); // hexToR
    var g = parseInt(bgColor.substring(2, 4), 16); // hexToG
    var b = parseInt(bgColor.substring(4, 6), 16); // hexToB
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ? '#000000' : '#FFFFFF';
}

function getFillStyle(color, ctx, width) {
    if (color.length > 6) {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        const grad_colors = color.split(',');
        for (let i = 0; i < grad_colors.length; i ++) {
            gradient.addColorStop(0, '#' + grad_colors[0])
            gradient.addColorStop((i + 1) / grad_colors.length, '#' + grad_colors[1])
        }
        return(gradient);
    } else {
        return(`#${color}`);
    }
}

function getCanvasHead(width, string, color = settings.color) {
    const height = 30;
    const shadow = 15;

    const cvs = createCanvas(width, height);
    const ctx = cvs.getContext('2d');
    
    ctx.fillStyle = getFillStyle(color, ctx, width);
    ctx.beginPath();

    ctx.moveTo(0, 0)
    ctx.lineTo(width - height, 0);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    ctx.globalAlpha = 0.6;
    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(0, 0)
    ctx.lineTo(width - height - shadow, 0);
    ctx.lineTo(width - shadow, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    ctx.globalAlpha = 1;
    ctx.fill();

    ctx.fillStyle = pickTextColor(color.split(',')[0]);
    ctx.font = `${Math.round(height / 1.5)}px sansserif`
    ctx.fillText(string, 5, height - 8, width - height - shadow)

    return cvs
}
exports.getCanvasHead = getCanvasHead;

function getCanvasFooter(width, string, color = settings.color) {
    const height = 25;
    const shadow = 15;

    const cvs = createCanvas(width, height);
    const ctx = cvs.getContext('2d');
    
    ctx.fillStyle = getFillStyle(color, ctx, width);
    ctx.beginPath();
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, width - shadow, height);

    ctx.fillStyle = pickTextColor(color.split(',')[0]);
    ctx.font = `${Math.round(height / 1.5)}px sansserif`
    ctx.fillText(string, 5, height - 8, width - shadow)

    return cvs
}
exports.getCanvasFooter = getCanvasFooter;