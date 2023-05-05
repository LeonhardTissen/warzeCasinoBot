const { createCanvas } = require("canvas");
const { getCanvasHead, getCanvasFooter } = require("./canvashead");
const { getUsername } = require("./client");
const { changeBalance } = require("./currency");
const { CvsBundler } = require("./cvsbundler");
const { getDeckColor } = require("./deckcolor");
const { emojis } = require("./emojis");
const { ongoing_games } = require("./games");
const { getPrefix } = require("./getprefix");
const { assets } = require("./images");
const { send } = require("./sender");
const { addToStat } = require("./stats");

function array2D(width, height) {
    return Array(height).fill(0).map(()=>Array(width).fill(0));
}
exports.array2D = array2D;

function drawCn4Game(field) {
    const s = 64;
    const cvs = createCanvas(7 * s, 6 * s);
    const ctx = cvs.getContext('2d');

    for (let y = 0; y < field.length; y ++) {
        for (let x = 0; x < field[y].length; x ++) {
            if (field[y][x] > 0) {
                ctx.fillStyle = ['red','blue'][field[y][x] - 1];
                ctx.fillRect(x * s, y * s, s, s)
            }
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

    return false;
}

function postUpdate(game, message) {
    getPrefix(game.state.opponent).then((prefix) => {
		getDeckColor(game.state.opponent).then((color) => {
			const cvs = new CvsBundler(5);

            const ogame = ongoing_games[game.state.opponent];
			cvs.add(getCanvasHead(448, `${getUsername(game.state.opponent)} vs. ${getUsername(ogame.state.opponent)}`, color));

			cvs.add(drawCn4Game(game.state.field));

			cvs.add(getCanvasFooter(448, `ex: ${prefix}put 1`, color));

			cvs.send(message);

            // Check if there's a winner
            const winner = checkWinner(game.state.field);
            if (winner != false) {
                const bet = game.state.bet;
                if (winner == 'Tie') {
                    // Give the two players their bet back
                    changeBalance(game.state.playerid, bet);
                    changeBalance(ogame.state.playerid, bet);

                    send(message, `You both tied! **+0** ${emojis.diamond}`);
                } else {
                    // Concrete winner
                    const winner_id = (game.state.playerid == winner ? ogame.state.opponent : game.state.opponent);
                    const loser_id = (game.state.playerid == winner ? game.state.opponent : ogame.state.opponent);
    
                    send(message, `<@${winner_id}> won **+${bet}** ${emojis.diamond}`);
    
                    changeBalance(winner_id, bet * 2);
    
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
				delete ongoing_games[game.state.opponent];
				delete ongoing_games[ogame.state.opponent];
            } else {
                toggleTurn(game, message);
            }
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

function toggleTurn(game, message) {
    const ogame = ongoing_games[game.state.opponent];

    const new_turn = (game.state.turn == 1 ? 2 : 1);
    game.state.turn = new_turn;
    ogame.state.turn = new_turn;

    send(message, `It's now <@${game.state.turn === game.state.playerid ? ogame.state.opponent : game.state.opponent}>'s turn.`)
}