const { ADMIN } = require("./env");
const { send } = require("./sender");

function isAdmin(message) {
    if (message.author.id === ADMIN) {
        return true;
    } else {
        send(message, "You don't have access to this command");
        return false;
    }
}
exports.isAdmin = isAdmin;