const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help menu for Nico!'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setColor(800000)
        .setTitle('Nico bot at your service!')
        .setURL('https://matias.ma/nsfw/')
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
                name: 'More Help.',
                value: 'https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ#:~:text=With%20Slash%20Commands%2C%20all%20you,using%20Slash%20Commands%20right%20now.' 
            },
            { 
                name: 'Develop your own!', 
                value: 'https://discord.com/developers/docs/intro', 
                inline: true 
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