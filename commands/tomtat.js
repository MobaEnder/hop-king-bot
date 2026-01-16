const { SlashCommandBuilder } = require('discord.js');
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
    await interaction.deferReply();

    const link = interaction.options.getString('link');
    const [, , , , channelId, messageId] = link.split('/');

    const channel = await interaction.client.channels.fetch(channelId);

    let allMessages = [];
    let lastId = messageId;

    while (true) {
      const fetched = await channel.messages.fetch({ after: lastId, limit: 100 });
      if (!fetched.size) break;
      allMessages.push(...fetched.values());
      lastId = fetched.last().id;
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
  }
};
