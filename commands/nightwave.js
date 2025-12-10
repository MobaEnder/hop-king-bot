const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nightwave')
        .setDescription('Warframe nightwave'),

    async execute(interaction) {

        await interaction.reply(
            "**🎬 Video Giới Thiệu Về NightWave:**\n" +
            "https://www.youtube.com/watch?v=QEygU1acRaY"
        );

    }
};
