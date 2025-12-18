const { 
    Client, 
    GatewayIntentBits, 
    REST, 
    Routes 
} = require('discord.js');

const fs = require('fs');
require('dotenv').config();

// ====== CONFIG ======
const TOKEN = process.env.BOT_TOKEN;
const APP_ID = process.env.APP_ID;

// ====== CLIENT ======
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// ====== LOAD COMMANDS ======
client.commands = new Map();
const commands = [];

const commandFiles = fs
    .readdirSync('./commands')
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    if (!command.data || !command.execute) {
        console.warn(`⚠️ Lệnh ${file} thiếu data hoặc execute`);
        continue;
    }

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

// ====== REGISTER SLASH COMMANDS ======
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('🔄 Đang đăng ký slash commands...');
        await rest.put(
            Routes.applicationCommands(APP_ID),
            { body: commands }
        );
        console.log('✅ Đăng ký slash commands thành công!');
    } catch (error) {
        console.error('❌ Lỗi đăng ký slash commands:', error);
    }
})();

// ====== HANDLE INTERACTION ======
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: '❌ Có lỗi xảy ra khi thực thi lệnh!',
            ephemeral: true,
        });
    }
});

// ====== READY ======
client.once('ready', () => {
    console.log(`🤖 Bot online: ${client.user.tag}`);
});

// ====== LOGIN ======
client.login(TOKEN);
