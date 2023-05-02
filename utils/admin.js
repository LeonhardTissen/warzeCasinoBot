const { send } = require("./sender");
const settings = require('../settings.json');

// Check if a given message author is an admin, as provided in the settings.json file
function isAdmin(message) {
    if (message.author.id === settings.admin) {
        return true;
    } else {
        send(message, "You don't have access to this command.");
        return false;
    }
}
exports.isAdmin = isAdmin;