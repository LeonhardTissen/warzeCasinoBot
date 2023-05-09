const { getSettings } = require("./settings");

function getPrefix(target) {
    return new Promise((resolve) => {
        // Retrieve the personal prefix setting,
        // Will default to the global prefix
        getSettings(target).then((s) => {
            resolve(s.pp)
        })
    })
}
exports.getPrefix = getPrefix;