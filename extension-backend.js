// Simple backend server to handle extension requests
// This runs alongside your Discord bot and uses the same credentials

import express from 'express';
import cors from 'cors';
import { Client as DiscordClient, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import notionManager from './src/utils/notionManager.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

// Enable CORS for Chrome extension
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Discord client
const discordClient = new DiscordClient({
    intents: []
});

await discordClient.login(process.env.DISCORD_BOT_TOKEN);
console.log('✅ Discord bot connected for extension');

// Endpoint to save site inspiration
app.post('/api/save-inspiration', async (req, res) => {
    try {
        const { title, description, url, screenshot } = req.body;

        console.log('📸 Extension request:', title);

        // 1. Save to Notion (optional - don't fail if this errors)
        try {
            await notionManager.addSiteInspiration(url, title, description);
            console.log('✅ Saved to Notion');
        } catch (notionError) {
            console.warn('⚠️ Notion save failed (continuing anyway):', notionError.message);
        }

        // 2. Get channel IDs
        // If 'channels' provided in body, use those. Otherwise use default.
        const { channels } = req.body;

        let targetChannelIds = [];

        if (channels && channels.length > 0) {
            targetChannelIds = channels.map(ch => ch.id);
        } else {
            // Default fallback
            let defaultId = process.env.SITE_INSPIRATION_CHANNEL_ID;
            if (!defaultId) {
                const config = await notionManager.getPostConfig();
                defaultId = config.publishChannelId;
            }
            if (defaultId) {
                targetChannelIds.push(defaultId);
            }
        }

        if (targetChannelIds.length === 0) {
            throw new Error('No channel ID configured! Select a channel or add default to .env');
        }

        // 3. Convert base64 screenshot to buffer
        const base64Data = screenshot.replace(/^data:image\/png;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const attachment = new AttachmentBuilder(imageBuffer, { name: 'screenshot.png' });

        // 4. Create Discord embed
        const truncatedDesc = description && description.length > 200
            ? description.substring(0, 200) + '...'
            : description || 'No description available';

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(title)
            .setURL(url)
            .setDescription(truncatedDesc)
            .setImage('attachment://screenshot.png')
            .setTimestamp()
            .setFooter({ text: 'Saved to Notion & Discord' });

        // 5. Send to all channels
        const results = [];
        for (const chId of targetChannelIds) {
            try {
                const channel = await discordClient.channels.fetch(chId);
                await channel.send({
                    embeds: [embed],
                    files: [new AttachmentBuilder(imageBuffer, { name: 'screenshot.png' })]
                });
                results.push({ id: chId, success: true });
                console.log(`✅ Saved to channel ${chId}`);
            } catch (err) {
                console.error(`❌ Failed to send to channel ${chId}:`, err.message);
                results.push({ id: chId, success: false, error: err.message });
            }
        }

        console.log(`✅ Saved to ${results.filter(r => r.success).length}/${targetChannelIds.length} channels`);

        res.json({ success: true, message: 'Saved successfully!' });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Endpoint to save image directly (Pinterest-style)
app.post('/api/save-image', async (req, res) => {
    try {
        const { imageDataUrl, postUrl, pageTitle, isSocialMedia, channels } = req.body;

        console.log('📌 Image save request:', pageTitle, 'to', channels?.length || 1, 'channel(s)');

        // Convert base64 to buffer
        const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Create Discord embed
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(pageTitle)
            .setURL(postUrl)
            .setImage('attachment://image.png')
            .setTimestamp();

        // Add footer based on source
        if (isSocialMedia) {
            if (postUrl.includes('twitter.com') || postUrl.includes('x.com')) {
                embed.setFooter({ text: '📌 Saved from X/Twitter' });
            } else if (postUrl.includes('instagram.com')) {
                embed.setFooter({ text: '📌 Saved from Instagram' });
            } else if (postUrl.includes('pinterest.com')) {
                embed.setFooter({ text: '📌 Saved from Pinterest' });
            } else {
                embed.setFooter({ text: '📌 Saved Image' });
            }
        } else {
            embed.setFooter({ text: '📌 Saved Image' });
        }

        const attachment = new AttachmentBuilder(imageBuffer, { name: 'image.png' });

        // Send to all selected channels
        const channelIds = channels && channels.length > 0
            ? channels.map(ch => ch.id)
            : [process.env.SITE_INSPIRATION_CHANNEL_ID || (await notionManager.getPostConfig()).publishChannelId];

        const results = [];
        for (const channelId of channelIds) {
            try {
                const channel = await discordClient.channels.fetch(channelId);
                await channel.send({
                    embeds: [embed],
                    files: [new AttachmentBuilder(imageBuffer, { name: 'image.png' })]
                });
                results.push({ channelId, success: true });
                console.log(`✅ Image saved to channel ${channelId}`);
            } catch (err) {
                console.error(`❌ Failed to save to channel ${channelId}:`, err.message);
                results.push({ channelId, success: false, error: err.message });
            }
        }

        const successCount = results.filter(r => r.success).length;
        console.log(`✅ Image saved to ${successCount}/${channelIds.length} channel(s)`);

        res.json({
            success: successCount > 0,
            message: `Saved to ${successCount}/${channelIds.length} channel(s)`,
            results
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Extension backend running' });
});

// Get available Discord channels from Notion
app.get('/api/channels', async (req, res) => {
    try {
        console.log('📊 Fetching channels from Notion...');
        console.log('🔑 Using main database ID:', notionManager.mainDatabaseId);

        // Get config from main database
        const config = await notionManager.getConfig();
        console.log('✅ Got config from main database');

        // Look for Publish Channel IDs database
        let publishChannelDbId = null;

        // Query main database again to find "DB - Publish Channel IDs"
        const response = await notionManager.notion.databases.query({
            database_id: notionManager.mainDatabaseId
        });

        console.log(`📋 Found ${response.results.length} entries in main database`);

        for (const page of response.results) {
            const configName = page.properties.Name?.title?.[0]?.plain_text || '';
            const configValue = page.properties.Value?.rich_text?.[0]?.plain_text || '';

            console.log(`  - ${configName}: ${configValue}`);

            if (configName === 'DB - Publish Channel IDs') {
                publishChannelDbId = configValue.trim();
                console.log('✅ Found Publish Channel IDs entry:', publishChannelDbId);
                break;
            }
        }

        if (!publishChannelDbId) {
            console.log('⚠️ No "DB - Publish Channel IDs" found in main database');
            console.log('💡 Please add an entry in your main Notion database:');
            console.log('   Name: "DB - Publish Channel IDs"');
            console.log('   Value: "2cc6b4f2500780a7b4ebf60c6646236f"');
            return res.json({
                channels: [],
                error: 'No "DB - Publish Channel IDs" found in main database. Please add it to your Notion main database.'
            });
        }

        console.log('📊 Found Publish Channel IDs DB:', publishChannelDbId);

        // Fetch all channels from the database
        const channelsResponse = await notionManager.notion.databases.query({
            database_id: publishChannelDbId
        });

        // Extract channel name and ID
        const channels = channelsResponse.results.map(page => {
            // Name is a Title property
            const name = page.properties.Name?.title?.[0]?.plain_text || 'Unnamed';

            // Channel ID is a Text (rich_text) property
            const channelId = page.properties['Channel ID']?.rich_text?.[0]?.plain_text || null;

            return {
                id: channelId,
                name: name
            };
        }).filter(ch => ch.id); // Only include channels with valid IDs

        console.log(`✅ Found ${channels.length} channel(s):`, channels.map(ch => ch.name).join(', '));
        res.json({ channels });

    } catch (error) {
        console.error('❌ Error fetching channels:', error);
        res.json({ channels: [], error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Extension backend running on http://localhost:${PORT}`);
    console.log(`📸 Ready to receive screenshot requests from Chrome extension`);
});
