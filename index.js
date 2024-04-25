const { token, clientId } = require('./config.json');
const { Client, Events, GatewayIntentBits, ActivityType, Collection, SlashCommandAssertions, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const DiscordRPC = require('discord-rpc');
const RPC = new DiscordRPC.Client({ transport: 'ipc' });
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

DiscordRPC.register(clientId);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

async function activity() {
	RPC.setActivity({
		details: "Wandering the void",
		state: 'Playing Duos',
		largeImageKey: 'https://cdn.discordapp.com/avatars/1232674775416049706/3cf9a05becf12e0ee85728c59d01d84c.webp', // largeImageKey: 'https://cdn.discordapp.com/avatars/378527149495156736/caf00eff212fb49da8e493b610b0d895.webp?size=128',
		largeImageText: 'Nico Bot',
		smallImageKey: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/640px-Twitter_Verified_Badge.svg.png',
		smallImageText: 'Rogue - Level 100',
        partyMax: 2,
        partySize: 2,
		instance: false,
		startTimestamp: Date.now(),
        buttons: [
            {
                label: 'No clicking',
                url: 'https://matias.ma/nsfw/'
            }
        ]
	})
}

RPC.on('ready', async () => {
	activity();
})

RPC.login({ clientId: clientId });
client.login(token);