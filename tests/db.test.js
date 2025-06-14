const { initDb } = require("../src/db/db")

test("Should return in memory db", (done) => {
    const db = initDb(true)
    db.get("PRAGMA database_list;", (err, row) => {
        expect(row).toBeDefined();
        expect(row.file).toBe("");
        done();
    });
});

test("Should return DB with file name './auth.db'", (done) => {
    const db = initDb();

    db.all("PRAGMA database_list;", (err, rows) => {
        expect(rows).toBeDefined();
        expect(rows.length).toBeGreaterThan(0);

        const dbEntry = rows.find((entry) => entry.name === "main");
        expect(dbEntry.file).toContain("auth.db");

        done();
    });
});