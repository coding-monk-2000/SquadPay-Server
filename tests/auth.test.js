import request from "supertest";
import { jest } from "@jest/globals";
import express from "express";
import authRoutes from "../src/routes/authRoutes.js";
import jwt from "jsonwebtoken";
import db from "../src/db/db.js";

const app = express();
app.use(express.json()); 


app.use((req, _res, next) => {
    req.db = db;
    next();
});

app.use("/api/auth", authRoutes);


const SECRET_KEY = "your_secret_key";

test("Should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "securepassword",
        email: "r@bt.com"
    });

    expect(response.status).toBe(201);;
    expect(response.body).toHaveProperty("token");
});

test("Should fail registration if username already exists", async () => {
    const response = await request(app).post("/api/auth/register").send({
        username: "testuser",
        password: "securepassword",
        email: "r@bt.com"
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
});


test("Should fail login with incorrect password", async () => {
    const response = await request(app).post("/api/auth/login").send({
        email: "r@bt.com",
        password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
});

test("Should pass login with correct password", async () => {
    const response = await request(app).post("/api/auth/login").send({
        email: "r@bt.com",
        password: "securepassword",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
});

test("Should fail login with db error", async () => {
    const app = express();
    app.use(express.json()); 

    const db = jest.fn()
    app.use((req, _res, next) => {
      req.db = db;
      next();
     });

    app.use("/api/auth", authRoutes);
      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "securepassword",
     });

    expect(response.status).toBe(500);
});



test("Should allow access to protected route with valid token", async () => {
    const validToken = jwt.sign({ userId: 1 }, SECRET_KEY, { expiresIn: "1h" });

    const response = await request(app)
        .get("/api/auth/protected")
        .set("Authorization", `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
});

test("Should deny access to protected route without token", async () => {
    const response = await request(app).get("/api/auth/protected");
    expect(response.status).toBe(401);
});

test("Should deny access to protected route with error", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
            throw new Error("Invalid token");
        });
    const response = await request(app).get("/api/auth/protected").set("Authorization", `Bearer NOTVALIDTOKEN`);
    expect(response.status).toBe(403);
});
