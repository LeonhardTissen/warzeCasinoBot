const { registerCommand } = require("../commands");
const { db } = require("../utils/db");
const emojis = require('../emojis.json');
const { send } = require("../utils/sender");
const { secToReadable } = require("../utils/timestr");
const { changeBalance } = require("../utils/currency");
const { getSecUntilHourly } = require("../utils/secuntilhourly");
const { changeChests } = require("../utils/chests");

// Amount of diamonds the hourly command grants
const hourly_amount = 100;

function hourly(message) {
    // Target is always author
    const target = message.author.id;

    getSecUntilHourly(target).then((secTillHourly) => {
        // Prevent the user from collecting their hourly
        if (secTillHourly > 0) {
            send(message, `<@${target}>, you need to wait **${secToReadable(secTillHourly)}**.`);
            return
        }
            
        // Reward the user with their hard-earned hourly diamonds
        const resulting_balance_change = hourly_amount;
        changeBalance(target, resulting_balance_change).then(() => {
            send(message, `<@${target}>, you collected: **${hourly_amount}** ${emojis.diamond} and **1** ${emojis.redchest}`);
        })
        changeChests(target, 1, 'red');
        
        // Apply a timer that the user has to wait before collecting the next hourly
        const now = Math.floor(Date.now() / 1000);
        db.run('UPDATE hourlies SET last = ? WHERE id = ?', [now, target], (err) => {
            if (err) {
                console.log(err.message);
            }
        })
    })
}
registerCommand(hourly, "Collect 100 diamonds and 1 red chests every hour", ['hourly', 'hr']);