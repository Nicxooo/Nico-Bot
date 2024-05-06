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
				name: '/help',
				type: ActivityType.Streaming,
				url: 'https://www.twitch.tv/spicyuuu'
			}],
			status: 'idle'
		});
	}
}

async function activity() {
	RPC.setActivity({
		details: "Wandering the void",
		state: 'Ultimate Duo',
		largeImageKey: 'https://w0.peakpx.com/wallpaper/321/59/HD-wallpaper-purple-face-color-colorful-cute-emoji-emotion-eyes-glad-happy-kor4-rts-lokscreen-look-simple-smile.jpg',
		largeImageText: 'Demon Lord',
		smallImageKey: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/640px-Twitter_Verified_Badge.svg.png',
		smallImageText: 'Level 101',
        partyMax: 2,
        partySize: 2,
		instance: false,
		startTimestamp: Date.now(),
        buttons: [
            {
                label: 'Join the team!',
                url: 'https://www.investopedia.com/articles/investing/012715/5-richest-people-world.asp'
            }
        ]
	})
}

RPC.on('ready', async () => {
	activity();
})

RPC.login({ clientId: clientId });