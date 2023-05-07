const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { getPrefix } = require("../utils/getprefix");
const { changeBalance } = require("../utils/currency");
const { send } = require("../utils/sender");

function cmdMarketplaceBid(message, itemid, bidamount) {
    bidamount = parseInt(bidamount)
    if (isNaN(bidamount)) {
        send(message, `No bid amount provided.`);
        return;
    }
    
    if (bidamount <= 0) {
        send(message, `Invalid bid amount.`);
        return;
    }

    db.get('SELECT * FROM marketplace WHERE id = ?', [itemid], (err, row) => {
        if (err) {
            console.log(err);
            return;
        }

        
        if (message.author.id == row.highestbidder) {
            send(message, `You're already the highest bid.`);
            return;
        }
        
        if (row.highestbidder) {
            if (bidamount <= row.bidamount) {
                send(message, `Your bid must be larger than the current one.`);
                return;
            }
            changeBalance(row.highestbidder, row.bidamount);
        } else {
            if (bidamount < row.bidamount) {
                send(message, `Your bid must be larger than the minimum.`);
                return;
            }
        }
        changeBalance(message.author.id, - bidamount);

        db.run('UPDATE marketplace SET highestbidder = ?, bidamount = ? WHERE id = ?', [message.author.id, bidamount, itemid]);
        send(message, `Set a bid of **${bidamount}** ${emojis.diamond} on \`${itemid}\``);
    })
}

registerCommand(cmdMarketplaceBid, "Bid on a marketplace item", ['bid'], "[id] [price]", false, false);