const { registerCommand } = require("../commands");
const { getCanvasHead } = require('../utils/canvashead');
const { drawCustomCard } = require("../utils/customcard");
const { sendCvs } = require("../utils/sender");

function canvasTest(message, color) {
    //const cvs = getCanvasHead(248, message.author.username)

    const cvs = drawCustomCard(color, true);
    
    sendCvs(message, cvs);
}
registerCommand(canvasTest, "Test Command for a Canvas", ['canvas', 'cvs'], "", true, true);