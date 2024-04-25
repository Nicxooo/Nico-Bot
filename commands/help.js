const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help menu for Nico!'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle('Nico bot at your service!')
        .setURL('https://support.discord.com/hc/en-us')
        .setDescription("Here's a list of available commands:")
        .setAuthor(
            {
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            } 
        )
        .setImage(interaction.client.user.displayAvatarURL())
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .addFields(
            {
                name: '/help',
                value: 'a little help to get you started!' 
            },
            { 
                name: '/poll', 
                value: "can't decide? do a poll!"
            },
            { 
                name: '/kick', 
                value: "now don't be rude 🤔."
            },
            { 
                name: '/8ball', 
                value: "don't trust it."
            },
        )
        .setTimestamp(Date.now())
        .setFooter({ text: 'NicoTastic!', iconURL: interaction.client.user.displayAvatarURL() });
        
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
    }
}