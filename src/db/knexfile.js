module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './auth.db'
    },
    useNullAsDefault: true
  },
test:{client: 'sqlite3',
    connection: {
      filename: ':memory:'
    }},
  production: {
    client: 'pg',
    connection: {
      host: process.env.HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    }
  }
};
