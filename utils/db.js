const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('./users.db', (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the users database.');
});
exports.db = db;

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
