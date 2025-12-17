import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import notionManager from '../utils/notionManager.js';
import { extractMetadata, takeScreenshot, truncateDescription } from '../utils/webpageUtils.js';
import { handlePublishPreview, handleDeletePreview } from '../handlers/previewHandlers.js';

export const name = 'interactionCreate';

export async function execute(interaction) {
    const startTime = Date.now();
    console.log(`📥 Received ${interaction.type} interaction: ${interaction.commandName || interaction.customId}`);

    // Handle slash commands
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
            console.log(`✅ Command ${interaction.commandName} executed in ${Date.now() - startTime}ms`);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error.message);

            // Don't try to respond if this was a modal interaction (like /add)
            // Modals don't work with traditional reply/followUp
            if (interaction.commandName === 'add') {
                console.error('Modal error - interaction already handled');
                return;
            }

            const errorMessage = {
                content: '❌ There was an error while executing this command!',
                flags: 64 // Ephemeral flag
            };

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage);
                } else {
                    await interaction.reply(errorMessage);
                }
            } catch (e) {
                console.error('Failed to send error message:', e.message);
            }
        }
    }



    // Handle button interactions
    else if (interaction.isButton()) {
        if (interaction.customId.startsWith('connect_account_')) {
            await handleConnectAccount(interaction);
        } else if (interaction.customId.startsWith('publish_preview_')) {
            await handlePublishPreview(interaction);
        } else if (interaction.customId.startsWith('delete_preview_')) {
            await handleDeletePreview(interaction);
        }
    }

    // Handle modal submissions
    else if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('add_social_')) {
            await handleAddSocialModal(interaction);
        }
    }
}

async function handleAddSocialModal(interaction) {
    const startTime = Date.now();
    try {
        // Defer reply immediately - this is faster than a full reply
        await interaction.deferReply({ flags: 64 }); // Ephemeral
        console.log(`⏱️  Deferred reply in ${Date.now() - startTime}ms`);

        const platform = interaction.customId.replace('add_social_', '');
        const urlsInput = interaction.fields.getTextInputValue('account_urls');

        // Split by new lines and filter out empty lines
        const urls = urlsInput
            .split('\n')
            .map(url => url.trim())
            .filter(url => url.length > 0);

        if (urls.length === 0) {
            await interaction.editReply({
                content: '❌ No valid URLs provided.'
            });
            return;
        }

        const serverId = interaction.guildId;
        const userId = interaction.user.id;

        const results = [];

        // Add each URL to Notion
        console.log(`📝 Adding ${urls.length} link(s) to Notion...`);
        for (const url of urls) {
            const urlStartTime = Date.now();
            try {
                await notionManager.addSocialLink(platform, url, serverId, userId);
                console.log(`  ✓ Added in ${Date.now() - urlStartTime}ms: ${url}`);
                results.push({ url, success: true });
            } catch (error) {
                console.error(`  ✗ Failed in ${Date.now() - urlStartTime}ms: ${url}`, error.message);
                results.push({ url, success: false, error: error.message });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        let message = `✅ Successfully added ${successCount} ${platform} link(s)!`;

        if (failCount > 0) {
            message += `\n⚠️ Failed to add ${failCount} link(s).`;
            const failedUrls = results.filter(r => !r.success).map(r => r.url);
            message += `\n\nFailed URLs:\n${failedUrls.join('\n')}`;
        }

        await interaction.editReply({
            content: message
        });
    } catch (error) {
        console.error('Error in handleAddSocialModal:', error);

        // Try to respond if we haven't already
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ An error occurred while adding the links.',
                    flags: 64
                });
            } else {
                await interaction.editReply({
                    content: '❌ An error occurred while adding the links.'
                });
            }
        } catch (e) {
            console.error('Failed to send error message:', e);
        }
    }
}


/**
 * Handle the /site command - save website inspiration
 * @param {Interaction} interaction - The Discord interaction
 * @param {string} url - The website URL
 */
export async function handleSiteCommand(interaction, url) {
    const startTime = Date.now();

    try {
        console.log(`🌐 Processing site command for: ${url}`);

        // Step 1: Extract metadata from the webpage
        const { title, description } = await extractMetadata(url);
        console.log(`⏱️  Metadata extracted in ${Date.now() - startTime}ms`);

        // Step 2: Save to Notion
        try {
            await notionManager.addSiteInspiration(url, title, description);
            console.log(`⏱️  Saved to Notion in ${Date.now() - startTime}ms`);
        } catch (notionError) {
            console.error('Failed to save to Notion:', notionError.message);
            await interaction.editReply({
                content: '❌ Failed to save to Notion. Please check your database configuration.'
            });
            return;
        }

        // Step 3: Take screenshot (with progressive waiting strategy)
        let screenshot = null;
        try {
            screenshot = await takeScreenshot(url);
            if (screenshot) {
                console.log(`⏱️  Screenshot captured in ${Date.now() - startTime}ms`);
            } else {
                console.log(`⚠️  Screenshot skipped (page failed to load) after ${Date.now() - startTime}ms`);
            }
        } catch (screenshotError) {
            console.error('Failed to take screenshot:', screenshotError.message);
            // Continue even if screenshot fails
        }

        // Step 4: Create Discord embed
        const truncatedDesc = truncateDescription(description, 5, 50);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(title)
            .setURL(url)
            .setDescription(truncatedDesc || 'No description available')
            .setTimestamp()
            .setFooter({ text: 'Saved to Notion' });

        // Add screenshot as image if available
        const files = [];
        if (screenshot) {
            const attachment = new AttachmentBuilder(screenshot, { name: 'screenshot.png' });
            files.push(attachment);
            embed.setImage('attachment://screenshot.png');
        }

        // Step 5: Send the embed as a new message in the channel
        await interaction.channel.send({
            embeds: [embed],
            files: files
        });

        // Send ephemeral confirmation to the user only
        await interaction.editReply({
            content: '✅ Website inspiration saved to Notion and posted in channel!'
        });

        console.log(`✅ Site command completed in ${Date.now() - startTime}ms`);

    } catch (error) {
        console.error('Error in handleSiteCommand:', error);

        try {
            await interaction.editReply({
                content: '❌ An error occurred while processing the website.'
            });
        } catch (e) {
            console.error('Failed to send error message:', e);
        }
    }
}

/**
 * Handle connect account button click
 */
async function handleConnectAccount(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });

        const platform = interaction.customId.replace('connect_account_', '');

        // Generate OAuth URL (this would need to be implemented based on platform)
        const oauthInstructions = getOAuthInstructions(platform);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`🔗 Connect ${platform} Account`)
            .setDescription(`To connect your ${platform} account, you'll need to complete OAuth authentication.`)
            .addFields(
                { name: '📋 Steps', value: oauthInstructions },
                { name: '⚠️ Important', value: 'After completing OAuth, you\'ll receive an access token. Use the `/add-account` command to save it.' }
            )
            .setFooter({ text: 'OAuth tokens are stored securely in Notion' })
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed]
        });

    } catch (error) {
        console.error('Error in handleConnectAccount:', error);
        await interaction.editReply({
            content: '❌ Failed to initiate account connection.'
        });
    }
}

/**
 * Handle account selection from button
 */
async function handleAccountSelection(interaction) {
    try {
        // Parse custom ID: select_account_{platform}_{accountId}
        const parts = interaction.customId.split('_');
        const platform = parts[2];
        const accountId = parts.slice(3).join('_');

        // Import the post command to access showContentModal
        const postCommand = await import('../commands/post.js');

        // Show modal immediately with a dummy account object (just need the ID)
        // The modal customId will have the account ID, and the modal handler will fetch full details
        await postCommand.showContentModal(interaction, platform, { id: accountId, name: 'Selected Account' });

    } catch (error) {
        console.error('Error in handleAccountSelection:', error);

        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Failed to show content form. Please try again.',
                    ephemeral: true
                });
            }
        } catch (e) {
            console.error('Failed to send error message:', e.message);
        }
    }
}

/**
 * Handle post content modal submission
 */
async function handlePostContentModal(interaction) {
    try {
        // Parse custom ID: post_content_{platform}_{accountId}
        const parts = interaction.customId.split('_');
        const platform = parts[2];
        const accountId = parts.slice(3).join('_');

        // Get account details
        const accounts = await notionManager.getPlatformAccounts(platform);
        const account = accounts.find(acc => acc.id === accountId);

        if (!account) {
            await interaction.reply({
                content: '❌ Account not found.',
                ephemeral: true
            });
            return;
        }

        // Extract content from modal fields
        const content = {};

        // Platform-specific field extraction
        if (platform === 'Dribbble') {
            content.title = interaction.fields.getTextInputValue('post_title');
        }

        content.text = interaction.fields.getTextInputValue('post_content');
        content.caption = content.text; // For Instagram

        try {
            const tags = interaction.fields.getTextInputValue('post_tags');
            if (tags) {
                content.tags = tags;
            }
        } catch (e) {
            // Tags field is optional
        }

        try {
            const url = interaction.fields.getTextInputValue('post_url');
            if (url) {
                content.url = url;
            }
        } catch (e) {
            // URL field is optional
        }

        // For Dribbble, description is in the content field
        if (platform === 'Dribbble') {
            content.description = content.text;
        }

        // Check if platform requires image
        const requiresImage = platform === 'Instagram' || platform === 'Dribbble';
        const supportsImage = platform === 'X' || platform === 'LinkedIn' || requiresImage;

        if (supportsImage) {
            // Ask for image upload - send as regular message so user can reply
            const imagePrompt = requiresImage
                ? `📸 **Image Required for ${platform}**\n\n${interaction.user}, please send an image in this channel.\n\n⏱️ You have 60 seconds to upload.`
                : `📸 **Add Image? (Optional)**\n\n${interaction.user}, send an image in this channel, or type "skip" to post without an image.\n\n⏱️ You have 60 seconds.`;

            // Send as regular message in channel (not ephemeral)
            const promptMessage = await interaction.channel.send({
                content: imagePrompt
            });

            // Wait for image upload
            const filter = m => m.author.id === interaction.user.id;
            const collected = await interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ['time']
            }).catch(() => null);

            if (collected && collected.size > 0) {
                const message = collected.first();

                if (message.content.toLowerCase() === 'skip' && !requiresImage) {
                    // User skipped image
                    await message.delete().catch(() => { });
                    await promptMessage.delete().catch(() => { });
                } else if (message.attachments.size > 0) {
                    // User uploaded image
                    const attachment = message.attachments.first();

                    if (attachment.contentType?.startsWith('image/')) {
                        content.imageUrl = attachment.url;
                        await message.delete().catch(() => { });
                        await promptMessage.delete().catch(() => { });
                    } else {
                        await promptMessage.delete().catch(() => { });
                        await interaction.followUp({
                            content: '❌ Please upload an image file (JPG, PNG, GIF).',
                            ephemeral: true
                        });
                        return;
                    }
                } else if (requiresImage) {
                    await promptMessage.delete().catch(() => { });
                    await interaction.followUp({
                        content: `❌ ${platform} requires an image. Please try again.`,
                        ephemeral: true
                    });
                    return;
                }
            } else if (requiresImage) {
                await promptMessage.delete().catch(() => { });
                await interaction.followUp({
                    content: '❌ Timeout. Please try again and upload an image within 60 seconds.',
                    ephemeral: true
                });
                return;
            }
        }

        // Import platform poster
        const platformPoster = (await import('../utils/platformPoster.js')).default;

        // Post to platform
        await interaction.followUp({
            content: `⏳ Posting to ${platform}...`,
            ephemeral: true
        });

        const result = await platformPoster.post(platform, account, content);

        if (result.success) {
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle(`✅ Posted to ${platform}!`)
                .setDescription(`Your content has been successfully published.${result.imageError ? '\n\n⚠️ **Image upload failed:** ' + result.imageError : ''}`)
                .addFields(
                    { name: '📱 Account', value: account.name, inline: true },
                    { name: '🔗 View Post', value: `[Click here](${result.url})`, inline: true }
                )
                .setTimestamp();

            await interaction.followUp({
                content: null,
                embeds: [successEmbed],
                ephemeral: true
            });

            // Also send a message in the channel
            await interaction.channel.send({
                content: `🎉 **${interaction.user.username}** just posted to ${platform}!\n${result.url}`
            });

        } else {
            await interaction.followUp({
                content: `❌ Failed to post to ${platform}: ${result.error}`,
                ephemeral: true
            });
        }

    } catch (error) {
        console.error('Error in handlePostContentModal:', error);

        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: `❌ An error occurred while posting: ${error.message}`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `❌ An error occurred while posting: ${error.message}`,
                    ephemeral: true
                });
            }
        } catch (e) {
            console.error('Failed to send error message:', e);
        }
    }
}

function getOAuthInstructions(platform) {
    const instructions = {
        'X': '1. Go to [Twitter Developer Portal](https://developer.twitter.com/)\n2. Create an app with OAuth 2.0\n3. Get your access token\n4. Use `/add-account` to save it',
        'LinkedIn': '1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)\n2. Create an app with "Share on LinkedIn" product\n3. Complete OAuth flow\n4. Use `/add-account` to save your token',
        'Instagram': '1. Convert to Business/Creator account\n2. Connect to Facebook Page\n3. Create Facebook App\n4. Get access token with `instagram_content_publish`\n5. Use `/add-account` to save it',
        'Dribbble': '1. Go to [Dribbble Applications](https://dribbble.com/account/applications)\n2. Register your application\n3. Complete OAuth with "upload" scope\n4. Use `/add-account` to save your token'
    };
    return instructions[platform] || 'Follow platform-specific OAuth setup';
}

/**
 * Handle publishing a draft
 */
async function handlePublishDraft(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });

        // Extract draft ID from custom ID
        const draftId = interaction.customId.replace('publish_draft_', '');

        // Get draft data from Notion
        const { Client } = await import('@notionhq/client');
        const notion = new Client({ auth: process.env.NOTION_API_KEY });

        const draftPage = await notion.pages.retrieve({ page_id: draftId });

        // Extract draft data from Notion
        const draftDataText = draftPage.properties['Draft Data']?.rich_text?.[0]?.text?.content;
        if (!draftDataText) {
            await interaction.editReply({
                content: '❌ Draft data not found.'
            });
            return;
        }

        const draftData = JSON.parse(draftDataText);
        const { platform, accountId, accountName, text, hasImage, imageBuffer: imageBufferBase64, imageMimeType, previewMessageId, previewChannelId } = draftData;

        // Recreate image buffer if exists
        let imageBuffer = null;
        if (hasImage && imageBufferBase64) {
            imageBuffer = Buffer.from(imageBufferBase64, 'base64');
        }

        // Get the account details
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
            .setAuthor({ name: `Publishing to ${platform}...` })
            .setDescription(`📱 **Account:** ${accountName}\n📝 **Content:** ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)
            .setColor(0xFFA500) // Orange for in-progress
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

        if (imageBuffer) {
            content.imageBuffer = imageBuffer;
            content.imageMimeType = imageMimeType;
        }

        // Post to platform
        const result = await platformPoster.post(platform, selectedAccount, content);

        if (result.success) {
            // Update status message to success
            const successEmbed = new EmbedBuilder()
                .setAuthor({ name: `✅ Published to ${platform}!` })
                .setDescription(`📱 **Account:** ${accountName}\n📝 **Content:** ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}\n\n🔗 [View Post](${result.url})`)
                .setColor(0x00FF00) // Green for success
                .setTimestamp();

            await statusMessage.edit({
                embeds: [successEmbed]
            });

            // Draft published successfully - Notion entry kept for records

            // Delete preview message
            try {
                const previewChannel = await interaction.client.channels.fetch(previewChannelId);
                const previewMessage = await previewChannel.messages.fetch(previewMessageId);
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
        console.error('Error in handlePublishDraft:', error);
        await interaction.editReply({
            content: `❌ An error occurred: ${error.message}`
        });
    }
}

/**
 * Handle deleting a draft
 */
async function handleDeleteDraft(interaction) {
    try {
        await interaction.deferReply({ ephemeral: true });

        // Extract draft ID from custom ID
        const draftId = interaction.customId.replace('delete_draft_', '');

        // Get draft data from Notion
        const { Client } = await import('@notionhq/client');
        const notion = new Client({ auth: process.env.NOTION_API_KEY });

        const draftPage = await notion.pages.retrieve({ page_id: draftId });

        // Extract preview message info
        const draftDataText = draftPage.properties['Draft Data']?.rich_text?.[0]?.text?.content;
        if (draftDataText) {
            const draftData = JSON.parse(draftDataText);
            const { previewMessageId, previewChannelId } = draftData;

            // Delete preview message
            try {
                const previewChannel = await interaction.client.channels.fetch(previewChannelId);
                const previewMessage = await previewChannel.messages.fetch(previewMessageId);
                await previewMessage.delete();
            } catch (error) {
                console.error('Failed to delete preview message:', error);
            }
        }

        // Draft deleted - Notion entry kept for records

        await interaction.editReply({
            content: '✅ Draft deleted successfully.'
        });

    } catch (error) {
        console.error('Error in handleDeleteDraft:', error);
        await interaction.editReply({
            content: `❌ Failed to delete draft: ${error.message}`
        });
    }
}
