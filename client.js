import { hop } from ".";

const channelId = "channel_NTAzODYxNTgwMjY2NDE0MjM";

function publishMessage() {
    hop.channels.publishMessage(
        channelId,
        "MESSAGE_CREATE",
        {
            content: "Test Message",
            author_name: "Grant"
        }
    );
}

function updateState() {
    hop.channels.setState(
        channelId,
        s => ({ ...s, name: "Channel Name"})
    );
}
