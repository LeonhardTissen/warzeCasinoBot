const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const { send } = require("../utils/sender");
const { getPrefix } = require("../utils/getprefix");

function cmdShowInventory(message) {
	// This command does nothing except for return this message
    let cards_str = '';
    let decks_str = '';
    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        // Order depending on the type of shop item
        if (row) {
            cards_str += row.bought.split(',').filter((i) => !i.endsWith('deck')).join(',');
            decks_str += row.bought.split(',').filter((i) => i.endsWith('deck')).join(',');
        }

        db.get('SELECT owned FROM customcard WHERE id = ?', [message.author.id], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            if (row) {
                cards_str += `,${row.owned}`
            }

            getPrefix(message.author.id).then((prefix) => {
                let rendered_string = `<@${message.author.id}>**'s Inventory:**\n\n`;

                rendered_string += `__**Cards:**__\n`;

                rendered_string += `*${prefix}setcard* **normal**\n`;
                cards_str.split(',').forEach((cardid) => {
                    if (cardid !== '') {
                        rendered_string += `*${prefix}setcard* **${cardid}**\n`;
                    }
                });

                rendered_string += `__**Decks:**__\n`;

                rendered_string += `*${prefix}setdeck* **normal**\n`;
                decks_str.split(',').forEach((deckid) => {
                    if (deckid !== '') {
                        rendered_string += `*${prefix}setdeck* **${deckid}**\n`;
                    }
                })
                send(message, rendered_string);
            })
        })
    })
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(cmdShowInventory, "Shows which cards and decks you own", ['inventory', 'inv', 'i', 'cards'], "", false, false);