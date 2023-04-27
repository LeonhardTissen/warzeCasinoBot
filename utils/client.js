const { Client, GatewayIntentBits, ActivityType } = require("discord.js");

function createClient() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ]
    });
    
    // Event handler for when the bot is ready
    client.on('ready', () => {
        // Set bot's status to streaming
        client.user.setActivity({
            name: "on Warze.org",
            type: ActivityType.Streaming,
            url: "https://twitch.tv/warzedev",
        })
    
        console.log(`Logged in as ${client.user.tag}.`);
    });

    return client;
}
exports.createClient = createClient;