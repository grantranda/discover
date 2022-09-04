import {ChannelType, Hop} from "@onehop/js";
import {WebSocketServer} from "ws";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as url from "url";

const projectToken = "ptk_c181NDNlZGUzZGM2ZmM1YTcxYzM0MWRkOGYyZTlkYzE2N181MDM4MTc3OTIyNjUzMzkxMw";
export const hop = new Hop(projectToken)
const app = express();
const server = http.createServer();
const wss = new WebSocketServer({server: server});
const sessions = new Map();
const clients = new Map();

wss.broadcast = function(data, sender) {
    wss.clients.forEach(function(client) {
        // if (client !== sender) {
        client.send(data);
        // }
    })
};

class Session {
    channelId;
    hostId;
    clientIds = [];

    constructor(channelId, hostId) {
        this.channelId = channelId;
        this.hostId = hostId;
        this.addClient(hostId);
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
        }
    }

    startGame() {
        let host = clients.get(this.hostId);
        console.log("Host ID:", this.hostId);
        console.log("Host:", host);
        if (host !== undefined) {
            wss.broadcast("start", host);
        }
    }
}

function joinSession(clientId, channelId, ws) {
    console.log("Attempting to join session...")
    console.log("\tClient ID:", clientId);
    console.log("\tChannel ID:", channelId);

    let session = sessions.get(channelId);
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
    const parameters = url.parse(req.url, true);
    let clientId = parameters.query.clientId;
    let channelId = parameters.query.channelId;

    clients.set(clientId, ws);

    ws.on("message", (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        console.log("Received:", message);

        switch (message) {
            case "start":
                console.log("Starting game");
                let session = sessions.get(channelId);
                console.log("Channel ID:", channelId);
                console.log("Session:", session)
                if (session !== undefined) {
                    session.startGame();
                }
                break;
            default:
                break;
        }
    });

    const location = url.parse(req.url, true);

    switch (location.pathname) {
        case "/multiplayer/join":
            joinSession(clientId, channelId, ws);
            break;
        default:
            break;
    }
});

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.send({title: "Test"});
});
app.get("/multiplayer/create", async (req, res) => {
    const channel = await hop.channels.create(ChannelType.UNPROTECTED)
    const parameters = url.parse(req.url, true);
    let session = new Session(channel.id, parameters.query.hostId);
    sessions.set(channel.id, session);

    res.send(
        {
            title: "Session created",
            channelId: channel.id
        }
    );
});

server.listen(3001, "0.0.0.0", 511, () => {
    console.log("Listening on port 3001");
});
