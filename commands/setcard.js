const { registerCommand } = require("../commands");
const { drawCustomCard } = require("../utils/customcard");
const { valid_cards } = require("../utils/customcards");
const { createRowIfNotExists, db } = require("../utils/db");
const { send, sendCvs } = require("../utils/sender");

function setCardCommand(message, cardid) {
    // Handle custom cards
    if (cardid.startsWith('customcard-')) {
        createRowIfNotExists(message.author.id, 'customcard');

        db.get('SELECT owned FROM customcard WHERE id = ?', [message.author.id], (err, row) => {
            if (err || !row) {
                console.log(err.message);
                return;
            }

            const owned_custom_cards = row.owned.split(',');

            if (owned_custom_cards.includes(cardid)) {
                db.run('UPDATE cascard SET cardtype = ? WHERE id = ?', [cardid, message.author.id], (err) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
    
                    send(message, `Set card to **${cardid}**`);
                    if (cardid.startsWith('customcard-')) {
                        sendCvs(message, drawCustomCard(cardid, true))
                    }
                })
            } else {
                send(message, `You don't own this card.`)
            }
        });
        return;
    }

    // Validate the cardid given
    if (!valid_cards.includes(cardid)) {
        send(message, 'Invalid card. You can choose the following: ' + valid_cards.join(','))
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
registerCommand(setCardCommand, "Set a card to another you own", ['setcard', 'sc'], "[cardid]");