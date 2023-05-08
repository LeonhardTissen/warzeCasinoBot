const { registerCommand } = require("../commands");
const { send } = require("../utils/sender");
const { createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { changeChests, getChests, valid_chest_colors, unboxDiamonds, unboxCard, unboxDeck } = require("../utils/chests");
const { isNumeric } = require("../utils/numchoice");
const { capitalize } = require("../utils/capitalize");

function cmdOpenChest(message, color, amount) {
    createRowIfNotExists(message.author.id, 'redchest');

    if (!valid_chest_colors.includes(color)) {
        send(message, `Invalid chest color. Valid: **${valid_chest_colors.join(', ')}**`)
        return;
    }

    const emoji = emojis[color + 'chest'];

    // Default is 1 chest
    let amountNum = 1;
    if (['all','a'].includes(amount)) {
        // Open all chests
        amountNum = 99999;
    } else if (isNumeric(amount)) {
        // Open x amount of chests
        amountNum = parseInt(amount);
    }

    getChests(message.author.id, [color]).then((chests) => {
        // If the amount opened is larger than the max, just open them all
        amountNum = Math.min(amountNum, chests[color]);

        // Check if the user has any chests they can unbox
        if (chests[color] <= 0) {
            send(message, `<@${message.author.id}>, you have no **${capitalize(color)} Chests** ${emoji}`);
            return;
        }

        let chestsOpened = 0;
        const openInterval = setInterval(function() {
            switch (color) {
                case 'red':
                    if (Math.random() >= 0.5) {
                        // 50% chance of unboxing a card
                        unboxCard(message, 'Red Chest', emoji);
                    } else {
                        // 50% chance of just getting diamonds
                        unboxDiamonds(message, 10, 150, 'Red Chest', emoji);
                    }
                    break;
                case 'blue':
                    if (Math.random() >= 0.5) {
                        // 50% chance of unboxing a card
                        unboxCard(message, 'Blue Chest', emoji);
                    } else {
                        // 50% chance of unboxing a deck
                        unboxDeck(message, 'Blue Chest', emoji);
                    }
                    break;
                case 'golden':
                    // Always a large amount of diamonds
                    unboxDiamonds(message, 250, 1650, 'Golden Chest', emoji);
                    break;
            }
            chestsOpened ++;

            // Remove one red chest from their inventory
            changeChests(message.author.id, -1, color);

            if (chestsOpened >= amountNum) {
                clearInterval(openInterval);
            }
        }, 1500)

    });
}

registerCommand(cmdOpenChest, "Open chests you own", ['chest', 'ch'], "[color] [amount|all?]", false, false);