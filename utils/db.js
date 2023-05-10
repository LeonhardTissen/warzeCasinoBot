const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
	if (err) {
		console.error(err.message);
	}
});

function createDatabaseTable(tablename, column) {
	db.run(`
CREATE TABLE IF NOT EXISTS ${tablename} (
	id TEXT PRIMARY KEY,
	${column.name} ${column.type} DEFAULT ${column.default}
)
`);
}

// Marketplace
db.run(`
CREATE TABLE IF NOT EXISTS marketplace (
	id TEXT PRIMARY KEY,
	seller TEXT,
	itemamount INTEGER,
	type TEXT,
	bidamount INTEGER,
	highestbidder TEXT,
	startedat INTEGER	
)
`)

// Create database tables if they don't exist yet
createDatabaseTable('users', {name: 'balance', type: 'INTEGER', default: '0'})

createDatabaseTable('weeklies', {name: 'last', type: 'INTEGER', default: '0'})
createDatabaseTable('dailies', {name: 'last', type: 'INTEGER', default: '0'})
createDatabaseTable('hourlies', {name: 'last', type: 'INTEGER', default: '0'})

createDatabaseTable('shop', {name: 'bought', type: 'TEXT', default: '""'})
createDatabaseTable('customcard', {name: 'owned', type: 'TEXT', default: '""'})
createDatabaseTable('customdeck', {name: 'owned', type: 'TEXT', default: '""'})
createDatabaseTable('cascard', {name: 'cardtype', type: 'TEXT', default: '""'})
createDatabaseTable('casdeck', {name: 'decktype', type: 'TEXT', default: '""'})
createDatabaseTable('caschip', {name: 'chiptype', type: 'TEXT', default: '""'})

createDatabaseTable('rewardnotify', {name: 'notify', type: 'INTEGER', default: '0'})
createDatabaseTable('settings', {name: 'settings', type: 'TEXT', default: '""'})

// Chests
createDatabaseTable('redchest', {name: 'redchest', type: 'INTEGER', default: '0'})
// createDatabaseTable('orangechest', {name: 'orangechest', type: 'INTEGER', default: '0'})
// createDatabaseTable('yellowchest', {name: 'yellowchest', type: 'INTEGER', default: '0'})
// createDatabaseTable('greenchest', {name: 'greenchest', type: 'INTEGER', default: '0'})
// createDatabaseTable('cyanchest', {name: 'cyanchest', type: 'INTEGER', default: '0'})
createDatabaseTable('bluechest', {name: 'bluechest', type: 'INTEGER', default: '0'})
// createDatabaseTable('magentachest', {name: 'magentachest', type: 'INTEGER', default: '0'})
createDatabaseTable('goldenchest', {name: 'goldenchest', type: 'INTEGER', default: '0'})
// createDatabaseTable('wartchest', {name: 'wartchest', type: 'INTEGER', default: '0'})

// Dummy stat
createDatabaseTable('statsdummy', {name: 'dummy', type: 'INTEGER', default: '0'})

// Casino 2 stats
createDatabaseTable('statscasino2won', {name: 'casino2won', type: 'INTEGER', default: '0'})
createDatabaseTable('statscasino2lost', {name: 'casino2lost', type: 'INTEGER', default: '0'})
createDatabaseTable('statscasino2dwon', {name: 'casino2dwon', type: 'INTEGER', default: '0'})
createDatabaseTable('statscasino2dlost', {name: 'casino2dlost', type: 'INTEGER', default: '0'})

// Coinflip stats
createDatabaseTable('statscfwon', {name: 'cfwon', type: 'INTEGER', default: '0'})
createDatabaseTable('statscflost', {name: 'cflost', type: 'INTEGER', default: '0'})
createDatabaseTable('statscfdwon', {name: 'cfdwon', type: 'INTEGER', default: '0'})
createDatabaseTable('statscfdlost', {name: 'cfdlost', type: 'INTEGER', default: '0'})

// Coinflip stats
createDatabaseTable('statsconnect4won', {name: 'connect4won', type: 'INTEGER', default: '0'})
createDatabaseTable('statsconnect4lost', {name: 'connect4lost', type: 'INTEGER', default: '0'})
createDatabaseTable('statsconnect4dwon', {name: 'connect4dwon', type: 'INTEGER', default: '0'})
createDatabaseTable('statsconnect4dlost', {name: 'connect4dlost', type: 'INTEGER', default: '0'})

// Lottery stats
createDatabaseTable('statslotterywon', {name: 'lotterywon', type: 'INTEGER', default: '0'})
createDatabaseTable('statslotterydwon', {name: 'lotterydwon', type: 'INTEGER', default: '0'})
createDatabaseTable('statslotterytickets', {name: 'lotterytickets', type: 'INTEGER', default: '0'})

exports.db = db;

function createRowIfNotExists(user, table) {
	// Create a user entry if not exists
	db.run(`INSERT OR IGNORE INTO ${table} (id) VALUES (?)`, [user], (err) => {
		if (err) {
			console.log("Error while inserting: " + err.message);
			return;
		}
	});
}
exports.createRowIfNotExists = createRowIfNotExists;
