const { registerCommand } = require("../commands");
const { changeChests, getChests } = require("../utils/chests");
const { db } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { getPrefix } = require("../utils/getprefix");
const { market_item_names } = require("../utils/market");
const { send } = require("../utils/sender");

const valid_market_items = Object.keys(market_item_names);

function cmdMarketplace(message, amount, item, price) {
    if (amount && item && price) {
        // User wants to sell something

        // Validate item amount
        amount = parseInt(amount);
        if (isNaN(amount) || amount <= 0) {
            send(message, `Invalid amount provided.`);
            return;
        }

        // Validate item
        if (!valid_market_items.includes(item)) {
            send(message, `Invalid item. Must be **${valid_market_items.join(', ')}**`);
            return;
        }

        // Validate minimum price
        price = parseInt(price);
        if (isNaN(price) || price <= 0) {
            send(message, `Invalid minimum price provided.`);
            return;
        }
        
        // Check if user has enough chests
        const chest_color = item.replace('chest','');
        getChests(message.author.id, [chest_color]).then((chests) => {
            if (chests[chest_color] < amount) {
                send(message, `You don't have enough of that item.`)
                return;
            }

            // Place new item into the marketplace
            const itemid = (Math.round(Math.random() * 100000)).toString(24);
            const now = Math.floor(Date.now() / 1000);
            db.run(`INSERT INTO marketplace (id, seller, type, bidamount, highestbidder, startedat, itemamount) VALUES (?, ?, ?, ?, ?, ?, ?)`, [itemid, message.author.id, item, price, null, now, amount])
            changeChests(message.author.id, - amount, chest_color);
            send(message, `Successfully placed item in the marketplace!`);
        })
    } else {
        // User just wants to view the marketplace
        getPrefix(message.author.id).then((prefix) => {
            db.all('SELECT * FROM marketplace', [], (err, rows) => {
                let mp_msg = '**__Marketplace:__**\n';
                if (err) {
                    console.log(err.message);
                    return;
                }

                rows.forEach((row) => {
                    const bidder = row.highestbidder == null ? '`Nobody`' : `<@${row.highestbidder}>`;
                    const seller = row.seller == 'Weize' ? 'Weize' : `<@${row.seller}>`;

                    mp_msg += `\`${prefix}bid ${row.id}\` ${seller}: **${row.itemamount}x** ${market_item_names[row.type]} for **${row.bidamount}** ${emojis.diamond}
Highest Bidder: ${bidder}, Ends <t:${row.startedat + 3600}:R>\n\n`
                })

                // Help message at the bottom of marketplace
                mp_msg += `Use \`${prefix}help mp\` to find out how to put your own items on the marketplace.`;

                send(message, mp_msg);
            })
        })
    }
}

registerCommand(cmdMarketplace, "View the marketplace", ['marketplace', 'market', 'mp'], "[amount?] [item?] [price?]", false, false);