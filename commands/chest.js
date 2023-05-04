const { registerCommand } = require("../commands");
const { send, sendCvs } = require("../utils/sender");
const { db, createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { randomCustomCard, drawCustomCard } = require("../utils/customcard");
const { randRange } = require("../utils/random");
const { changeBalance } = require("../utils/currency");
const { changeRedChests } = require("../utils/changechests");
const { isNumeric } = require("../utils/numchoice");
const { addToInventory } = require("../utils/inventory");

function cmdOpenChest(message, amount) {
    createRowIfNotExists(message.author.id, 'redchest');

    // Default is 1 chest
    let amountNum = 1;
    if (['all','a'].includes(amount)) {
        // Open all chests
        amountNum = 99999;
    } else if (isNumeric(amount)) {
        // Open x amount of chests
        amountNum = parseInt(amount);
    }

    db.get('SELECT redchest FROM redchest WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        // If the amount opened is larger than the max, just open them all
        amountNum = Math.min(amountNum, row.redchest);

        // Check if the user has any chests they can unbox
        if (row.redchest <= 0) {
            send(message, `<@${message.author.id}>, you have no **Red Chests** ${emojis.redchest}`);
            return;
        }

        let chestsOpened = 0;
        const openInterval = setInterval(function() {
            if (Math.random() >= 0.5) {
                // 50% chance of card unboxing
                const unboxed_card = randomCustomCard();
                
                // Add the new custom card to the users' inventory
                addToInventory(message.author.id, 'customcard', 'owned', unboxed_card);
                send(message, `You unboxed a **Red Chest** ${emojis.redchest} which contained: **${unboxed_card}**`);
                sendCvs(message, drawCustomCard(unboxed_card, true))
            } else {
                // 50% chance of just getting diamonds
                const won_amount = randRange(10,150);
                changeBalance(message.author.id, won_amount);
                send(message, `You unboxed a **Red Chest** ${emojis.redchest} which contained: **${won_amount}** ${emojis.diamond}`);
            }
            chestsOpened ++;

            // Remove one red chest from their inventory
            changeRedChests(message.author.id, -1);

            if (chestsOpened >= amountNum) {
                clearInterval(openInterval);
            }
        }, 1500)

    });
}

registerCommand(cmdOpenChest, "Open a Red Chest", ['chest', 'ch'], "[amount|all?]", false, false);