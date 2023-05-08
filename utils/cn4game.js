const { createCanvas } = require("canvas");
const { getCanvasHead, getCanvasFooter } = require("./cvsdecorators");
const { getChipColor } = require("./chips");
const { getUsername } = require("./client");
const { changeBalance } = require("./currency");
const { CvsBundler } = require("./cvsbundler");
const { getDeckColor } = require("./deckcolor");
const emojis = require('../emojis.json');
const { ongoing_games } = require("./games");
const { getPrefix } = require("./getprefix");
const { assets } = require("./images");
const { send, sendBoth } = require("./sender");
const { addToStat } = require("./stats");

// Creates a 2D array with any width & height and fills it with 0
function array2D(width, height) {
    return Array(height).fill(0).map(()=>Array(width).fill(0));
}
exports.array2D = array2D;

function drawCn4Game(field, color1, color2, swap) {
    // Chips are 64x64 and the field is 7x6
    const s = 64;
    const cvs = createCanvas(7 * s, 6 * s);
    const ctx = cvs.getContext('2d');

    // Depending on whose turn it is, these have to swap
    let colors = [color1, color2]
    if (swap) {
        colors = colors.reverse();
    }

    // Loop through the connect 4 game field
    for (let y = 0; y < field.length; y ++) {
        for (let x = 0; x < field[y].length; x ++) {
            if (field[y][x] > 0) {
                // Draw chip
                const chipImg = colors[field[y][x] - 1];
                ctx.drawImage(assets[chipImg], x * s, y * s);
            }
            // Always draw the overlay regardless of whether a chip is in or not
            ctx.drawImage(assets['connectoverlay'], x * s, y * s);
        }
    }

    return cvs;
}

function checkWinner(f) {
    let still_free_space = false;

    // Vertical lines
    for (let y = 0; y < 3; y ++) {
        for (let x = 0; x < 7; x ++) {
            if (f[y][x] != 0) {
                if (f[y][x] == f[y + 1][x] && f[y + 1][x] == f[y + 2][x] && f[y + 2][x] == f[y + 3][x]) {
                    return f[y][x];
                }
            } else {
                still_free_space = true;
            }
        }
    }

    // Horizontal lines
    for (let y = 0; y < 6; y ++) {
        for (let x = 0; x < 4; x ++) {
            if (f[y][x] != 0) {
                if (f[y][x] == f[y][x + 1] && f[y][x + 1] == f[y][x + 2] && f[y][x + 2] == f[y][x + 3]) {
                    return f[y][x];
                }
            } else {
                still_free_space = true;
            }
        }
    }

    // Diagonally left lines
    for (let y = 0; y < 3; y ++) {
        for (let x = 0; x < 4; x ++) {
            if (f[y][x] != 0) {
                if (f[y][x] == f[y + 1][x + 1] && f[y + 1][x + 1] == f[y + 2][x + 2] && f[y + 2][x + 2] == f[y + 3][x + 3]) {
                    return f[y][x];
                }
            } else {
                still_free_space = true;
            }
        }
    }

    // Diagonally right lines
    for (let y = 0; y < 3; y ++) {
        for (let x = 0; x < 4; x ++) {
            if (f[y][x + 3] != 0) {
                if (f[y + 3][x] == f[y + 2][x + 1] && f[y + 2][x + 1] == f[y + 1][x + 2] && f[y + 1][x + 2] == f[y][x + 3]) {
                    return f[y][x + 3];
                }
            } else {
                still_free_space = true;
            }
        }
    }

    // Tie if there's no more free space
    if (!still_free_space) {
        return 'Tie'
    }

    // Game keeps going
    return false;
}

function postUpdate(game, message) {
    const player1 = game.state.opponent;
    const ogame = ongoing_games[player1];
    const player2 = ogame.state.opponent;
    const swapped = (game.state.turn == 1);

    // Default chip colors if players haven't bought a custom one
    let default_colors = ['chipred', 'chipblue'];

    // Depending on whose turn it is, the defaults swap
    if (swapped) {
        default_colors = default_colors.reverse();
    }

    // Whoevers turn it is now has their deck and prefix displayed
    getPrefix(player1).then((prefix) => {
		getDeckColor(player1).then((color) => {

            // Get both players' chips or default
            getChipColor(player1).then((chipcolor1) => {
                if (!chipcolor1 || chipcolor1 == '' || chipcolor1 == 'chipnormal') {
                    chipcolor1 = default_colors[0];
                }
                getChipColor(player2).then((chipcolor2) => {
                    if (!chipcolor2 || chipcolor2 == '' || chipcolor2 == 'chipnormal') {
                        chipcolor2 = default_colors[1];
                    }
                    
                    // Draw the ongoing game
                    const cvs = new CvsBundler(5);

                    cvs.add(getCanvasHead(448, `${getUsername(player1)} vs. ${getUsername(player2)}`, color));

                    cvs.add(drawCn4Game(game.state.field, chipcolor1, chipcolor2, swapped));

                    cvs.add(getCanvasFooter(448, `ex: ${prefix}put 1`, color));

                    // Check if there's a winner
                    const winner = checkWinner(game.state.field);
                    if (winner != false) {
                        const bet = game.state.bet;
                        if (winner == 'Tie') {
                            // Give the two players their bet back
                            changeBalance(game.state.playerid, bet);
                            changeBalance(ogame.state.playerid, bet);

                            sendBoth(message, `You both tied! **+0** ${emojis.diamond}`, cvs.draw());
                        } else {
                            // Concrete winner
                            const winner_id = (player1 == winner ? player1 : player2);
                            const loser_id = (player1 == winner ? player2 : player1);
            
                            sendBoth(message, `<@${winner_id}> won **+${bet}** ${emojis.diamond}`, cvs.draw());
            
                            changeBalance(winner_id, bet * 2);

                            if (Math.random() > 0.6) {
                                changeChests(winner_id, 1, 'blue');
                                send(message, `<@${winner_id}> got lucky and received **1 Blue Chest** ${emojis.bluechest}`);
                            }
            
                            // Statistics for winner
                            addToStat('connect4dwon', winner_id, bet).then(() => {
                                addToStat('connect4won', winner_id, 1).then(() => {
                                    // Statistics for loser
                                    addToStat('connect4dlost', loser_id, bet).then(() => {
                                        addToStat('connect4lost', loser_id, 1);
                                    })
                                })
                            })
                        }

                        // Remove the game from ongoing games
                        delete ongoing_games[player1];
                        delete ongoing_games[player2];
                    } else {
                        // Swap turn
                        const ogame = ongoing_games[game.state.opponent];

                        const new_turn = (game.state.turn == 1 ? 2 : 1);
                        game.state.turn = new_turn;
                        ogame.state.turn = new_turn;

                        sendBoth(message, `It's now <@${game.state.turn === game.state.playerid ? ogame.state.opponent : game.state.opponent}>'s turn.`, cvs.draw())
                    }
                })
            })
		})
	});
}
exports.postUpdate = postUpdate;

function startConnect4Game(message, player, opponent, betamount, playerid, field) {
	const game = {
		type: 'connect4',
		state: {
			field: field,
			bet: betamount,
			opponent: opponent,
            playerid: playerid,
            turn: 1
		}
	}
	ongoing_games[player] = game;

	return game;
}
exports.startConnect4Game = startConnect4Game;