const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lich_sister')
        .setDescription('Gửi link Kuva Lich / Sisters of Parvos / Discord guide'),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("🔗 Kuva Lich – Sisters of Parvos Links & Guides")
            .setColor(0xC00000)
            .setDescription(
                "**🎬 Video Tiếng Việt:**\n" +
                "[YouTube](https://www.youtube.com/watch?v=z_EgUKwOm7w)\n\n" +

                "**📚 Wiki Kuva Lich:**\n" +
                "[Kuva Lich Wiki](https://wiki.warframe.com/w/Kuva_Lich)\n\n" +

                "**📚 Wiki Sisters of Parvos:**\n" +
                "[Sisters of Parvos Wiki](https://wiki.warframe.com/w/Sisters_of_Parvos)\n\n" +

                "**💬 Guide Từ Discord:**\n" +
                "[Kuva Lich Guide](https://discord.com/channels/1240686737332768862/1401272735530877008)\n" +
                "[Sisters of Parvos Guide](https://discord.com/channels/1240686737332768862/1405195413056917544)"
            );

        await interaction.reply({ embeds: [embed] });
    }
};
