const { registerCommand } = require("../commands");
const { send } = require("../utils/sender");

function restartCommand(message) {
    send(message, 'Bot is now restarting!');

    setTimeout(() => {
        process.exit(0);
    }, 500)
}

registerCommand(restartCommand, "Restart the bot", ['restart', 'r'], "", true);