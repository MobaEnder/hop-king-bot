const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 🔥 Riven checker
const startRivenChecker = require('./riven/checker');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.BOT_TOKEN;
const APP_ID = process.env.APP_ID;

// ================= LOAD SLASH COMMANDS =================
client.commands = new Map();
const commands = [];

const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandPath, file));
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// ================= REGISTER SLASH COMMANDS =================
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(APP_ID),
            { body: commands }
        );
        console.log('✅ Đã đăng ký slash commands!');
    } catch (err) {
        console.error('❌ Lỗi đăng ký slash command:', err);
    }
})();

// ================= BOT READY =================
client.once('ready', () => {
    console.log(`🤖 Bot online: ${client.user.tag}`);

    // 🔥 Bắt đầu check Riven nền (5s/lần)
    startRivenChecker(client);
});

// ================= HANDLE SLASH COMMAND =================
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;

    try {
        await cmd.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({
            content: '❌ Có lỗi xảy ra khi thực thi lệnh!',
            ephemeral: true
        });
    }
});

// ================= LOGIN =================
client.login(TOKEN);
