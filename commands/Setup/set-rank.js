const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Guild = require('../../model/guild');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('rank-background')
	    .setDescription('Rank background.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Create the rank system')
                .addStringOption(option => 
                    option.setName('background')
                        .setDescription('Set rank background for all users of the server')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Deletes the rank background')
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ,

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { options, member } = interaction;
        if(interaction.guild.ownerId !== member.id)
            return interaction.editReply('Only the server owner can use this command');

        const rankbackground = await options.getString('background');
        const [ guild, created ] = await Guild.findOrCreate({ where: { id: interaction.guild.id } })

        if(!rankbackground)
            await guild.update({ rankBackground: null });
        else 
            await guild.update({ rankBackground: rankbackground });

        const embedCreate = new EmbedBuilder()
            .setTitle('Rank Background Set:')
            .setDescription(
                `Background: ${rankbackground}`)
            .setColor('Random');
        
        await interaction.editReply({ embeds: [embedCreate] });

        if (interaction.options.getSubcommand() === 'remove') {
            const [ guild, created ] = await Guild.findOrCreate({ where: { id: interaction.guild.id } })

            if (!guild) {
                await interaction.editReply({ content: 'No Welcome Message Found!', ephemeral: true });
            } else {
                await Guild.findOrCreate({ where: { id: interaction.guild.id } })

                const embedRemove = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle('Welcome System')
                    .setDescription('Welcome Message Deleted');

                await interaction.editReply({ embeds: [embedRemove] });
            }
        }
    }
}