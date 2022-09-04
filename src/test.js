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
