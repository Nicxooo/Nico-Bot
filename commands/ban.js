const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Select a member and ban them.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to ban')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setDMPermission(false)
    .addStringOption(option =>
        option
            .setName('reason')
            .setDescription('Reason for banning member')
            .setRequired(false)
            .setMinLength(1)
            .setMaxLength(255)
    ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { options, guild, user} = interaction;

        const target = await options.getMember('member');
        let reason = await options.getString('reason') ?? 'No reason provided.';

        if (user.id === target.id)
            return interaction.deferReply("You can't ban yourself");
        if(!target.bannable)
            return interaction.deferReply("I can't ban that member");

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
            if(!higherPerms.has('BanMembers'))
                return interaction.deferReply("You don't have permissions");
            else if (targetPerms.has('Administrator') && !higherPerms.has('Administrator'))
                return interaction.deferReply("You don't have permissions");
        }

        let embed = new EmbedBuilder();
        await target.ban({ reason: reason });

        const [ member, created ] = await Member.findOrCreate({ where: { id: target.id, guildId: guild.id} });
        
        await member.createInfraction({
            guildId: guild.id,
            reason: reason,
            type: 'Ban',
            enforcerId: user.id
        }).then(result => {
            embed
            .setColor('Red')
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

        await interaction.deferReply({ embeds: [embed] });
    }
}