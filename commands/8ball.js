const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('8ball')
	.setDescription('Ask a question!')
    .addStringOption(option => option
        .setName('question')
        .setDescription('Question to ask the 8-Ball')
        .setMinLength(1)
        .setMaxLength(250)
        .setRequired(true)
    )
    .addBooleanOption(option => option
        .setName('hidden')
        .setDescription('Whether or not to hide the response from the 8-Ball (displayed by default)')
    ),

	async execute(interaction) {
        const { options, user } = await interaction;
        const question = await options.getString('question');
        const hidden = await options.getBoolean('hidden');

        if(!question.endsWith('?'))
            return interaction.reply({ ephemeral: true, content: "The question must end with a '?'"});
        let randomNumber = Math.floor(Math.random() * responses.length - 0.001);

        const embed = new EmbedBuilder()
            .setTitle('8Ball')
            .setAuthor({ name: user.username, URL: user.displayAvatarURL() })
            .setColor('Random')
            .setDescription(question)
            .addFields(
                {
                    name: 'Question:',
                    value: question
                },
                {
                name: 'Response:',
                value: responses[randomNumber]
                }
            );
        
        interaction.reply({ ephemeral: hidden, embeds: [embed] });
	}
}

const responses = [
    "It is certain.",
    "Without a doubt.",
    "You may rely on it.",
    "Yes, definitely.",
    "It is decidedly so.",
    "As I see it, yes.",
    "Most likely.",
    "Yes.",
    "Outlook good.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Better not tell you now.",
    "Ask again later.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "Outlook not so good.",
    "My sources say no.",
    "Very doubtful.",
    "My reply is no.",
    "No.",
    "Definitely not.",
    "No way.",
    "I highly doubt it.",
    "Absolutely not.",
    "The outlook is murky.",
    "The answer is foggy.",
    "It's unclear at the moment.",
    "I'm not certain about that.",
    "The signs are inconclusive.",
    "The outcome is uncertain.",
    "The response is unclear.",
    "The future looks bright.",
    "All signs point to success.",
    "Things are looking up.",
    "The chances are in your favor.",
    "You're on the right track.",
    "The outcome is promising.",
    "The signs are positive.",
    "The path ahead is clear.",
    "You can count on it.",
    "Success is on the horizon.",
];