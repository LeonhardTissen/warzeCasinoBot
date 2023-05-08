const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const emojis = require('../emojis.json');
const { getPrefix } = require("../utils/getprefix");
const { changeBalance, checkIfLarger } = require("../utils/currency");
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

    checkIfLarger(message.author.id, bidamount).then((hasEnough) => {
        if (!hasEnough) {
            send(message, `You don't have enough diamonds to bid on this.`);
            return;
        }

        db.get('SELECT * FROM marketplace WHERE id = ?', [itemid], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            // Id doesn't exist in database
            if (!row) {
                send(message, `No marketplace item with that ID found.`);
                return;
            }
            
            // Prevent outbidding oneself
            if (message.author.id == row.highestbidder) {
                send(message, `You're already the highest bid.`);
                return;
            }

            // Prevent bidding on own auction
            if (message.author.id == row.seller) {
                send(message, `You can't bid on your own auction.`);
                return;
            }
            
            if (row.highestbidder) {
                // New bids can't equal the current bid
                if (bidamount <= row.bidamount) {
                    send(message, `Your bid must be larger than the current one.`);
                    return;
                }
                changeBalance(row.highestbidder, row.bidamount);
            } else {
                // Bids can equal the minimum
                if (bidamount < row.bidamount) {
                    send(message, `Your bid must be larger than the minimum.`);
                    return;
                }
            }
            changeBalance(message.author.id, - bidamount);

            // Update the marketplace item with new higher bid and updated bidder
            db.run('UPDATE marketplace SET highestbidder = ?, bidamount = ? WHERE id = ?', [message.author.id, bidamount, itemid]);
            send(message, `Set a bid of **${bidamount}** ${emojis.diamond} on \`${itemid}\``);
        })
    })
}

registerCommand(cmdMarketplaceBid, "Bid on a marketplace item", ['bid'], "[id] [price]", false, false);