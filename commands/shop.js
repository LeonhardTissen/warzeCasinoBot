const { Canvas } = require("canvas");
const { registerCommand } = require("../commands");
const { db, createRowIfNotExists } = require("../utils/db");
const { sendCvs } = require("../utils/sender");
const { assets } = require("../utils/images");
const { getPrefix } = require('../utils/getprefix');
const { shop_items } = require("../utils/shopitems");

function shopCommand(message, page) {
    createRowIfNotExists(message.author.id, 'shop');

    // Amount of pages there are
    const page_amount = Math.ceil(shop_items.length / 5);

    page = parseInt(page);
    if (!(page >= 1 && page <= page_amount)) {
        // Default to page 1 if not provided
        page = 1;
    }

    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        // Get prefix of the user first
        getPrefix(message.author.id).then((prefix) => {
            const owned_items = row.bought.split(',');

            const cvs = new Canvas(300, 72 * 5 + 30);
            const ctx = cvs.getContext('2d');
            const space_per_item = 72;
            let ypos = 30;

            // Draw the title and page number
            ctx.fillStyle = '#FF8594';
            ctx.font = '24px sansserif';
            ctx.fillText(`Shop (Page ${page}/${page_amount})`, 5, 22);

            const pageOffset = (page - 1) * 5;

            for (let i = pageOffset; i < Math.min(shop_items.length, pageOffset + 5); i ++) {
                const item = shop_items[i]
                // Draw the shop item itself
                ctx.drawImage(assets[item.shopimg], 0, ypos, 72, 72);

                // Draw the name of the item
                ctx.fillStyle = 'white';
                ctx.font = '24px sansserif';
                ctx.fillText(item.name, space_per_item + 5, ypos + 24);
                
                const user_owns = owned_items.includes(item.id);

                // Draw the price of the item
                ctx.fillStyle = (user_owns ? '#9AAABF': '#FF4965');
                ctx.font = '18px sansserif';
                ctx.fillText(user_owns ? '(Purchased)' :`Price: ${item.cost} Diamonds`, space_per_item + 5, ypos + 46);
                
                // Command to buy the item, or a message showing that you own it
                ctx.fillStyle = 'white';
                ctx.font = '14px sansserif';
                //ctx.fillText(user_owns ? `${prefix}setcard ${item.id}` : `${prefix}buy ${item.id}`, space_per_item + 5, ypos + 65);
                ctx.fillText(user_owns ? `${prefix}inventory` : `${prefix}buy ${item.id}`, space_per_item + 5, ypos + 65);
                
                ypos += space_per_item;
            }

            sendCvs(message, cvs);
        })
    })
}

registerCommand(shopCommand, "Shows the shop", ['shop', 'sh'], "[page?]");