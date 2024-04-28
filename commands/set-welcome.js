const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Guild = require('../model/guild');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('set-welcome')
	.setDescription('Set the welcome channel for this server.')
    .addChannelOption(option => option
        .setName('channel')
        .setDescription('What channel would you like?')
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    ,
		
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
		const { options, member } = interaction;

        if(interaction.guild.ownerId !== member.id)
            return interaction.editReply('Only the server owner can use this command');

        const channel = await options.getChannel('channel');
        const [ guild, created ] = await Guild.findOrCreate({ where: { id: interaction.guild.id } })

        if(!channel)
            await guild.update({ welcomeChannelId: null });
        else 
            await guild.update({ welcomeChannelId: channel.id });

        if(!channel)
            interaction.editReply('Disabled the welcome message system');
        else
            interaction.editReply(`Set the channel for welcome messages to ${channel}`)
	}  
}