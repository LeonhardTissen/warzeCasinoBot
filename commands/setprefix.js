const { registerCommand } = require("../commands");
const { createRowIfNotExists, db } = require("../utils/db");
const { send } = require("../utils/sender");

function cmdSetPrefix(message, newPrefix) {
	// This command does nothing except for return this message
    if (!newPrefix || newPrefix.length > 3) {
        send(message, `You must provide a valid prefix that's 3 characters in length or less.`);
        return;
    }

    const target = message.author.id;

    createRowIfNotExists(target, 'prefix')

    db.run('UPDATE prefix SET prefix = ? WHERE id = ?', [newPrefix, target], (err) => {
        if (err) {
            console.log("Error while settings prefix:" + err.message);
            return;
        }
        send(message, `The prefix you control the bot with is now "${newPrefix}"`);
    });
}

registerCommand(cmdSetPrefix, "Sets a new prefix, user specific.", ['setprefix', 'sp'], "[string]");