const { registerCommand } = require("../commands");
const { valid_chips } = require("../utils/chips");
const { createRowIfNotExists, db } = require("../utils/db");
const { send } = require("../utils/sender");

function setChipCommand(message, chipid) {
    // If "chip" wasn't added at the start
    if (!chipid.startsWith('chip')) {
        chipid = 'chip' + chipid;
    }

    console.log(chipid);
    // Validate the chipid given
    if (!valid_chips.includes(chipid)) {
        send(message, 'Invalid chip. You can choose the following: ' + valid_chips.join(','))
        return;
    }

    // Make sure the user has a row in these tables
    createRowIfNotExists(message.author.id, 'shop');
    createRowIfNotExists(message.author.id, 'caschip');

    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const owned_items = row.bought.split(',');

        // Look if the user owns that chip
        if (owned_items.includes(chipid) || chipid === 'chipnormal') {
            db.run('UPDATE caschip SET chiptype = ? WHERE id = ?', [chipid, message.author.id], (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }

                send(message, `Set chip to "${chipid}".`);
            })
        } else {
            send(message, `You don't own this chip.`)
        }
    });

}

registerCommand(setChipCommand, "Set a chip to another you own", ['setchip'], "[chipid]");