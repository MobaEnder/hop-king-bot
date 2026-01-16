const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chatgptskibidi')
    .setDescription('Hỏi AI, bot sẽ tìm trên web và trả lời')
    .addStringOption(opt =>
      opt.setName('text')
        .setDescription('Câu hỏi của bạn')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const query = interaction.options.getString('text');

      // 1️⃣ Search web bằng Tavily
      const searchRes = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: process.env.TAVILY_API_KEY,
          query,
          search_depth: 'basic',
          max_results: 5
        })
      });

      const searchData = await searchRes.json();

      const sourcesText = searchData.results
        .map(r => `${r.title}\n${r.content}`)
        .join('\n\n');

      // 2️⃣ Dùng Gemini tổng hợp
      const aiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Dựa trên thông tin sau, hãy trả lời câu hỏi bằng tiếng Việt, rõ ràng và dễ hiểu.\n\nThông tin:\n${sourcesText}\n\nCâu hỏi: ${query}`
                  }
                ]
              }
            ]
          })
        }
      );

      const aiData = await aiRes.json();

      const answer = aiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!answer) {
        console.error(aiData);
        return interaction.editReply('❌ Không thể lấy câu trả lời.');
      }

      await interaction.editReply(answer);

    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Có lỗi khi xử lý yêu cầu.');
    }
  }
};
