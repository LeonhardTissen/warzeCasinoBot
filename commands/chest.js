const { registerCommand } = require("../commands");
const { send, sendCvs } = require("../utils/sender");
const { db, createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { randomCustomCard, drawCustomCard } = require("../utils/customcard");
const { randRange } = require("../utils/random");
const { changeBalance } = require("../utils/currency");
const { changeRedChests } = require("../utils/changechests");

function cmdOpenChest(message) {
    createRowIfNotExists(message.author.id, 'redchest');

    db.get('SELECT redchest FROM redchest WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        // Check if the user has any chests they can unbox
        if (row.redchest > 0) {

            if (Math.random() > 0.5) {
                // 50% chance of card unboxing
                const unboxed_card = randomCustomCard();
                
                // Add the new custom card to the users' inventory
                createRowIfNotExists(message.author.id, 'customcard');
                db.get('SELECT owned FROM customcard WHERE id = ?', [message.author.id], (err, row) => {
                    if (err) {
                        console.log(err.message);
                        return;
                    }
                    
                    const owned_cards = row.owned + ',' + unboxed_card;
                    db.run('UPDATE customcard SET owned = ? WHERE id = ?', [owned_cards, message.author.id], (err) => {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                        send(message, `You unboxed a **Red Chest** ${emojis.redchest} which contained: **${unboxed_card}**`);
                        sendCvs(message, drawCustomCard(unboxed_card, true))
                    })
                })
            } else {
                // 50% chance of just getting diamonds
                const won_amount = randRange(10,150);
                changeBalance(message.author.id, won_amount);
                send(message, `You unboxed a **Red Chest** ${emojis.redchest} which contained: **${won_amount}** ${emojis.diamond}`);
            }

            // Remove one red chest from their inventory
            changeRedChests(message.author.id, -1)
        } else {
            send(message, `<@${message.author.id}>, you have no **Red Chests** ${emojis.redchest}`);
        }
    });
}

registerCommand(cmdOpenChest, "Open a Chest", ['chest', 'ch'], "", false, false);