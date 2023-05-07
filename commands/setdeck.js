const { registerCommand } = require("../commands");
const { valid_decks } = require("../utils/customdecks");
const { getCanvasHead } = require("../utils/cvsdecorators");
const { createRowIfNotExists, db } = require("../utils/db");
const { send, sendBoth } = require("../utils/sender");

function setDeckCommand(message, deckid) {
    const valid_deck_ids = Object.keys(valid_decks);

    if (!deckid) {
        send(message, `No deck provided.`);
        return;
    }

    // If "deck" wasn't added at the end
    if (!deckid.endsWith('deck')) {
        deckid += 'deck';
    }

    // Validate the deckid given
    if (!valid_deck_ids.includes(deckid)) {
        send(message, `Invalid deck. You can choose the following: **${valid_deck_ids.join(',')}**`)
        return;
    }

    // Make sure the user has a row in these tables
    createRowIfNotExists(message.author.id, 'shop');
    createRowIfNotExists(message.author.id, 'casdeck');
    createRowIfNotExists(message.author.id, 'customdeck');

    let owned_items = '';

    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        owned_items += row.bought.split(',');

        db.get('SELECT owned FROM customdeck WHERE id = ?', [message.author.id], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            owned_items += ',' + row.owned.split(',');

            console.log(owned_items);

            // Look if the user owns that deck
            if (owned_items.includes(deckid) || deckid === 'normaldeck') {
                db.run('UPDATE casdeck SET decktype = ? WHERE id = ?', [valid_decks[deckid], message.author.id], (err) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    sendBoth(message, `Set deck to "${deckid}".`, getCanvasHead(300, message.author.username, valid_decks[deckid]));
                })
            } else {
                send(message, `You don't own this deck.`)
            }
        })
    });

}

registerCommand(setDeckCommand, "Set a deck to another you own", ['setdeck', 'sd'], "[deckid]");