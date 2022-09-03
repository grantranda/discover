import {Hop} from "@onehop/js";
import {hop} from "@onehop/client";

const channelId = "channel_NTAzODYxNTgwMjY2NDE0MjM";
const myToken = "ptk_c181NDNlZGUzZGM2ZmM1YTcxYzM0MWRkOGYyZTlkYzE2N181MDM4MTc3OTIyNjUzMzkxMw";
const hopServer = new Hop(myToken);
hopServer.channels.publishMessage(
    channelId,
    "MESSAGE_CREATE",
    {
        content: "Test Message",
        author_name: "Grant"
    }
)

// const projectId = "project_NTAzODA4NjA2NDA0MDM0Nzc";
//
// let project = hop.init({
//     projectId: projectId
// })
// project.subscribeToChannel()


// // Example: Creating a project secret
// hop.projects.secrets.create(
//     'RANDOM_NUMBER',
//     Math.floor(Math.random() * 100).toString(),
// );
