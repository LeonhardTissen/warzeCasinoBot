const { changeBalance } = require("./currency");
const { randomCustomCard, drawCustomCard } = require("./customcard");
const valid_decks = require("../decks.json");
const { createRowIfNotExists, db } = require("./db");
const emojis = require('../emojis.json');
const { randRange, randChoice } = require("./random");
const { send, sendBoth } = require("./sender");
const { addToInventory } = require("./inventory");
const { getCanvasHead } = require("./cvsdecorators");

const valid_chest_colors = ['red', 'blue', 'golden'];
exports.valid_chest_colors = valid_chest_colors;

function changeChests(target, changeAmount, color) {
    return new Promise((resolve) => {
        createRowIfNotExists(target, color + 'chest');
        
        db.run(`UPDATE ${color}chest SET ${color}chest = ${color}chest + ? WHERE id = ?`, [changeAmount, target], (err) => {
            if (err) {
                console.log(err.message);
                return;
            }
            resolve(true)
        });
    });
}
exports.changeChests = changeChests;

function getChests(target, colors) {
    return new Promise((resolve) => {
        const chests = {};

        colors.forEach((color) => {
            createRowIfNotExists(target, color + 'chest');

            db.get(`SELECT ${color}chest FROM ${color}chest WHERE id = ?`, [target], (err, row) => {
                if (err || !row || !row[color + 'chest']) {
                    chests[color] = 0;
                } else {
                    chests[color] = row[color + 'chest'];
                }

                if (Object.keys(chests).length == colors.length) {
                    resolve(chests);
                }
            })
        })
    })
}
exports.getChests = getChests;

function unboxDiamonds(message, minimum, maximum, chestname, emoji) {
    const won_amount = randRange(minimum, maximum);

    // Add the diamonds to the users' inventory
    changeBalance(message.author.id, won_amount);
    send(message, `You unboxed a **${chestname}** ${emoji} which contained: **${won_amount}** ${emojis.diamond}`);
}
exports.unboxDiamonds = unboxDiamonds;

function unboxCard(message, chestname, emoji) {
    const unboxed_card = randomCustomCard();
                        
    // Add the new custom card to the users' inventory
    addToInventory(message.author.id, 'customcard', 'owned', unboxed_card);
    sendBoth(message, `You unboxed a **${chestname}** ${emoji} which contained: **${unboxed_card}**`, drawCustomCard(unboxed_card, true));
}
exports.unboxCard = unboxCard;

function unboxDeck(message, chestname, emoji) {
    const unboxed_deck = randChoice(Object.keys(valid_decks).filter((c) => c != 'normaldeck'));
                            
    // Add the new custom deck to the users' inventory
    addToInventory(message.author.id, 'customdeck', 'owned', unboxed_deck).then((msg) => {
        if (msg == 'duplicate') {
            const amount = randRange(100,250);
            send(message, `You unboxed a deck that you already had, so you get **+${amount}** ${emojis.diamond}`);
            changeBalance(message.author.id, amount);
        } else if (msg == 'added') {
            sendBoth(message, `You unboxed a **${chestname}** ${emoji} which contained: **${unboxed_deck}**`, getCanvasHead(300, message.author.username, valid_decks[unboxed_deck]));
        }
    });
}
exports.unboxDeck = unboxDeck;