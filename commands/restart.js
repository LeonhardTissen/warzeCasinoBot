const { registerCommand } = require("../commands");
const { send } = require("../utils/sender");

function restartCommand(message) {
    send(message, 'Sayonara');

    setTimeout(() => {
        process.exit(0);
    }, 500)
}

registerCommand(restartCommand, "Restart the bot", ['restart', 'r'], "", true);