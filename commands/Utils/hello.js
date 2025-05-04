const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello to a user!')
    .addUserOption((option) => 
        option
            .setName('user')
            .setDescription('The user to say hi to')
            .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        await interaction.reply( { content: `Hello ${user.username}!`, ephemeral: true });
    }
}