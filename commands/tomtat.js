const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tomtat')
    .setDescription('Tóm tắt 100 tin nhắn mới nhất trong channel bằng AI')
    .addStringOption(opt =>
      opt.setName('channel_id')
        .setDescription('ID channel cần tóm tắt')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ flags: 64 });

    try {
      const channelId = interaction.options.getString('channel_id');
      const channel = await interaction.client.channels.fetch(channelId);

      if (!channel || !channel.isTextBased()) {
        return interaction.editReply('❌ Channel ID không hợp lệ.');
      }

      const messages = await channel.messages.fetch({ limit: 100 });
      if (!messages.size) {
        return interaction.editReply('❌ Channel không có tin nhắn.');
      }

      const text = messages
        .reverse()
        .map(m => `${m.author.username}: ${m.content}`)
        .join('\n');

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `Hãy tóm tắt ngắn gọn đoạn chat Discord sau bằng tiếng Việt:\n\n${text}` }]
              }
            ]
          })
        }
      );

      const data = await res.json();

      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.error(data);
        return interaction.editReply('❌ Gemini không trả về nội dung.');
      }

      await interaction.editReply(data.candidates[0].content.parts[0].text);

    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Có lỗi khi xử lý yêu cầu.');
    }
  }
};
