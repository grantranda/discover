import {ChannelType, Hop} from "@onehop/js";
import {WebSocketServer} from "ws";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as url from "url";

class Session {
    channelId;
    clientIds = [];

    constructor(channelId) {
        this.channelId = channelId;
    }

    addClient(clientId) {
        this.clientIds.push(clientId);
        console.log("Client added:", clientId);
    }

    removeClient(clientId) {
        const index = this.clientIds.indexOf(clientId);
        if (index > -1) {
            this.clientIds.splice(index, 1);
            console.log("Client removed:", clientId);

            if (this.clientIds.length <= 0) {
                // TODO: Delete channel
            }
        }
    }
}

const projectToken = "ptk_c181NDNlZGUzZGM2ZmM1YTcxYzM0MWRkOGYyZTlkYzE2N181MDM4MTc3OTIyNjUzMzkxMw";
export const hop = new Hop(projectToken)

const app = express();
const server = http.createServer();
const wss = new WebSocketServer({server: server});
const sessions = new Map();

function joinSession(clientId, channelId, ws) {
    console.log("Client ID:", clientId);
    console.log("Channel ID:", channelId);

    let session = sessions.get(channelId);
    console.log(sessions);
    console.log(session);
    if (session !== undefined) {
        session.addClient(clientId);

        ws.send(JSON.stringify({
            title: "Session joined"
        }));
    } else {
        ws.send(JSON.stringify({
            title: "Unable to join session"
        }));
    }
}

server.on("request", app);
wss.on("connection", (ws, req) => {
    console.log("Client connected");
    // const parameters = url.parse(req.url, true);
    // let id = {id: parameters.query.id};
    // console.log("ID:", id);

    ws.on("message", (message) => {
        console.log("Received:", message);

        ws.send(JSON.stringify({
            title: "Send message"
        }));
    });

    const location = url.parse(req.url, true);

    switch (location.pathname) {
        case "/multiplayer/join":
            const parameters = url.parse(req.url, true);
            let clientId = {clientId: parameters.query.clientId}.clientId;
            let channelId = {channelId: parameters.query.channelId}.channelId;
            joinSession(clientId, channelId, ws);
            break;
        default:
            break;
    }
    // console.log("Location:", location);
});

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

const ads = [
    {title: "Hello world!"}
];
app.get("/", (req, res) => {
    res.send(ads);
});

app.get("/multiplayer/create", async (req, res) => {
    const channel = await hop.channels.create(ChannelType.UNPROTECTED)
    let session = new Session(channel.id);
    sessions.set(channel.id, session);
    console.log(sessions)

    res.send(
        {
            title: "Session created",
            channelId: channel.id
        }
    );
});

// app.get("/multiplayer/join", async (req, res) => {
//     const parameters = url.parse(req.url, true);
//     let clientId = {clientId: parameters.query.clientId};
//     let channelId = {channelId: parameters.query.channelId};
//     console.log("Client ID:", clientId);
//     console.log("Channel ID:", channelId);
//
//     let session = sessions.get(channelId);
//     if (session !== undefined) {
//         session.addClient(clientId);
//
//         res.send({
//             title: "Session joined"
//         });
//     } else {
//         res.send({
//             title: "Unable to join session"
//         });
//     }
// });

// app.get("/multiplayer/join", (req, res) => {
//     // res.setHeader("Cache-Control", "no-cache");
//     // res.setHeader("Content-Type", "text/event-stream");
//     // res.setHeader("Access-Control-Allow-Origin", "*");
//     // res.setHeader("Connection", "keep-alive");
//     res.set({
//         "Content-Type": "text/event-stream",
//         "Cache-Control": "no-cache",
//         "Connection": "keep-alive",
//         "Access-Control-Allow-Origin": "*"
//     });
//     // res.flushHeaders();
//
//     res.write("title: Join")
//     // res.on("", () => {
//     //     console.log("Connection opened");
//     // });
//     res.on("close", () => {
//         console.log("Connection closed");
//         res.end();
//     });
//
//     // res.write(`title: ${JSON.stringify("Joined")}`)
//
//     // while (true) {
//     //     // await new Promise(resolve => setTimeout(resolve, 1000))
//     //     res.write(JSON.stringify([
//     //         {
//     //             title: "Multiplayer - Join"
//     //         }
//     //     ]));
//     // }
// });

server.listen(3001, "0.0.0.0", 511, () => {
    console.log("Listening on port 3001");
});
// app.listen(3001, "0.0.0.0", 511, () => {
//     console.log("Listening on port 3001");
// });
