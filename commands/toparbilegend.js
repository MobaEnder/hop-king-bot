const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('toparbilegend')
        .setDescription('Top Arbitrations Legend'),

    async execute(interaction) {

        // ====== SETTING TOP (chỉ cần sửa ID + level) ======
        const topList = [
            { id: '1451400932733616289', Rank: 1, reward: '---' },
            { id: '552876985676726275', Rank: 2, reward: '---' },
            { id: '742738400330907741', Rank: 3, reward: '---' },
            { id: '784321064515141632', Rank: 4, reward: '---' },
            { id: '929228634563182622', Rank: 5, reward: '---' },
            { id: '715579253051359342', Rankl: 6, reward: '---' },
            { id: '692226401398423592', Rank: 7, reward: '---' }
        ];

        // ====== BUILD DESCRIPTION ======
        let description = '';

        for (let i = 0; i < topList.length; i++) {
            const userId = topList[i].id;
            const level = topList[i].level;
            const reward = topList[i].reward;

            description += `**#${i + 1}** • <@${userId}> • **LVL:** ${level}\n`;
            // sau này bạn có thể thêm:
            // description += `🎁 Reward: ${reward}\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle('🏆 TOP ARBITRATIONS LEGEND')
            .setColor(0xFFD700)
            .setDescription(description)
            .setFooter({ text: 'Arbitrations Ranking' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
