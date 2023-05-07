const { registerCommand } = require("../commands");
const { send, sendBoth } = require("../utils/sender");
const { createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { randomCustomCard, drawCustomCard } = require("../utils/customcard");
const { randRange, randChoice } = require("../utils/random");
const { changeBalance } = require("../utils/currency");
const { changeChests, getChests, valid_chest_colors } = require("../utils/chests");
const { isNumeric } = require("../utils/numchoice");
const { addToInventory } = require("../utils/inventory");
const { capitalize } = require("../utils/capitalize");
const { valid_decks } = require("../utils/customdecks");
const { getCanvasHead } = require("../utils/cvsdecorators");

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
                        // 50% chance of card unboxing
                        const unboxed_card = randomCustomCard();
                        
                        // Add the new custom card to the users' inventory
                        addToInventory(message.author.id, 'customcard', 'owned', unboxed_card);
                        sendBoth(message, `You unboxed a **Red Chest** ${emoji} which contained: **${unboxed_card}**`, drawCustomCard(unboxed_card, true));
                    } else {
                        // 50% chance of just getting diamonds
                        const won_amount = randRange(10,150);
                        changeBalance(message.author.id, won_amount);
                        send(message, `You unboxed a **Red Chest** ${emoji} which contained: **${won_amount}** ${emojis.diamond}`);
                    }
                    break;
                case 'blue':
                    if (Math.random() >= 0.5) {
                        // 50% chance of a card unboxing
                        const unboxed_card = randomCustomCard();
                            
                        // Add the new custom card to the users' inventory
                        addToInventory(message.author.id, 'customcard', 'owned', unboxed_card);
                        sendBoth(message, `You unboxed a **Blue Chest** ${emoji} which contained: **${unboxed_card}**`, drawCustomCard(unboxed_card, true));
                    } else {
                        // 50% chance of a deck unboxing
                        const unboxed_deck = randChoice(Object.keys(valid_decks).filter((c) => c != 'normaldeck'));
                            
                        // Add the new custom deck to the users' inventory
                        addToInventory(message.author.id, 'customdeck', 'owned', unboxed_deck);
                        sendBoth(message, `You unboxed a **Blue Chest** ${emoji} which contained: **${unboxed_deck}**`, getCanvasHead(300, message.author.username, valid_decks[unboxed_deck]));
                    }
                    break;
                case 'golden':
                    // Always a large amount of diamonds
                    const won_amount = randRange(250,1650);
                    changeBalance(message.author.id, won_amount);
                    send(message, `You unboxed a **Golden Chest** ${emoji} which contained: **${won_amount}** ${emojis.diamond}`);
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