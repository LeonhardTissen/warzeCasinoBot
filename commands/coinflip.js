const { registerCommand } = require("../commands");
const { validateBetAmount } = require("../utils/bet");
const { checkIfLarger } = require("../utils/currency");
const { db, createRowIfNotExists } = require("../utils/db");
const { emojis } = require("../utils/emojis");
const { send } = require("../utils/sender");

function coinFlip(message, amount) {
    amount = validateBetAmount(message, amount, 2);

    if (!amount) {
        return;
    }

    createRowIfNotExists(message.author.id);

    checkIfLarger(message.author.id, amount).then((hasEnoughDiamonds) => {
        if (!hasEnoughDiamonds) {
            send(message, "You don't have enough diamonds.");
            return;
        }

        let resulting_balance_change;
        if (Math.random() >= 0.5) {
            resulting_balance_change = -amount;
            send(message, `${emojis.geizehappy} You lost! **${resulting_balance_change}** ${emojis.diamond}`);
        } else {
            resulting_balance_change = Math.floor(amount * 0.8)
            send(message, `${emojis.geizeangry} You won! **+${resulting_balance_change}** ${emojis.diamond}`);
        };

        db.run('UPDATE users SET balance = balance + ? WHERE id = ?', [resulting_balance_change, message.author.id], (err) => {
            if (err) {
                console.log(err.message);
                return;
            }
        });
    });
}
registerCommand(coinFlip, "Flip a coin and bet diamonds.", ['coinflip', 'cf']);