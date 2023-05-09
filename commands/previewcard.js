const { registerCommand } = require("../commands");
const { drawCustomCard } = require("../utils/customcard");
const { sendCvs, send } = require("../utils/sender");

function cmdPreviewCard(message, code) {
    // Validate card code
    if (!code) {
        send(message, 'No card code provided.');
        return;
    }
    const cvs = drawCustomCard(code, true);
    
    sendCvs(message, cvs);
}
registerCommand(cmdPreviewCard, "Preview any custom card", ['previewcard'], "", false, false);