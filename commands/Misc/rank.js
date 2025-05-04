const { SlashCommandBuilder } = require('discord.js');
const { Rank } = require('canvafy');
const Guild = require('../../model/guild');


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
        return color;
}

class User {
    constructor(member, level, rankxp, xp, requiredXp) {
        this.member = member;
        this.level = level;
        this.rankxp = rankxp;
        this.xp = xp;
        this.requiredXp = requiredXp;
    }

    gainXP(amount) {
        this.xp += amount;
        if (this.xp >= this.requiredXp) {
            levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xp -= this.requiredXp;
        this.requiredXp *= 2;
        updateRank();
    }

    updateRank() {
        const guildMembers = member.guild.members.fetch();
        const sortedMembers = guildMembers.sort((a, b) => {
            return getXP(b) - getXP(a);
        });
        const userIndex = sortedMembers.findIndex(member => member.id === this.member.id);
        this.rank = userIndex + 1;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
	    .setName('rank')
        .setDescription('View your rank')
        ,

    async execute(interaction) {
        await interaction.deferReply();
        
        const { member } = interaction;
        const RankGuild = await Guild.findOne({ 
            where: {id: member.guild.id } 
        });

        if (!RankGuild) return;

        let level = 1;
        let rankxp = 1;
        let xp = 0;
        let requiredXp = 100;

        const user = new User(member, level, rankxp, xp, requiredXp);
        user.gainXP(50);
        
        const randomBorderColor = getRandomColor();
        const rank = await new Rank()
            .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }))
            .setBackground('image', RankGuild.rankBackground)
            .setUsername(member.user.username)
            .setBorder(randomBorderColor)
            .setStatus('online')
            .setLevel(user.level)
            .setRank(user.rankxp) 
            .setCurrentXp(user.xp)
            .setRequiredXp(user.requiredXp)
            .build();

            return interaction.editReply({
                files: [{
                    attachment: rank,
                    name: `rank-${interaction.id}.png`
                }]
            });  
    }
}