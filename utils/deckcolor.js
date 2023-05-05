const { db, createRowIfNotExists } = require("./db");
const settings = require('../settings.json');

function getDeckColor(target) {
    createRowIfNotExists(target, 'casdeck');

    return new Promise((resolve) => {
        db.get('SELECT decktype FROM casdeck WHERE id = ?', [target], (err, row) => {
            if (err) {
                console.log(err.message);
                resolve(settings.color);
                return;
            }

            // If no custom decktype
            if (!row || row.decktype == '') {
                resolve(settings.color);
                return
            }
            
            resolve(row.decktype);
        })
    })
}
exports.getDeckColor = getDeckColor;