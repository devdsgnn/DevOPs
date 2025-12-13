import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('site')
    .setDescription('Save website inspiration to Notion')
    .addStringOption(option =>
        option.setName('url')
            .setDescription('The website URL to save')
            .setRequired(true)
    );

export async function execute(interaction) {
    // Defer reply immediately as this will take time (screenshot + API calls)
    await interaction.deferReply({ ephemeral: true });

    const url = interaction.options.getString('url');

    // Validate URL format
    try {
        new URL(url);
    } catch (error) {
        await interaction.editReply({
            content: '❌ Invalid URL format. Please provide a valid website URL.'
        });
        return;
    }

    // The actual processing will be handled in the interactionCreate event
    // We'll pass the URL to a handler function
    const { handleSiteCommand } = await import('../events/interactionCreate.js');
    await handleSiteCommand(interaction, url);
}
