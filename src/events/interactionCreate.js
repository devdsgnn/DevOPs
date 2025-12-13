import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import notionManager from '../utils/notionManager.js';
import { extractMetadata, takeScreenshot, truncateDescription } from '../utils/webpageUtils.js';

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

        // Step 3: Take screenshot (with 20 second load time)
        let screenshot = null;
        try {
            screenshot = await takeScreenshot(url, 20000);
            console.log(`⏱️  Screenshot captured in ${Date.now() - startTime}ms`);
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

