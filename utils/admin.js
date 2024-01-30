const { send } = require("./sender");
const settings = require('../settings.json');

// Check if a given message author is an admin, as provided in the settings.json file
function isAdmin(message) {
	// Check if admin setting is array or string
    if (
		message.author.id === settings.admin || 
		(Array.isArray(settings.admin) && settings.admin.includes(message.author.id))
	) {
        return true;
    } else {
        send(message, "You don't have access to this command.");
        return false;
    }
}
exports.isAdmin = isAdmin;
