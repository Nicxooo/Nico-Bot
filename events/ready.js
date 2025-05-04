const { ActivityType } = require('discord.js');
const { clientId } = require('../config.json');
const DiscordRPC = require('discord-rpc');
const RPC = new DiscordRPC.Client({ transport: 'ipc' });

DiscordRPC.register(clientId);

module.exports = {
	name: 'ready',
	once: true,
	
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({
			activities: [{
				name: 'Le Sserafim',
				type: ActivityType.Watching,
				url: 'https://www.youtube.com/channel/UCs-QBT4qkj_YiQw1ZntDO3g'
			}],
			status: 'idle'
		});
	}
}

async function activity() {
	RPC.setActivity({
		details: "Lvl 22: Crashing out",
		state: 'Duo',
		largeImageKey: "https://cdn.discordapp.com/avatars/378527149495156736/afb7a9a7b2695dc0810e9ea231a004f6.webp?size=128",
		largeImageText: 'Poggers',
		smallImageKey: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/640px-Twitter_Verified_Badge.svg.png',
		smallImageText: 'Verified',
        partyMax: 2,
        partySize: 2,
		instance: false,
		startTimestamp: Date.now(),
        buttons: [
            {
                label: 'Website',
                url: 'https://www.lesserafim-imfearless.com/'
            }
        ]
	})
}

RPC.on('ready', async () => {
	activity();
})

RPC.login({ clientId: clientId });