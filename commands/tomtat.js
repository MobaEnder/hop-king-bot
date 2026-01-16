const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tomtat')
    .setDescription('Tóm tắt đoạn chat bằng AI (Gemini)')
    .addStringOption(opt =>
      opt.setName('link')
        .setDescription('Link tin nhắn bắt đầu cần tóm tắt')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const link = interaction.options.getString('link');

      // Parse link an toàn
      const match = link.match(/channels\/(\d+)\/(\d+)\/(\d+)/);
      if (!match) {
        return interaction.editReply('❌ Link tin nhắn không hợp lệ.');
      }

      const [, guildId, channelId, messageId] = match;

      const channel = await interaction.client.channels.fetch(channelId);
      if (!channel || !channel.isTextBased()) {
        return interaction.editReply('❌ Không tìm thấy channel hợp lệ.');
      }

      let allMessages = [];
      let lastId = messageId;

      while (true) {
        const fetched = await channel.messages.fetch({ after: lastId, limit: 100 });
        if (!fetched.size) break;
        allMessages.push(...fetched.values());
        lastId = fetched.last().id;
        if (allMessages.length >= 500) break; // chống spam
      }

      if (!allMessages.length) {
        return interaction.editReply('❌ Không có tin nhắn nào sau tin này.');
      }

      const text = allMessages
        .reverse()
        .map(m => `${m.author.username}: ${m.content}`)
        .join('\n');

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(
        `Hãy tóm tắt ngắn gọn đoạn hội thoại Discord sau bằng tiếng Việt:\n\n${text}`
      );

      await interaction.editReply(result.response.text());

    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Có lỗi khi xử lý yêu cầu.');
    }
  }
};
