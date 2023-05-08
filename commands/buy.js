const { registerCommand } = require("../commands");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const { db } = require("../utils/db");
const emojis = require('../emojis.json');
const { send } = require("../utils/sender");
const shop = require("../shop.json");

function cmdBuyItem(message, itemid) {

    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        let owned_items = row.bought;
        
        shop.items.forEach((item) => {
            if (item.id == itemid) {
                if (owned_items.split(",").includes(itemid)) {
                    send(message, `You already own "${item.name}".`);
                    return;
                }

                checkIfLarger(message.author.id, item.cost).then((success) => {
                    if (!success) {
                        send(message, `You don't have enough diamonds ${emojis.diamond} to purchase "${item.name}"`);
                        return;
                    }

                    changeBalance(message.author.id, - item.cost);
                    send(message, `Successfully bought "${item.name}" for **${item.cost}** ${emojis.diamond}`);

                    owned_items += ',' + item.id;

                    db.run('UPDATE shop SET bought = ? WHERE id = ?', [owned_items, message.author.id], (err) => {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                    })
                })
            }
        })
    })
}

registerCommand(cmdBuyItem, "Buy an item from the shop", ['buy'], "[itemid]");