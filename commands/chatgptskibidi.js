const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatgptskibidi')
    .setDescription('Tìm thông tin trên web và trả lời')
    .addStringOption(opt =>
      opt.setName('text')
        .setDescription('Câu hỏi của bạn')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const query = interaction.options.getString('text');

      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query,
          search_depth: 'basic',
          max_results: 5,
          include_answer: true
        })
      });

      const data = await res.json();

      if (!data.answer) {
        console.error(data);
        return interaction.editReply('❌ Không tìm được câu trả lời.');
      }

      const embed = new EmbedBuilder()
        .setTitle('🤖 Kết quả tìm kiếm')
        .setColor(0x2ECC71)
        .setDescription(data.answer)
        .setFooter({ text: 'Nguồn: Tavily Search' });

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Có lỗi khi xử lý yêu cầu.');
    }
  }
};
