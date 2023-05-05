const { registerCommand } = require("../commands");
const { postUpdate, toggleTurn } = require("../utils/cn4game");
const { ongoing_games } = require("../utils/games");
const { send } = require("../utils/sender");
const { isNumeric } = require("../utils/numchoice");

function cmdCn4Put(message, column) {
    // Validate column
    if (!isNumeric(column)) {
        send(message, `Invalid column number.`);
        return;
    }

    column = parseInt(column) - 1;
    if (column < 0 || column > 6) {
        send(message, `Column must be between **1** and **7**.`);
        return;
    }

    // Get the currently running game
    const game = ongoing_games[message.author.id];
    if (!game) {
        return;
    }

    // Prevent moves if it's not the players turn
    if (game.state.playerid !== game.state.turn) {
        send(message, `It's not your turn.`);
        return;
    }

    // Check if there is a free slot in the column
    let row = 5;
    let spot_found = false;
    while (!spot_found) {
        // Row doesn't exist, throw error
        if (row < 0) {
            send(message, `There's no more space in this column.`);
            return;
        }

        // Check if that position is free
        if (game.state.field[row][column] == 0) {
            // Insert
            spot_found = true;
            game.state.field[row][column] = game.state.playerid;
        } else {
            // Look in Previous row
            row --;
        }

    }

    postUpdate(game, message)
}

// Register the command as this function with the description "Sample command", aliases ['sample', 'smpl'] and arguments
registerCommand(cmdCn4Put, "Put a chip in a column", ['put'], "[column]", false, true);