import {createDbInstance} from"../src/db/db"
const db = await createDbInstance()
test("Should return db for test env", () => {
  const clientName =  db.client.config.client;
  expect(clientName).toBe('sqlite3');
});

