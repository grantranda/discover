import {hop} from ".";
import {ChannelType} from "@onehop/js";

const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")

const app = express();
const ads = [
    {title: "Hello world!"}
];

console.log("Server started")

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.get("/", (req, res) => {
    res.send(ads);
});

app.get("/multiplayer/create", async (req, res) => {
    const channel = await hop.channels.create(ChannelType.UNPROTECTED)

    res.send([
        {
            title: "Multiplayer - Create",
            channelId: channel.id
        }
    ]);
});

app.listen(3001, "0.0.0.0", 511, () => {
    console.log("Listening on port 3001");
});
