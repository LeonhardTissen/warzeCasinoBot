const { ADMIN } = require("./env");
const { send } = require("./sender");

// Check if a given message author is an admin, as provided in the .env file
function isAdmin(message) {
    if (message.author.id === ADMIN) {
        return true;
    } else {
        send(message, "You don't have access to this command");
        return false;
    }
}
exports.isAdmin = isAdmin;