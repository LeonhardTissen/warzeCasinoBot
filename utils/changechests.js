const { createRowIfNotExists, db } = require("./db");

// Changes the targets balance by any amount, does not take into account if they end up with negative money 
function changeRedChests(target, changeAmount) {
    return new Promise((resolve) => {
        createRowIfNotExists(target, 'redchest');
        
        db.run('UPDATE redchest SET redchest = redchest + ? WHERE id = ?', [changeAmount, target], (err) => {
            if (err) {
                console.log(err.message);
                return;
            }
            resolve(true)
        });
    });
}
exports.changeRedChests = changeRedChests;