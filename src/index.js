import {ChannelType, Hop} from "@onehop/js";
import {WebSocketServer} from "ws";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {uuid} from "uuidv4";
import * as url from "url";

const projectToken = "ptk_c181NDNlZGUzZGM2ZmM1YTcxYzM0MWRkOGYyZTlkYzE2N181MDM4MTc3OTIyNjUzMzkxMw";
export const hop = new Hop(projectToken)

const app = express();
const server = http.createServer();
const wss = new WebSocketServer({server: server});
const idMap = new Map();

server.on("request", app);
wss.on("connection", (ws, req) => {
    console.log("Client connected");
    const parameters = url.parse(req.url, true);
    let id = {id: parameters.query.id};
    console.log("ID:", id);

    ws.on("message", (message) => {
        console.log("Received:", message);

        ws.send(JSON.stringify({
            title: "Send message"
        }));
    });
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

    res.send(
        {
            title: "Channel created",
            channelId: channel.id
        }
    );
});



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
