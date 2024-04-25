const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes a specific number of messages.')
    .addIntegerOption((option) => option
        .setName('amount')
        .setDescription('How many messages to delete?')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    ),

    async execute (interaction) {
        const amount = interaction.options.getInteger('amount');
        const channel = interaction.channel;

        if (!interaction.member.permissions.has(PermissionsBitField.ManageMessages))
            return await interaction.reply({ content: 'You dont have permission to execute this command.', ephemeral: true });
        
        if (!amount)
            return await interaction.reply({ content: 'Please specify the amount you want to delete', ephemeral: true });
    
        if (amount > 100 || amount < 1)
            return await interaction.reply({ content: 'Please select a number within the range of 1-100', ephemeral: true });
        
        await interaction.channel.bulkDelete(amount).catch(error => {
            return;
        })
        
        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(`:white_check_mark: Deleted **${amount}** messages.`)

        await interaction.reply({ embed: [embed] }).catch(error => {
            return;
        })
    }
}
