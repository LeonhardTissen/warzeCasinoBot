const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const { send } = require("../utils/sender");
const { getPrefix } = require("../utils/getprefix");

function cmdShowCards(message) {
	// This command does nothing except for return this message
    let final_str = '';
    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        if (row) {
            final_str += row.bought;
        }

        db.get('SELECT owned FROM customcard WHERE id = ?', [message.author.id], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            if (row) {
                final_str += ',' + row.owned;
            }

            getPrefix(message.author.id).then((prefix) => {
                let rendered_string = `<@${message.author.id}> **has the following cards:**\n\n`;

                rendered_string += `*${prefix}setcard* **normal**\n`;
                final_str.split(',').forEach((cardid) => {
                    if (cardid !== '') {
                        rendered_string += `*${prefix}setcard* **${cardid}**\n`;
                    }
                })
                send(message, rendered_string);
            })

        })
    })
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(cmdShowCards, "Shows which cards you own", ['cards'], "", false, false);