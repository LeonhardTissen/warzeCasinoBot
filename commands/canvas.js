const { registerCommand } = require("../commands");
const { getCanvasHead } = require('../utils/canvashead');
const { sendCvs } = require("../utils/sender");

function canvasTest(message) {
    const cvs = getCanvasHead(248, message.author.username)

    sendCvs(message, cvs);
}
registerCommand(canvasTest, "Test Command for a Canvas", ['canvas', 'cvs']);