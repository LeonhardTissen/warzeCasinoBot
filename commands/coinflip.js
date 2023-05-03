const { registerCommand } = require("../commands");
const { validateBetAmount } = require("../utils/bet");
const { checkIfLarger } = require("../utils/currency");
const { db, createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");
const { addToStat } = require("../utils/stats");

function coinFlip(message, amount) {

    // Validate the bet passed in, must be atleast 2
    amount = validateBetAmount(message, amount, 2);
    if (!amount) return;

    createRowIfNotExists(message.author.id, 'users');

    checkIfLarger(message.author.id, amount).then((hasEnoughDiamonds) => {
        
        if (!hasEnoughDiamonds) {
            send(message, "You don't have enough diamonds.");
            return;
        }
        
        // 50% chance of winning
        let resulting_balance_change;
        if (Math.random() >= 0.5) {
            resulting_balance_change = -amount;
            send(message, `${emojis.geizehappy} You lost! **${resulting_balance_change}** ${emojis.diamond}`);
            addToStat('cfdlost', message.author.id, amount).then(() => {
                addToStat('cflost', message.author.id, 1);
            });
        } else {
            resulting_balance_change = Math.floor(amount * 0.8)
            send(message, `${emojis.geizeangry} You won! **+${resulting_balance_change}** ${emojis.diamond}`);
            addToStat('cfdwon', message.author.id, resulting_balance_change).then(() => {
                addToStat('cfwon', message.author.id, 1);
            });
        };

        // Change the users balance
        db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [resulting_balance_change, message.author.id], (err) => {
            if (err) {
                console.log(err.message);
                return;
            }
        });
    });
}
registerCommand(coinFlip, "Flip a coin and bet diamonds.", ['coinflip', 'cf'], "[amount]");