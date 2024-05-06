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

module.exports = {
    name: 'guildMemberAdd',

    async execute(member) {
        const WelcomeGuild = await Guild.findOne({ 
            where: {id: member.guild.id } 
        });

        if (!WelcomeGuild) return;

        if(WelcomeGuild.welcomeRoleId) {
            const welcomeRole = await member.guild.roles.fetch(WelcomeGuild.welcomeRoleId);
            await member.roles.add(welcomeRole);
        }

        const randomBorderColor = getRandomColor();
        const randomAvatarBorderColor = getRandomColor();
        
        if (WelcomeGuild.welcomeBackground !== null){
            if (member.guild.memberCount === 3) {
                const welcome = await new WelcomeLeave()
                    .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }))
                    .setBackground('image', WelcomeGuild.welcomeBackground)
                    .setTitle('Welcome!')
                    .setDescription(`Glad you're here ${member.user.username}! you are the ${member.guild.memberCount}rd Member.`)
                    .setBorder(randomBorderColor)
                    .setAvatarBorder(randomAvatarBorderColor)
                    .setOverlayOpacity(0.3)
                    .build();

                if(WelcomeGuild.welcomeChannelId) {
                    const welcomeChannel = await member.guild.channels.fetch(WelcomeGuild.welcomeChannelId);
                    welcomeChannel.send({ content: `Welcome to ${member.guild.id}!`, files: [{ attachment: welcome }]
                    })
                }
            }

            else {
                const lastDigit = member.guild.memberCount % 10;
                const suffix = 
                    lastDigit === 1 && member.guild.memberCount !== 11 ? 'st' : 
                    lastDigit === 2 && member.guild.memberCount !== 12 ? 'nd' : 
                    lastDigit === 3 && member.guild.memberCount !== 13 ? 'rd' : 'th';

                const welcome = await new WelcomeLeave()
                    .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }))
                    .setBackground('image', WelcomeGuild.welcomeBackground)
                    .setTitle('Welcome!')
                    .setDescription(`Glad you're here ${member.user.username}! you are the ${member.guild.memberCount}${suffix} Member.`)
                    .setBorder(randomBorderColor)
                    .setAvatarBorder(randomAvatarBorderColor)
                    .setOverlayOpacity(0.3)
                    .build();

                if(WelcomeGuild.welcomeChannelId) {
                    const welcomeChannel = await member.guild.channels.fetch(WelcomeGuild.welcomeChannelId);
                    welcomeChannel.send({ content: `Hi ${member.user.username}, Welcome to ${member.guild.name}!`, files: [{ attachment: welcome }]
                    })
                }
            }
        }

        else {
            if(WelcomeGuild.welcomeChannelId) {
                const welcomeChannel = await member.guild.channels.fetch(WelcomeGuild.welcomeChannelId);
                welcomeChannel.send({ content: `Hi ${member.user.username}, Welcome to ${member.guild.name}! Grab a drink :beer:`})
            }
        }
    }
}