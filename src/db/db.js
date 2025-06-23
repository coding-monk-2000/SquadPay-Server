import knexfile from "./knexfile.js";
import knexLib from "knex";

const environment = process.env.NODE_ENV;
const config = knexfile[environment];
const knex = knexLib(config);

(async () => {
    await knex.raw(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
      )
    `);
    console.log("Users table ready.");
})();

export default knex;





