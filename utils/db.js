const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./currency.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the currency database.');
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

function createRowIfNotExists(user) {
	// Create a user entry if not exists
	db.run('INSERT OR IGNORE INTO users (id) VALUES (?)', [user], (err) => {
		if (err) {
			console.log(err.message);
			return;
		}
	});
}
exports.createRowIfNotExists = createRowIfNotExists;

exports.db = db;