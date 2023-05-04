const { getUserID } = require("./client");
const { isNumeric } = require("./numchoice");

function parseUser(str, fallback) {
    // Parses a string to figure out who the Target ID is
    // TODO: Handle a username or nickname

    if (!str) {
        if (fallback) {
            return fallback;
        } else {
            return false;
        }
    }
    if (str.startsWith('<@') && str.endsWith('>')) {
        str = str.substring(2, str.length - 1);
    }
    if (!isNumeric(str)) {
        return getUserID(str);
    }
    return str;
}
exports.parseUser = parseUser;