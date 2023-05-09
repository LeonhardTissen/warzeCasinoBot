const { db, createRowIfNotExists } = require("./db");

function addToInventory(target, table, column, item) {
    // First make sure the user has a row in that table
    createRowIfNotExists(target, table);

    return new Promise((resolve) => {
        // Get the users' current inventory
        db.get(`SELECT ${column} FROM ${table} WHERE id = ?`, [target], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            let owned_items = '';

            if (row && row[column] != '') {
                // Append with comma inbetween
                owned_items = `${row[column]},${item}`;
            } else {
                // First item in inventory
                owned_items = `${item}`;
            }

            // Update the database with the updated inventory
            db.run(`UPDATE ${table} SET ${column} = ? WHERE id = ?`, [owned_items, target], (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }

                resolve();
            })
        })
    })
}
exports.addToInventory = addToInventory;

function removeFromInventory(target, table, column, item) {
    return new Promise((resolve) => {
        db.get(`SELECT ${column} FROM ${table} WHERE id = ?`, [target], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            let owned_items = ''

            if (row && row[column] != '') {
                owned_items = row[column];
            }

            let owned_items_array = owned_items.split(',');

            // Find first instance of item in inventory
            const delete_index = owned_items_array.indexOf(item);

            if (delete_index != -1) {
                // Remove the item if found
                owned_items_array.splice(delete_index, 1)
            }
            owned_items = owned_items_array.join(',');

            db.run(`UPDATE ${table} SET ${column} = ? WHERE id = ?`, [owned_items, target], (err) => {
                if (err) {
                    console.log(err.message);
                    return;
                }
                
                resolve();
            })
        })
    })
}
exports.removeFromInventory = removeFromInventory;

function hasInInventory(target, table, column, item) {
    return new Promise((resolve) => {
        // Get the target's inventory
        db.get(`SELECT ${column} FROM ${table} WHERE id = ?`, [target], (err, row) => {
            if (err) {
                console.log(err.message);
                return;
            }

            let owned_items = ''

            if (row && row[column] != '') {
                owned_items = row[column];
            }

            let owned_items_array = owned_items.split(',');

            // Check if item is in the users inventory
            resolve(owned_items_array.includes(item))
        })
    })
}
exports.hasInInventory = hasInInventory;