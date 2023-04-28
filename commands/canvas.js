const { createCanvas } = require('canvas');
const { registerCommand } = require("../commands");
const { sendCvs } = require("../utils/sender");

function canvasTest(message) {
    const cvs = createCanvas(200, 200);
    const ctx = cvs.getContext('2d');

    // Set the fill style to red
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 200, 200)

    sendCvs(message, cvs);
}
registerCommand(canvasTest, "Test Command for a Canvas", ['canvas', 'cvs']);