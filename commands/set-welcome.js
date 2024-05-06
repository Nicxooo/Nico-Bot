const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const Guild = require('../model/guild');

module.exports = {
    data: new SlashCommandBuilder()
	.setName('welcome')
        .setDescription('Set up a welcome message for the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Create the welcome system')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send the welcome message')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role you would like to give to new members')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('background')
                        .setDescription('The URL of the image (optional)')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Deletes the welcome system')
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { options, member } = interaction;
        if(interaction.guild.ownerId !== member.id)
            return interaction.editReply('Only the server owner can use this command');

        const channel = await options.getChannel('channel');
        const background = await options.getString('background');
        const role = await options.getRole('role');
        const [ guild, created ] = await Guild.findOrCreate({ where: { id: interaction.guild.id } })
        
        if(!channel)
            await guild.update({ welcomeChannelId: null });
        else 
            await guild.update({ welcomeChannelId: channel.id });

        if(!role)
            await guild.update({ welcomeRoleId: null });
        else 
            await guild.update({ welcomeRoleId: role.id });

        if(!background)
            await guild.update({ welcomeBackground: null });
        else 
            await guild.update({ welcomeBackground: background });

        const embedCreate = new EmbedBuilder()
            .setTitle('Welcome Message Set:')
            .setDescription(
                `Welcome channel: ${channel}

                Role that will be given: ${role}

                Image background: ${background}`)
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