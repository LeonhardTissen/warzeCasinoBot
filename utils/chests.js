const { createRowIfNotExists, db } = require("./db");

const valid_chest_colors = ['red', 'blue', 'golden'];
exports.valid_chest_colors = valid_chest_colors;

function changeChests(target, changeAmount, color) {
    return new Promise((resolve) => {
        createRowIfNotExists(target, color + 'chest');
        
        db.run(`UPDATE ${color}chest SET ${color}chest = ${color}chest + ? WHERE id = ?`, [changeAmount, target], (err) => {
            if (err) {
                console.log(err.message);
                return;
            }
            resolve(true)
        });
    });
}
exports.changeChests = changeChests;

function getChests(target, colors) {
    return new Promise((resolve) => {
        const chests = {};

        colors.forEach((color) => {
            createRowIfNotExists(target, color + 'chest');

            db.get(`SELECT ${color}chest FROM ${color}chest WHERE id = ?`, [target], (err, row) => {
                if (err || !row || !row[color + 'chest']) {
                    chests[color] = 0;
                } else {
                    chests[color] = row[color + 'chest'];
                }

                if (Object.keys(chests).length == colors.length) {
                    resolve(chests);
                }
            })
        })
    })
}
exports.getChests = getChests;