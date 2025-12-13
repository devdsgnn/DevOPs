import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add social media platform links')
    .addStringOption(option =>
        option.setName('platform')
            .setDescription('Select a social media platform')
            .setRequired(true)
            .addChoices(
                { name: '𝕏 (Twitter)', value: 'X' },
                { name: 'Dribbble', value: 'Dribbble' },
                { name: 'YouTube', value: 'YouTube' },
                { name: 'Framer', value: 'Framer' },
                { name: 'Instagram', value: 'Instagram' }
            )
    );

export async function execute(interaction) {
    const platform = interaction.options.getString('platform');

    // Create a modal for entering account URLs
    const modal = new ModalBuilder()
        .setCustomId(`add_social_${platform}`)
        .setTitle(`Add ${platform} Account(s)`);

    // Create text input for URLs
    const urlInput = new TextInputBuilder()
        .setCustomId('account_urls')
        .setLabel(`Enter ${platform} account URL(s)`)
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Enter one or multiple URLs (one per line)\n\nExample:\nhttps://x.com/username1\nhttps://x.com/username2')
        .setRequired(true)
        .setMaxLength(2000);

    const actionRow = new ActionRowBuilder().addComponents(urlInput);
    modal.addComponents(actionRow);

    await interaction.showModal(modal);
}
