const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tennokai')
        .setDescription('Warframe melee'),

    async execute(interaction) {

        await interaction.reply(
            "**🎬 Video Setting , Giới Thiệu Sơ Lược Về Mod , Tennokai:**\n" +
            "https://www.youtube.com/watch?v=OJJ-HfCConw"
        );

    }
};
