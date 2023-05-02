const { Canvas } = require("canvas");
const { registerCommand } = require("../commands");
const { db, createRowIfNotExists } = require("../utils/db");
const { sendCvs } = require("../utils/sender");
const { assets } = require("../utils/images");
const { getPrefix } = require('../utils/getprefix');
const { shop_items } = require("../utils/shopitems");

function shopCommand(message) {
    createRowIfNotExists(message.author.id, 'shop');

    db.get('SELECT bought FROM shop WHERE id = ?', [message.author.id], (err, row) => {
        if (err) {
            console.log(err.message);
            return;
        }

        const owned_items = row.bought.split(',');

        const cvs = new Canvas(300, 72 * shop_items.length);
        const ctx = cvs.getContext('2d');
        const space_per_item = 72;
        let ypos = 0;

        getPrefix()
        shop_items.forEach((item) => {
            // Draw the shop item itself
            ctx.drawImage(assets[item.shopimg], 0, ypos);

            // Draw the name of the item
            ctx.fillStyle = 'white';
            ctx.font = '24px sansserif';
            ctx.fillText(item.name, space_per_item + 5, ypos + 24);
            
            const user_owns = owned_items.includes(item.id);

            // Draw the price of the item
            ctx.fillStyle = '#FF4965';
            ctx.font = '18px sansserif';
            ctx.fillText(user_owns ? '(Purchased)' :`Price: ${item.cost} Diamonds`, space_per_item + 5, ypos + 46);
            
            // Command to buy the item, or a message showing that you own it
            ctx.fillStyle = 'white';
            ctx.font = '14px sansserif';
            ctx.fillText(user_owns ? `!setcard ${item.id}` : `!buy ${item.id}`, space_per_item + 5, ypos + 65);
            
            ypos += space_per_item;
        })

        sendCvs(message, cvs);
    })
}

registerCommand(shopCommand, "Shows the shop", ['shop', 'sh'], "");