const { registerCommand } = require("../commands");
const { startGame } = require("../utils/casino2deck");
const { changeRedChests } = require("../utils/changechests");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const { emojis } = require("../utils/emojis");
const { ongoing_requests } = require("../utils/games");
const { send } = require("../utils/sender");

function acceptRequest(request, message) {
    const sender = request.sender;
    const recipient = request.recipient;
    
    switch (request.type) {
        case 'casino2':
            const betamount = request.amount;
            checkIfLarger(sender, betamount).then((success) => {
                if (!success) {
                    send(message, `<@${sender}> doesn't have enough diamonds ${emojis.diamond}.`);
                    return;
                }
                
                checkIfLarger(recipient, betamount).then((success) => {
                    if (!success) {
                        send(message, `<@${recipient}> doesn't have enough diamonds ${emojis.diamond}.`);
                        return;
                    }
                    
                    changeBalance(sender, - betamount);
                    changeBalance(recipient, - betamount);
    
                    startGame(message, sender, recipient, betamount);
                    setTimeout(() => {
                        startGame(message, recipient, sender, betamount);
                    }, 200)
                })
            });
            break;
        case 'transferredchest':
            const price = request.amount;
            checkIfLarger(recipient, price).then((success) => {
                if (!success) {
                    send(message, `<@${recipient}> doesn't have enough diamonds ${emojis.diamond}.`);
                    return;
                }

                changeBalance(sender, price);
                changeBalance(recipient, - price);

                changeRedChests(sender, -1);
                changeRedChests(recipient, 1);

                send(message, `Successfully transferred **1 Red Chest** ${emojis.diamond} from <@${sender}> to <@${recipient}> for **${price}** ${emojis.diamond}.`);
            })
            break;
    }
}

function requestCommand(message, action) {
    if (!["accept","deny","a","d"].includes(action)) {
        send(message, "Invalid action.");
        return;
    };

    ongoing_requests.forEach((req) => {
        if (req.recipient === message.author.id) {
            if (['accept','a'].includes(action)) {
                acceptRequest(req, message);
            } else {
                send(message, 'You denied the request.');
            }
            ongoing_requests.splice(ongoing_requests.indexOf(req), 1);
            return;
        }
    })
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(requestCommand, "Handle a request", ['request', 'req', 'r'], "[accept|deny]");