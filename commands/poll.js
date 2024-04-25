const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a new poll')
    .addStringOption(option => option
        .setName('poll-title')
        .setDescription('Set poll')
        .setMaxLength(50)
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('1st-option')
        .setDescription('Option 1 of 5')
        .setMaxLength(50)
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('2nd-option')
        .setDescription('Option 2 of 5')
        .setMaxLength(50)
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName('3rd-option')
        .setDescription('Option 3 of 5')
        .setMaxLength(50)
    )
    .addStringOption(option => option
        .setName('4th-option')
        .setDescription('Option 4 of 5')
        .setMaxLength(50)
    )
    .addStringOption(option => option
        .setName('5th-option')
        .setDescription('Option 5 of 5')
        .setMaxLength(50)
    ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const { user, guild, channel } = await interaction;
        const options = await interaction.options.data;
        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
        
        let embed = new EmbedBuilder()
            .setTitle(`${options[0].value}`)
            .setColor('Random');

        for(let i = 1; i < options.length; i++) {
            let emoji = emojis[i-1];
            let option = options[i];
            embed.addFields(
                {
                   name: `${emoji} ${option.value}`,
                   value: ' '
                }
            )
        }

        const message = await channel.send({ embeds: [embed] });

        for(let i = 1; i < options.length; i++) {
            let emoji = emojis[i-1];
            await message.react(emoji);
        }

        await interaction.editReply({ content: 'Sent poll successfully!' });
    }
}