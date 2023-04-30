const sqlite3 = require('sqlite3').verbose();
const settings = require('../settings.json');

// Connect to the SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the users database.');
});

// Create the "users" table if it doesn't exist
db.run(`
CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY,
	balance INTEGER DEFAULT 0
)
`);

// Create the "dailies" table if it doesn't exist
db.run(`
CREATE TABLE IF NOT EXISTS dailies (
	id TEXT PRIMARY KEY,
	last INTEGER DEFAULT 0
)
`);

// Create the "prefix" table if it doesn't exist
db.run(`
CREATE TABLE IF NOT EXISTS prefix (
	id TEXT PRIMARY KEY,
	prefix TEXT DEFAULT "${settings.prefix}"
)
`);

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
