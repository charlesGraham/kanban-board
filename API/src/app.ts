import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer); // for websocket requests

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("API is up");
});

app.post("/api/users", usersController.register);
app.post("/api/login", usersController.login);

io.on("connection", () => {
    console.log("Connected!");
});

mongoose.connect(`mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@localhost:27017/`)
    .then(() => {
        console.log("Connected to MongoDB!");
        httpServer.listen(4001, () => {
            console.log(`App is listening on port 4001`);
        });
    });