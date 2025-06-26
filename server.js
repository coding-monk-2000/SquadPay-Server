import "./src/config.js";
import jwt from "jsonwebtoken";
import express from "express";
import router from "./src/routes/authRoutes.js";
import { createDbInstance } from "./src/db/db.js";
import {ApolloServer} from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors'
import {typeDefs} from "./src/graphql/schema.js"
import {resolvers} from "./src/graphql/resolvers.js"

const app = express();

app.use(express.json());
const db = await createDbInstance()
app.use((req, _res, next) => {
    req.db = db;
    next();
});

app.use("/api/auth", router);

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql', cors(),
    expressMiddleware(server , {
        context: async ({req}) => {
            try {
              const token = req.headers.authorization?.replace("Bearer ", "");
              const {userId} = jwt.verify(token, process.env.SECRET_KEY)
              return { userId, db};
            } catch (error) {
              throw new Error("Unauthorized");
            }
        }
    })
  )

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});