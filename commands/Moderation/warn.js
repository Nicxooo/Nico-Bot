const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Infraction = require('../../model/infraction');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(option => option
        .setName('user')
        .setDescription('User you wish to warn')
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('reason')
        .setDescription('Reason for warning')
        .setRequired(false)
    ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { options, guild, member } = interaction;

        const target = await options.getMember('user');
        let reason = await options.getString('reason');

        let embed = new EmbedBuilder();

        if(!reason) reason = 'No reason provided';

        await Infraction.create({
            userId: target.id,
            guildId: guild.id,
            reason: reason,
            type: 'Warn',
            enforcerId: member.id
        }).then(result => {
            embed
                .setColor('Random')
                .setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL() })
                .setTitle('New Infraction')
                .setDescription(`Issued by ${member.user.tag}`)
                .addFields(
                    {
                        name: 'id:',
                        value: "`" + result.dataValues.id + "`",
                        inline: true
                    },
                    {
                        name: 'Type: ',
                        value: "`" + result.dataValues.type + "`",
                        inline: true
                    },
                    {
                        name: 'Guild: ',
                        value: "`" + guild.name + "`",
                        inline: false
                    },
                    {
                        name: 'Reason: ',
                        value: "`" + result.dataValues.reason + "`",
                        inline: true
                    }
                );
        }).catch(error => {
            console.log(error);
        })

        await interaction.editReply({ embeds: [ embed ] });
    }
}