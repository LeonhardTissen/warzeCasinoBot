const { registerCommand } = require("../commands");
const { valid_decks } = require("../utils/customdecks");
const { createRowIfNotExists, db } = require("../utils/db");
const { send } = require("../utils/sender");

function setDeckCommand(message, deckid) {
    const valid_deck_ids = Object.keys(valid_decks);

    // Validate the deckid given
    if (!valid_deck_ids.includes(deckid)) {
        send(message, 'Invalid deck. You can choose the following: ' + valid_deck_ids.join(','))
        return;
    }

    // Make sure the user has a row in these tables
    createRowIfNotExists(message.author.id, 'shop');
    createRowIfNotExists(message.author.id, 'casdeck');

    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const owned_items = row.bought.split(',');

        // Look if the user owns that deck
        if (owned_items.includes(deckid) || deckid === 'normaldeck') {
            db.run('UPDATE casdeck SET decktype = ? WHERE id = ?', [valid_decks[deckid], message.author.id], (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }

                send(message, `Set deck to "${deckid}".`);
            })
        } else {
            send(message, `You don't own this deck.`)
        }
    });

}

registerCommand(setDeckCommand, "Set a deck to another you own", ['setdeck', 'sd'], "[deckid]");