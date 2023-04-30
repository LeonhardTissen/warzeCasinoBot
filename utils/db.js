const sqlite3 = require('sqlite3').verbose();
const settings = require('../settings.json');

// Connect to the SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the users database.');
});

function createDatabaseTable(tablename, column) {
	db.run(`
CREATE TABLE IF NOT EXISTS ${tablename} (
	id TEXT PRIMARY KEY,
	${column.name} ${column.type} DEFAULT ${column.default}
)
`);
}

// Create database tables if they don't exist yet
createDatabaseTable('users', {name: 'balance', type: 'INTEGER', default: '0'})
createDatabaseTable('dailies', {name: 'last', type: 'INTEGER', default: '0'})
createDatabaseTable('prefix', {name: 'prefix', type: 'TEXT', default: `"${settings.prefix}"`})

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
