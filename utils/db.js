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

exports.db = db;