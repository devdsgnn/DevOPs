import { EmbedBuilder } from 'discord.js';
import notionManager from '../utils/notionManager.js';

// Platform colors
const PLATFORM_COLORS = {
    'X': 0x1DA1F2,        // Twitter blue
    'LinkedIn': 0x0A66C2,  // LinkedIn blue
    'Instagram': 0xE4405F, // Instagram pink
    'Dribbble': 0xEA4C89   // Dribbble pink
};

// Platform emojis
const PLATFORM_EMOJIS = {
    'X': '𝕏',
    'LinkedIn': '💼',
    'Instagram': '📸',
    'Dribbble': '🏀'
};

/**
 * Handle publishing a preview
 */
export async function handlePublishPreview(interaction) {
    // Defer IMMEDIATELY to prevent timeout
    try {
        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply({ ephemeral: true });
        }
    } catch (deferError) {
        console.error('Failed to defer interaction:', deferError);
        // If we can't defer, the interaction is likely already expired
        return;
    }

    try {
        // Extract message ID from custom ID
        const messageId = interaction.customId.replace('publish_preview_', '');

        // Fetch the preview message and disable buttons immediately
        const previewMessage = await interaction.channel.messages.fetch(messageId);

        // Disable all buttons to prevent double-clicks
        const disabledRow = previewMessage.components[0];
        if (disabledRow) {
            disabledRow.components.forEach(button => {
                button.data.disabled = true;
            });
            await previewMessage.edit({ components: [disabledRow] });
        }


        // Extract data from the embed field
        const dataField = previewMessage.embeds[0]?.fields?.find(f => f.name === '\u200b');
        if (!dataField) {
            await interaction.editReply({
                content: '❌ Preview data not found.'
            });
            return;
        }

        // Decode the base64 data
        const dataBase64 = dataField.value.replace(/```/g, '').trim();
        const dataString = Buffer.from(dataBase64, 'base64').toString('utf-8');
        const previewData = JSON.parse(dataString);

        const { platform, accountId, accountName, text, imageUrl } = previewData;

        // Get platform color
        const platformColor = PLATFORM_COLORS[platform] || 0x5865F2;
        const platformEmoji = PLATFORM_EMOJIS[platform] || '📱';

        // Get the account details (fresh from Notion)
        const accounts = await notionManager.getPlatformAccounts(platform);
        const selectedAccount = accounts.find(acc => acc.id === accountId);

        if (!selectedAccount) {
            await interaction.editReply({
                content: '❌ Account not found.'
            });
            return;
        }

        // Get publish channel ID from Notion config
        const config = await notionManager.getPostConfig();
        const publishChannelId = config.publishChannelId || '1450436543595417732';
        const publishChannel = await interaction.client.channels.fetch(publishChannelId);

        const statusEmbed = new EmbedBuilder()
            .setAuthor({ name: `${platformEmoji} Publishing to ${platform}...` })
            .setDescription(`📱 **Account:** ${accountName}\n📝 **Content:** ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)
            .setColor(platformColor)
            .setTimestamp();

        const statusMessage = await publishChannel.send({
            embeds: [statusEmbed]
        });

        // Import platform poster
        const platformPoster = (await import('../utils/platformPoster.js')).default;

        // Prepare content object
        const content = {
            text: text
        };

        // Download image if it exists (from Discord CDN URL - works for posting)
        if (imageUrl) {
            try {
                const fetch = (await import('node-fetch')).default;
                const response = await fetch(imageUrl);
                if (!response.ok) {
                    throw new Error(`Failed to download: ${response.statusText}`);
                }
                const imageBuffer = await response.arrayBuffer();
                content.imageBuffer = Buffer.from(imageBuffer);
                content.imageMimeType = response.headers.get('content-type');
                console.log('✅ Image downloaded:', content.imageMimeType, content.imageBuffer.length, 'bytes');
            } catch (error) {
                console.error('Failed to download image:', error);
                await statusMessage.edit({
                    embeds: [new EmbedBuilder()
                        .setAuthor({ name: `❌ Failed to download image` })
                        .setDescription(`⚠️ **Error:** ${error.message}`)
                        .setColor(0xFF0000)
                        .setTimestamp()]
                });
                await interaction.editReply({
                    content: `❌ Failed to download image: ${error.message}`
                });
                return;
            }
        }

        // Post to platform
        const result = await platformPoster.post(platform, selectedAccount, content);

        if (result.success) {
            // Update status message to success with beautiful embed
            const successEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${platformEmoji} Published to ${platform}!`,
                    url: result.url
                })
                .setTitle(accountName)
                .setDescription(text.length > 200 ? text.substring(0, 200) + '...' : text)
                .setColor(platformColor)
                .addFields(
                    { name: '🔗 Post Link', value: `[View on ${platform}](${result.url})`, inline: true },
                    { name: '📅 Published', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
                )
                .setFooter({ text: `Posted by ${interaction.user.username}` })
                .setTimestamp();

            // Re-upload image as attachment (not URL) to avoid expiration
            const files = [];
            if (content.imageBuffer) {
                const { AttachmentBuilder } = await import('discord.js');
                const imageAttachment = new AttachmentBuilder(content.imageBuffer, {
                    name: 'published-image.png'
                });
                files.push(imageAttachment);
                successEmbed.setImage('attachment://published-image.png');
            }

            await statusMessage.edit({
                embeds: [successEmbed],
                files: files
            });

            // Delete preview message
            try {
                await previewMessage.delete();
            } catch (error) {
                console.error('Failed to delete preview message:', error);
            }

            // Confirm to user
            await interaction.editReply({
                content: `✅ Successfully published to ${platform}!\n🔗 ${result.url}`
            });


        } else {
            // Update status message to error
            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: `❌ Failed to publish to ${platform}` })
                .setDescription(`📱 **Account:** ${accountName}\n📝 **Content:** ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n\n⚠️ **Error:** ${result.error}`)
                .setColor(0xFF0000) // Red for error
                .setTimestamp();

            await statusMessage.edit({
                embeds: [errorEmbed]
            });

            await interaction.editReply({
                content: `❌ Failed to publish: ${result.error}`
            });
        }

    } catch (error) {
        console.error('Error in handlePublishPreview:', error);
        await interaction.editReply({
            content: `❌ An error occurred: ${error.message}`
        });
    }
}

/**
 * Handle deleting a preview
 */
export async function handleDeletePreview(interaction) {
    // Defer IMMEDIATELY to prevent timeout
    try {
        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply({ ephemeral: true });
        }
    } catch (deferError) {
        console.error('Failed to defer interaction:', deferError);
        return;
    }

    try {
        // Extract message ID from custom ID
        const messageId = interaction.customId.replace('delete_preview_', '');

        // Fetch and delete the preview message
        try {
            const previewMessage = await interaction.channel.messages.fetch(messageId);
            await previewMessage.delete();
        } catch (error) {
            console.error('Failed to delete preview message:', error);
        }

        await interaction.editReply({
            content: '✅ Preview deleted successfully.'
        });

    } catch (error) {
        console.error('Error in handleDeletePreview:', error);
        await interaction.editReply({
            content: `❌ Failed to delete preview: ${error.message}`
        });
    }
}
