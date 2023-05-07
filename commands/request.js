const { registerCommand } = require("../commands");
const { capitalize } = require("../utils/capitalize");
const { startGame } = require("../utils/casino2deck");
const { changeChests, getChests } = require("../utils/chests");
const { startConnect4Game, postUpdate, array2D, toggleTurn } = require("../utils/cn4game");
const { checkIfLarger, changeBalance } = require("../utils/currency");
const { emojis } = require("../utils/emojis");
const { ongoing_requests } = require("../utils/games");
const { removeFromInventory, addToInventory } = require("../utils/inventory");
const { send } = require("../utils/sender");
const { pluralS } = require("../utils/timestr");

function acceptRequest(request, message) {
    const sender = request.sender;
    const recipient = request.recipient;
    let betamount;
    let price;
    
    switch (request.type) {
        case 'casino2':
            betamount = request.amount;
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
        case 'connect4':
            betamount = request.amount;
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
    
                    const game = startConnect4Game(message, sender, recipient, betamount, 1, array2D(7, 6));
                    startConnect4Game(message, recipient, sender, betamount, 2, game.state.field);
                    postUpdate(game, message);
                })
            });
            break;
        case 'transferchest':
            price = request.amount;
            checkIfLarger(recipient, price).then((success) => {
                if (!success) {
                    send(message, `<@${recipient}> doesn't have enough diamonds ${emojis.diamond}.`);
                    return;
                }

                getChests(sender, [request.color]).then((chests) => {
                    if (chests[request.color] < request.quantity) {
                        send(message `<@${sender}> doesn't have enough chests.`);
                        return;
                    }
                    
                    changeBalance(sender, price);
                    changeBalance(recipient, - price);

                    changeChests(sender, -request.quantity, request.color);
                    changeChests(recipient, request.quantity, request.color);

                    const emoji = emojis[request.color + 'chest'];
                    send(message, `Successfully transferred **${request.quantity} ${capitalize(request.color)} Chest${pluralS(request.quantity)}** ${emoji} from <@${sender}> to <@${recipient}> for **${price}** ${emojis.diamond}.`);
                })
            })
            break;
        case 'transfercard':
            price = request.amount;
            checkIfLarger(recipient, price).then((success) => {
                if (!success) {
                    send(message, `<@${recipient}> doesn't have enough diamonds ${emojis.diamond}.`);
                    return;
                }

                changeBalance(sender, price);
                changeBalance(recipient, - price);

                removeFromInventory(sender, 'customcard', 'owned', request.cardid);
                addToInventory(recipient, 'customcard', 'owned', request.cardid);

                send(message, `Successfully transferred **${request.cardid}** from <@${sender}> to <@${recipient}> for **${price}** ${emojis.diamond}.`);
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