import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import notionManager from '../utils/notionManager.js';

export const data = new SlashCommandBuilder()
    .setName('post')
    .setDescription('Post content to social media platforms')
    .addStringOption(option =>
        option.setName('platform')
            .setDescription('Select the platform to post to')
            .setRequired(true)
            .addChoices(
                { name: '𝕏 (Twitter)', value: 'X' },
                { name: 'LinkedIn', value: 'LinkedIn' },
                { name: 'Instagram', value: 'Instagram' },
                { name: 'Dribbble', value: 'Dribbble' }
            )
    );

export async function execute(interaction) {
    const platform = interaction.options.getString('platform');

    // Reply immediately with loading message
    await interaction.reply({
        content: `⏳ Loading ${platform} accounts...`,
        ephemeral: true
    });

    try {
        // Get connected accounts for this platform
        const accounts = await notionManager.getPlatformAccounts(platform);

        if (accounts.length === 0) {
            // No accounts connected
            const addAccountButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Add Account in Notion')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://notion.so/2ca6b4f25007801b97bec5e0a93b0b3c')
                        .setEmoji('📝')
                );

            await interaction.editReply({
                content: `❌ No ${platform} accounts found.\n\nAdd an account in Notion first.`,
                components: [addAccountButton]
            });
            return;
        }

        // Show list of accounts
        let accountList = `📱 **Select a ${platform} account:**\n\n`;
        accounts.forEach((account, index) => {
            const username = account.username ? (account.username.startsWith('@') ? account.username : `@${account.username}`) : '';
            accountList += `**${index + 1}.** ${account.name} ${username}\n`;
        });
        accountList += `\n💬 Reply with the account number (e.g., "1")`;

        await interaction.editReply({
            content: accountList
        });

        // Wait for account selection
        const filter = m => m.author.id === interaction.user.id;
        const accountCollected = await interaction.channel.awaitMessages({
            filter,
            max: 1,
            time: 60000,
            errors: ['time']
        }).catch(() => null);

        if (!accountCollected || accountCollected.size === 0) {
            await interaction.followUp({
                content: '❌ Timeout. Please try again.',
                ephemeral: true
            });
            return;
        }

        let accountMsg = accountCollected.first();

        // Fetch the full message to ensure we have content (Discord.js caching issue)
        try {
            accountMsg = await accountMsg.fetch();
        } catch (e) {
            console.log('Failed to fetch message:', e.message);
        }

        console.log('Collected message:', {
            content: accountMsg.content,
            contentLength: accountMsg.content?.length,
            author: accountMsg.author.tag,
            id: accountMsg.id,
            partial: accountMsg.partial
        });

        if (!accountMsg.content || accountMsg.content.trim() === '') {
            await interaction.followUp({
                content: `❌ No message content received. Debug: partial=${accountMsg.partial}, content="${accountMsg.content}"`,
                ephemeral: true
            });
            return;
        }

        const accountNum = parseInt(accountMsg.content.trim());

        console.log(`Account selection: "${accountMsg.content}" -> ${accountNum} (accounts: ${accounts.length})`);

        if (isNaN(accountNum) || accountNum < 1 || accountNum > accounts.length) {
            await accountMsg.reply(`❌ Invalid account number "${accountMsg.content.trim()}". Please enter a number between 1 and ${accounts.length}.`);
            return;
        }

        const selectedAccount = accounts[accountNum - 1];
        await accountMsg.delete().catch(() => { });

        // Ask for text content
        const textPrompt = await interaction.channel.send({
            content: `✍️ **Enter your ${platform} post text:**\n\n${interaction.user}, type your message below.`
        });

        const textCollected = await interaction.channel.awaitMessages({
            filter,
            max: 1,
            time: 300000, // 5 minutes
            errors: ['time']
        }).catch(() => null);

        if (!textCollected || textCollected.size === 0) {
            await textPrompt.delete().catch(() => { });
            await interaction.followUp({
                content: '❌ Timeout. Please try again.',
                ephemeral: true
            });
            return;
        }


        let textMsg = textCollected.first();

        // Fetch the full message to ensure we have content
        try {
            textMsg = await textMsg.fetch();
        } catch (e) {
            console.log('Failed to fetch text message:', e.message);
        }

        const postText = textMsg.content;
        console.log('📝 Collected text:', postText);

        await textMsg.delete().catch(() => { });
        await textPrompt.delete().catch(() => { });

        const content = { text: postText };

        // Check if platform supports/requires images
        const requiresImage = platform === 'Instagram' || platform === 'Dribbble';
        const supportsImage = platform === 'X' || platform === 'LinkedIn' || requiresImage;

        if (supportsImage) {
            // Ask for image
            const imagePrompt = requiresImage
                ? `📸 **Image Required for ${platform}**\n\n${interaction.user}, send an image in this channel.\n\n⏱️ You have 60 seconds.`
                : `📸 **Add Image? (Optional)**\n\n${interaction.user}, send an image in this channel, or type "skip".\n\n⏱️ You have 60 seconds.`;

            const imagePromptMsg = await interaction.channel.send({
                content: imagePrompt
            });

            const imageCollected = await interaction.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ['time']
            }).catch(() => null);

            if (imageCollected && imageCollected.size > 0) {
                let imageMsg = imageCollected.first();

                // Fetch the full message to ensure we have attachments
                try {
                    imageMsg = await imageMsg.fetch();
                } catch (e) {
                    console.log('Failed to fetch image message:', e.message);
                }

                console.log('📸 Image message:', {
                    content: imageMsg.content,
                    attachments: imageMsg.attachments.size,
                    hasImage: imageMsg.attachments.size > 0
                });

                if (imageMsg.content.toLowerCase() === 'skip' && !requiresImage) {
                    await imageMsg.delete().catch(() => { });
                    await imagePromptMsg.delete().catch(() => { });
                } else if (imageMsg.attachments.size > 0) {
                    const attachment = imageMsg.attachments.first();
                    if (attachment.contentType?.startsWith('image/')) {
                        // Download image immediately before deleting message (Discord CDN URLs expire)
                        try {
                            const fetch = (await import('node-fetch')).default;
                            const response = await fetch(attachment.url);
                            if (!response.ok) {
                                throw new Error(`Failed to download: ${response.statusText}`);
                            }
                            const imageBuffer = await response.arrayBuffer();
                            content.imageBuffer = Buffer.from(imageBuffer);
                            content.imageMimeType = attachment.contentType;
                            console.log('✅ Image downloaded:', content.imageMimeType, content.imageBuffer.length, 'bytes');
                        } catch (error) {
                            console.error('Failed to download image:', error);
                            await imagePromptMsg.delete().catch(() => { });
                            await interaction.followUp({
                                content: `❌ Failed to download image: ${error.message}`,
                                ephemeral: true
                            });
                            return;
                        }

                        await imageMsg.delete().catch(() => { });
                        await imagePromptMsg.delete().catch(() => { });
                    } else {
                        await imagePromptMsg.delete().catch(() => { });
                        await interaction.followUp({
                            content: '❌ Please upload an image file (JPG, PNG, GIF).',
                            ephemeral: true
                        });
                        return;
                    }
                } else if (requiresImage) {
                    await imagePromptMsg.delete().catch(() => { });
                    await interaction.followUp({
                        content: `❌ ${platform} requires an image. Please try again.`,
                        ephemeral: true
                    });
                    return;
                }
            } else if (requiresImage) {
                await imagePromptMsg.delete().catch(() => { });
                await interaction.followUp({
                    content: '❌ Timeout. Please try again and upload an image within 60 seconds.',
                    ephemeral: true
                });
                return;
            } else {
                await imagePromptMsg.delete().catch(() => { });
            }
        }

        // Get draft channel ID from Notion config
        const config = await notionManager.getPostConfig();
        const draftsChannelId = config.draftChannelId || '1450436525585072138';
        const draftsChannel = await interaction.client.channels.fetch(draftsChannelId);

        // Create preview embed
        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = await import('discord.js');

        // Format username - add @ if not already present
        const username = selectedAccount.username || 'account';
        const formattedUsername = username.startsWith('@') ? username : `@${username}`;

        const previewEmbed = new EmbedBuilder()
            .setAuthor({ name: `${selectedAccount.name} (${formattedUsername})` })
            .setDescription(postText)
            .setColor(platform === 'X' ? 0x1DA1F2 : 0x5865F2)
            .setFooter({ text: `${platform} • Preview` })
            .setTimestamp();

        // If there's an image, show it in the preview
        let imageAttachment = null;
        let imageUrl = null;
        if (content.imageBuffer) {
            const { AttachmentBuilder } = await import('discord.js');
            imageAttachment = new AttachmentBuilder(content.imageBuffer, { name: 'preview.png' });
            previewEmbed.setImage('attachment://preview.png');
        }

        // Store all the data we need in a compact format for the button
        // We'll store: platform, accountId, text, imageMessageId (if image exists)
        const previewData = {
            platform,
            accountId: selectedAccount.id,
            accountName: selectedAccount.name,
            text: postText,
            imageUrl: null // Will be set after we send the message with image
        };

        // Create Publish/Delete buttons
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`publish_preview_temp`)
                    .setLabel('Publish')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🚀'),
                new ButtonBuilder()
                    .setCustomId(`delete_preview_temp`)
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🗑️')
            );

        // Send preview message
        const previewMessage = imageAttachment
            ? await draftsChannel.send({
                embeds: [previewEmbed],
                components: [buttons],
                files: [imageAttachment]
            })
            : await draftsChannel.send({
                embeds: [previewEmbed],
                components: [buttons]
            });

        // If there's an image, get its URL from the sent message
        if (imageAttachment && previewMessage.embeds[0]?.image?.url) {
            previewData.imageUrl = previewMessage.embeds[0].image.url;
        }

        // Encode the preview data as base64 to fit in custom ID (max 100 chars)
        // We'll store it in the message itself as a hidden field
        const dataString = JSON.stringify(previewData);
        const dataBase64 = Buffer.from(dataString).toString('base64');

        // Update buttons with message ID (we'll fetch data from the message when publishing)
        const updatedButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`publish_preview_${previewMessage.id}`)
                    .setLabel('Publish')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🚀'),
                new ButtonBuilder()
                    .setCustomId(`delete_preview_${previewMessage.id}`)
                    .setLabel('Delete')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🗑️')
            );

        // Add the data as an embed field
        previewEmbed.setFields([
            { name: '\u200b', value: `\`\`\`${dataBase64}\`\`\``, inline: false }
        ]);

        await previewMessage.edit({
            embeds: [previewEmbed],
            components: [updatedButtons]
        });


        // Confirm to user
        await interaction.followUp({
            content: `✅ Preview created! Check <#${draftsChannelId}> to publish when ready.`,
            ephemeral: true
        });

    } catch (error) {
        console.error('Error in post command:', error);

        try {
            await interaction.followUp({
                content: '❌ An error occurred. Please try again later.',
                ephemeral: true
            });
        } catch (e) {
            console.error('Failed to send error message:', e.message);
        }
    }
}
