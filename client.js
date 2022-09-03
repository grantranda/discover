import { hop } from ".";

const channelId = "channel_NTAzODYxNTgwMjY2NDE0MjM";

hop.channels.publishMessage(
    channelId,
    "MESSAGE_CREATE",
    {
        content: "Test Message",
        author_name: "Grant"
    }
)
