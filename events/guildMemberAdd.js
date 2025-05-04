const { WelcomeLeave } = require('canvafy');
const Guild = require('../model/guild');

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
        return color;
}

function isValidImageURL(url) {
    try {
        new URL(url);
        return url.match(/\.(jpeg|jpg|png|gif)$/) !== null;
    } catch (error) {
        return false;
    }
}

module.exports = {
    name: 'guildMemberAdd',

    async execute(member) {
        try {
            const WelcomeGuild = await Guild.findOne({ 
                where: { id: member.guild.id } 
            });

            if (!WelcomeGuild) return;

            if (WelcomeGuild.welcomeRoleId) {
                const welcomeRole = await member.guild.roles.fetch(WelcomeGuild.welcomeRoleId);
                if (welcomeRole) await member.roles.add(welcomeRole).catch(console.error);
            }

            if (!WelcomeGuild.welcomeChannelId) return;

            const borderColor = getRandomColor();
            const avatarBorderColor = getRandomColor();
            let backgroundType = 'color';
            let backgroundValue = getRandomColor();

            if (WelcomeGuild.welcomeBackground && isValidImageURL(WelcomeGuild.welcomeBackground)) {
                backgroundType = 'image';
                backgroundValue = WelcomeGuild.welcomeBackground;
            }

            const memberCount = member.guild.memberCount;
            let suffix = 'th';
            const specialCases = [11, 12, 13];
            if (!specialCases.includes(memberCount % 100)) {
                switch (memberCount % 10) {
                    case 1: suffix = 'st'; break;
                    case 2: suffix = 'nd'; break;
                    case 3: suffix = 'rd'; break;
                }
            }

            const welcome = await new WelcomeLeave()
                .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }))
                .setBackground(backgroundType, backgroundValue)
                .setTitle('Welcome!')
                .setDescription(`Glad you're here ${member.user.username}! You're the ${memberCount}${suffix} member.`)
                .setBorder(borderColor)
                .setAvatarBorder(avatarBorderColor)
                .setOverlayOpacity(0.3)
                .build();

            const welcomeChannel = await member.guild.channels.fetch(WelcomeGuild.welcomeChannelId).catch(console.error);
            if (welcomeChannel) {
                await welcomeChannel.send({
                    content: `Hi ${member.user.username}, Welcome to ${member.guild.name}!`,
                    files: [{ attachment: welcome, name: `welcome-${member.id}.png` }]
                }).catch(console.error);
            }

        } catch (error) {
            console.error('Error in guildMemberAdd event:', error);
        }
    }
}