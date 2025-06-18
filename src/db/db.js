const environment = process.env.NODE_ENV;

const config = require('./knexfile')[environment];
const knex = require('knex')(config);


(async () => {
    await knex.raw(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
      )
    `);
    console.log('Users table ready.');
})();

module.exports = knex;



