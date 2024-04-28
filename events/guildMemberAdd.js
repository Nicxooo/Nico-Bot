const Guild = require('../model/guild');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const welcomeRole = await member.guild.roles.cache.find(role => role.name === 'memeber');
        await member.roles.add(welcomeRole);

        const WGuild = await Guild.findOne({ where: {id: member.guild.id } });
        if(!WGuild.welcomeChannelId) {
            await welcomeChannel.fetch(WGuild.welcomeChannelId);
            welcomeChannel.send(`Welcome to the server ${member.user} Grab a drink! :beers:`);
        }
    }
}