const db = require("../src/db/db")

beforeAll(async () => {
  await db.raw(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    );
  `);
});

test("Should return db for test env", () => {
  const clientName =  db.client.config.client;
  expect(clientName).toBe('sqlite3');
});

