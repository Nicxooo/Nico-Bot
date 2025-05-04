const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('kick')
	.setDescription('Select a member to kick.')
    .addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to kick')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.kickMembers)
	.setDMPermission(false)
    .addStringOption(option =>
        option
            .setName('reason')
            .setDescription('Reason for kicking member')
            .setRequired(false)
            .setMinLength(1)
            .setMaxLength(255)
    ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { options, guild, user} = interaction;

        const target = await options.getMember('target');
        let reason = await options.getString('reason') ?? 'No reason provided.';

        if (user.id === target.id)
            return interaction.editReply("You can't kick yourself");
        if(!target.kickable)
            return interaction.editReply("I can't kick that member");

        const senderRoles = await interaction.member.roles.cache.map(r => r);
        const targetPerms = target.permissions;
        const targetHighest = await target.roles.highest.rawPosition;

        let higherPerms = new PermissionsBitField();

        for (let role of senderRoles) {
            if (role.rawPosition > targetHighest) {
                higherPerms.add(role.permissions);
            }
        }

        if (user.id !== guild.ownerId) {
            if(!higherPerms.has('KickMembers'))
                return interaction.editReply("You don't have permissions");
            else if (targetPerms.has('Administrator') && !higherPerms.has('Administrator'))
                return interaction.editReply("You don't have permissions");
        }

        let embed = new EmbedBuilder();
        await target.kick({ reason: reason });

        const [ member, created ] = await member.findOrCreate({ where: { id: target.id, guildId: guild.id} });
        
        await member.createInfraction({
            guildId: guild.id,
            reason: reason,
            type: 'Kick',
            enforcerId: user.id
        }).then(result => {
            embed
            .setColor('Green')
            .setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL() })
            .setTitle('New Infraction')
            .setDescription(`Issued by ${user.tag}`)
            .addFields(
                {
                    name: 'Id: ',
                    value: "" + result.dataValues.id + "",
                    inline: true
                },
                {
                    name: 'Type: ',
                    value: "" + result.dataValues.id + "",
                    inline: true
                },
                {
                    name: 'Guild: ',
                    value: "" + guild.name + "",
                    inline: true
                },
                {
                    name: 'Reason: ',
                    value: "" + result.dataValues.reason + "",
                    inline: true
                }
            )
        }).catch(error => {
            console.log(error);
        });

        await interaction.editReply({ embeds: [embed] });
    }
}