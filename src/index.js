import {ChannelType, Hop} from "@onehop/js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const projectToken = "ptk_c181NDNlZGUzZGM2ZmM1YTcxYzM0MWRkOGYyZTlkYzE2N181MDM4MTc3OTIyNjUzMzkxMw";
export const hop = new Hop(projectToken)

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
