const { registerCommand } = require("../commands");
const { drawCustomCard } = require("../utils/customcard");
const { sendCvs } = require("../utils/sender");

function cmdPreviewCard(message, code) {
    const cvs = drawCustomCard(code, true);
    
    sendCvs(message, cvs);
}
registerCommand(cmdPreviewCard, "Preview any custom card", ['previewcard'], "", false, false);