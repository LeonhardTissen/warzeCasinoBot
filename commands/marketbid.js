const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const emojis = require('../emojis.json');
const { getPrefix } = require("../utils/getprefix");
const { changeBalance, checkIfLarger } = require("../utils/currency");
const { send } = require("../utils/sender");
const { getSettings } = require("../utils/settings");

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

            // Always make sure atleast 3 minutes are left after a bid
            const now = Date.now() / 1000;
            const seconds_until_end = Math.max(row.startedat + 3600 - now, 180);
            const new_started_at = Math.floor(now - 3600 + seconds_until_end);

            // Update the marketplace item with new higher bid and updated bidder
            db.run('UPDATE marketplace SET highestbidder = ?, bidamount = ?, startedat = ? WHERE id = ?', [message.author.id, bidamount, new_started_at, itemid]);
            send(message, `Set a bid of **${bidamount}** ${emojis.diamond} on \`${itemid}\``);

            // Ping the last bidder
            if (row.highestbidder) {
                getSettings(row.highestbidder).then((settings) => {
                    // Only ping if they want to be notified
                    if (settings.mb) {
                        message.channel.send(`<@${row.highestbidder}>, you have been outbid!`)
                    }
                })
            }
        })
    })
}

registerCommand(cmdMarketplaceBid, "Bid on a marketplace item", ['bid'], "[id] [price]", false, false);