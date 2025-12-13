import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import notionManager from '../utils/notionManager.js';

export const data = new SlashCommandBuilder()
    .setName('links')
    .setDescription('View all social media links')
    .addStringOption(option =>
        option.setName('platform')
            .setDescription('Filter by platform (optional)')
            .setRequired(false)
            .addChoices(
                { name: 'All Platforms', value: 'all' },
                { name: '𝕏 (Twitter)', value: 'X' },
                { name: 'Dribbble', value: 'Dribbble' },
                { name: 'YouTube', value: 'YouTube' },
                { name: 'Framer', value: 'Framer' },
                { name: 'Instagram', value: 'Instagram' }
            )
    );

export async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const platform = interaction.options.getString('platform');
    const serverId = interaction.guildId;

    try {
        // Get all links (no pagination)
        const result = await notionManager.getSocialLinks(
            platform === 'all' ? null : platform,
            serverId,
            0,
            1000 // Get all links
        );

        console.log(`📊 Links result:`, {
            total: result.total,
            linksCount: result.links.length
        });

        if (result.links.length === 0) {
            await interaction.editReply({
                content: `No links found${platform && platform !== 'all' ? ` for ${platform}` : ''}.`
            });
            return;
        }

        // Group links by platform
        const linksByPlatform = {};
        result.links.forEach(link => {
            if (!linksByPlatform[link.platform]) {
                linksByPlatform[link.platform] = [];
            }
            linksByPlatform[link.platform].push(link);
        });

        // Create embeds - 10 links per embed
        const embeds = [];
        for (const [platformName, links] of Object.entries(linksByPlatform)) {
            // Split links into chunks of 10
            for (let i = 0; i < links.length; i += 10) {
                const chunk = links.slice(i, i + 10);
                const embed = createLinksEmbed(platformName, chunk, i);
                embeds.push(embed);
            }
        }

        // Send all embeds as new messages in the channel
        for (const embed of embeds) {
            await interaction.channel.send({ embeds: [embed] });
        }

        // Send ephemeral confirmation
        await interaction.editReply({
            content: `✅ Posted ${result.total} link(s) in ${embeds.length} message(s)!`
        });

    } catch (error) {
        console.error('Error fetching links:', error);
        await interaction.editReply({
            content: '❌ Failed to fetch links. Please try again later.'
        });
    }
}


function createLinksEmbed(platformName, links, startIndex) {
    const platformEmojis = {
        'X': '𝕏',
        'Dribbble': '🏀',
        'YouTube': '▶️',
        'Framer': '🎨',
        'Instagram': '📸'
    };

    const emoji = platformEmojis[platformName] || '🔗';
    const title = `${emoji} ${platformName} Links`;

    const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle(title)
        .setTimestamp();

    const linkList = links.map((link, index) => {
        const username = extractUsername(link.url, platformName);
        return `${startIndex + index + 1}. **${username}** • [Go →](${link.url})`;
    }).join('\n');

    embed.setDescription(linkList || 'No links');

    return embed;
}

// Helper function to extract username from URL
function extractUsername(url, platform) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;

        // Remove leading/trailing slashes and get the username
        const parts = pathname.split('/').filter(p => p.length > 0);

        if (parts.length > 0) {
            // For most platforms, username is the first part of the path
            let username = parts[0];

            // Remove @ symbol if present
            username = username.replace('@', '');

            return username;
        }

        return url;
    } catch (error) {
        return url;
    }
}
