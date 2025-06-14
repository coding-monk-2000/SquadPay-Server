const sqlite3 = require("sqlite3").verbose();

exports.initDb = (test = false) => {
  const  db = new sqlite3.Database(test ? ":memory:" : "./auth.db");

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT
)`);
return db
}