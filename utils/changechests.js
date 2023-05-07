const { createRowIfNotExists, db } = require("./db");

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