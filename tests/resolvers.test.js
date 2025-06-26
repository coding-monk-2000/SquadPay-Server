
import request from "supertest";
import express from "express";
import {createDbInstance} from "../src/db/db.js"
import {ApolloServer} from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4";
import cors from 'cors'
import {typeDefs} from "../src/graphql/schema.js"
import {resolvers} from "../src/graphql/resolvers.js"

const app = express();

app.use(express.json());

const db = await createDbInstance()
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
              return { userId:"1", db};
            } catch (error) {
              throw new Error("Unauthorized");
            }
        }
    })
  )



test("should create an org an assign the user to it", async () => {
    await db("users")
      .insert({ email:"r@bt.com", username: "username", password: "password" });
    const mutation = `
      mutation {
        createOrganization(name: "Test_Org") {
          id
          name
        }
      }
    `;

    const response = await request(app)
        .post("/graphql")
        .send({ query: mutation });
    expect(response.body).toEqual({"data": {"createOrganization": {"id": "1", "name": "Test_Org"}}}); 
})

test("should list orgs", async () => {
    const query = `
      query {
    organizations{
        id name
    }
}
    `;

    const response = await request(app)
        .post("/graphql")
        .send({ query });
    expect(response.body).toEqual({"data": {"organizations": [{"id": "1", "name": "Test_Org"}]}}); 
})