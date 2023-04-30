const { db } = require("./db");
const settings = require('../settings.json');

function getPrefix(target) {
    return new Promise((resolve) => {
        db.get('SELECT prefix FROM prefix WHERE id = ?', [target], (err, row) => {
            if (err) {
                console.log("Error retrieving prefix: " + err.message);
                // Return the fallback prefix not to break anything
                resolve(settings.prefix);
            }
    
            // User has registered a custom prefix, resolve it
            if (row && row.prefix) {
                resolve(row.prefix);
            }
    
            // Default to the bot prefix
            resolve(settings.prefix);
        })
    })
}
exports.getPrefix = getPrefix;