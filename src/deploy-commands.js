import { REST, Routes } from 'discord.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('📂 Loading commands for deployment...');

for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = await import(`file://${filePath}`);

    if ('data' in command) {
        commands.push(command.data.toJSON());
        console.log(`   ✓ Loaded: ${command.data.name}`);
    } else {
        console.log(`   ⚠ Warning: ${file} is missing "data" property.`);
    }
}

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log(`\n🚀 Started refreshing ${commands.length} application (/) commands.`);

        // Deploy commands globally (works across all servers)
        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Successfully reloaded ${data.length} application (/) commands globally.`);
        console.log('\n📝 Deployed commands:');
        data.forEach(cmd => {
            console.log(`   • /${cmd.name} - ${cmd.description}`);
        });
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();
