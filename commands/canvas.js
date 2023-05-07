const { registerCommand } = require("../commands");
const { getCanvasHead } = require('../utils/cvsdecorators');
const { drawCustomCard } = require("../utils/customcard");
const { sendCvs } = require("../utils/sender");

function canvasTest(message, code) {
    //const cvs = getCanvasHead(248, message.author.username)

    const cvs = drawCustomCard(code, true);
    
    sendCvs(message, cvs);
}
registerCommand(canvasTest, "Test Command for a Canvas", ['canvas', 'cvs'], "", true, true);