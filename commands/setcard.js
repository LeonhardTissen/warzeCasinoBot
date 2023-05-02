const { registerCommand } = require("../commands");
const { createRowIfNotExists, db } = require("../utils/db");
const { send } = require("../utils/sender");

// Valid card types
const valid_cards = ['normal', 'cactus', 'weize', 'potion', 'gob', 'geize'];

function setCardCommand(message, cardid) {
    // Validate the cardid given
    if (!valid_cards.includes(cardid)) {
        send(message, 'valid cards: ' + valid_cards.join(','))
        return;
    }

    // Make sure the user has a row in these tables
    createRowIfNotExists(message.author.id, 'shop');
    createRowIfNotExists(message.author.id, 'cascard');

    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const owned_items = row.bought.split(',');

        // Look if the user owns that card
        if (owned_items.includes(cardid) || cardid === 'normal') {
            db.run('UPDATE cascard SET cardtype = ? WHERE id = ?', [cardid, message.author.id], (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }

                send(message, `Set card to "${cardid}".`);
            })
        } else {
            send(message, `You don't own this card.`)
        }
    });

}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(setCardCommand, "Set a card to another you own", ['setcard'], "[cardid]");