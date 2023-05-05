const { db, createRowIfNotExists } = require("./db");

const valid_chips = ["chipnormal","chipeye","chipwart","chiplazor","chiptroll","chipskull"]
exports.valid_chips = valid_chips;

function getChipColor(target) {
    createRowIfNotExists(target, 'caschip');

    return new Promise((resolve) => {
        db.get('SELECT chiptype FROM caschip WHERE id = ?', [target], (err, row) => {
            if (err) {
                console.log(err.message);
                resolve(false);
                return;
            }

            // If no custom chiptype
            if (!row || row.chiptype == '') {
                resolve(false);
                return
            }
            
            resolve(row.chiptype);
        })
    })
}
exports.getChipColor = getChipColor;