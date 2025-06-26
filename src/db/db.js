import knexfile from "./knexfile.js";
import knexLib from "knex";

const initSchema = async (db) => {
  await db.schema.hasTable("users").then((exists) => {
    if (!exists) {
      return db.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("email").unique().notNullable();
        table.string("password").notNullable();
        table.string("username").notNullable();
        table.timestamps(true, true);
      });
    }
  });

  await db.schema.hasTable("organizations").then((exists) => {
    if (!exists) {
      return db.schema.createTable("organizations", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.timestamps(true, true);
      });
    }
  });

  await db.schema.hasTable("user_organizations").then((exists) => {
    if (!exists) {
      return db.schema.createTable("user_organizations", (table) => {
        table.increments("id").primary();
        table
          .integer("user_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("organization_id")
          .unsigned()
          .notNullable()
          .references("id")
          .inTable("organizations")
          .onDelete("CASCADE");
        table.string("role").notNullable();
        table.timestamps(true, true);
        table.unique(["user_id", "organization_id"]);
      });
    }
  });
};

export const createDbInstance = async () => {
  const environment = process.env.NODE_ENV;
  const config = knexfile[environment];
  const db = knexLib(config);
  await initSchema(db);
  return db;
};
