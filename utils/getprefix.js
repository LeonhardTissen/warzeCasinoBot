const { getSettings } = require("./settings");

function getPrefix(target) {
    return new Promise((resolve) => {
        getSettings(target).then((s) => {
            console.log(s.pp)
            resolve(s.pp)
        })
    })
}
exports.getPrefix = getPrefix;