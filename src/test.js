import request from "request";
// const request = require("request")

// request("https://solve.hop.sh", {json: true}, (err, res, body) => {
//     if (err) { return console.log(err); }
//     console.log(res.body)
//
// });

// request("https://solve.hop.sh/multiplayer/join", {json: true}, (err, res, body) => {
//     if (err) { return console.log(err); }
//     console.log(res.body)
//
// });

import EventSource from "eventsource";
// const source = new EventSource("https://solve.hop.sh/multiplayer/join");

// source.addEventListener("message", message => {
//     console.log("Got", message);
// });
//
// source.addEventListener("open", message => {
//     console.log("Got", message);
// });

import {WebSocket} from "ws";
import {v4} from "uuid";

const id = v4();
const client = new WebSocket(`wss://solve.hop.sh/multiplayer/join?id=${id}`);

client.onopen = () => {
    console.log("Socket opened")
    client.send("Hello");
};

client.onmessage = (e) => {
    console.log("Received:", e.data);
};

client.onclose = (e) => {
    console.log("Socket closed:", e.reason);
};

client.onerror = (err) => {
    console.log("Socket error:", err.message);
    client.close();
};
