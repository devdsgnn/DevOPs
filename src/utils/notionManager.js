import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

class NotionManager {
  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_API_KEY });
    this.mainDatabaseId = process.env.NOTION_MAIN_DATABASE_ID;
    this.cache = {
      config: null,
      lastFetch: null,
      cacheDuration: 5 * 60 * 1000 // 5 minutes
    };
  }

  /**
   * Fetch configuration from the main Notion database
   * This database should contain:
   * - Discord Token
   * - Discord Server IDs
   * - Channel IDs
   * - Social Links Database ID
   */
  async getConfig() {
    try {
      // Check cache first
      if (this.cache.config && this.cache.lastFetch &&
        (Date.now() - this.cache.lastFetch < this.cache.cacheDuration)) {
        return this.cache.config;
      }

      const response = await this.notion.databases.query({
        database_id: this.mainDatabaseId,
      });

      const config = {
        discordToken: null,
        discordClientId: null,
        servers: [],
        socialLinksDbId: null,
        siteInspirationsDbId: null,
        platformAccountsDbId: null,
      };

      // Parse the configuration from Notion
      for (const page of response.results) {
        const props = page.properties;

        // Get config name from the Name column (title)
        const configName = props.Name?.title?.[0]?.plain_text || '';

        // Get the value - check both rich_text and plain text formats
        const configValue = props.Value?.rich_text?.[0]?.plain_text ||
          props.Value?.url ||
          props.Value?.title?.[0]?.plain_text;

        // Match based on the Name field
        if (configName === 'DB - SocialLinks' || configName.includes('Social') || configName === 'SOCIAL_LINKS_DB_ID') {
          config.socialLinksDbId = configValue;
          console.log('📊 Found Social Links DB ID:', configValue);
        } else if (configName === 'DB - SiteInspirations' || configName.includes('SiteInspirations') || configName === 'SITE_INSPIRATIONS_DB_ID') {
          config.siteInspirationsDbId = configValue;
          console.log('📊 Found Site Inspirations DB ID:', configValue);
        } else if (configName === 'DB - PlatformAccounts' || configName.includes('PlatformAccounts') || configName === 'PLATFORM_ACCOUNTS_DB_ID') {
          config.platformAccountsDbId = configValue;
          console.log('📊 Found Platform Accounts DB ID:', configValue);
        } else if (configName === 'Discord Token' || configName === 'DISCORD_TOKEN') {
          config.discordToken = configValue;
        } else if (configName === 'Discord Client ID' || configName === 'DISCORD_CLIENT_ID') {
          config.discordClientId = configValue;
        } else if (configName === 'Discord Server') {
          const serverId = props['Server ID']?.rich_text?.[0]?.plain_text;
          const channelId = props['Channel ID']?.rich_text?.[0]?.plain_text;
          if (serverId && channelId) {
            config.servers.push({ serverId, channelId });
          }
        }
      }

      // Update cache
      this.cache.config = config;
      this.cache.lastFetch = Date.now();

      return config;
    } catch (error) {
      console.error('Error fetching Notion config:', error);
      throw error;
    }
  }

  /**
   * Get the Social Links Database ID from config
   */
  async getSocialLinksDbId() {
    const config = await this.getConfig();
    return config.socialLinksDbId;
  }

  /**
   * Add a social media link to Notion
   */
  async addSocialLink(platform, accountUrl, serverId, userId) {
    try {
      const dbId = await this.getSocialLinksDbId();

      // Extract username from URL for the title
      const username = this.extractUsername(accountUrl, platform);

      // Build properties - only include fields that exist in the database
      const properties = {
        'Name': {
          title: [{ text: { content: username } }]
        },
        'Platform': {
          select: { name: platform }
        },
        'Account URL': {
          url: accountUrl
        }
      };

      const response = await this.notion.pages.create({
        parent: { database_id: dbId },
        properties
      });

      return response;
    } catch (error) {
      console.error('Error adding social link to Notion:', error);
      throw error;
    }
  }

  /**
   * Get all social links for a specific platform and server
   */
  async getSocialLinks(platform = null, serverId = null, page = 0, pageSize = 10) {
    try {
      const dbId = await this.getSocialLinksDbId();

      const filters = [];

      if (platform) {
        filters.push({
          property: 'Platform',
          select: { equals: platform }
        });
      }

      const response = await this.notion.databases.query({
        database_id: dbId,
        filter: filters.length > 0 ? {
          and: filters
        } : undefined,
        page_size: 100 // Get all, we'll paginate manually
      });

      // Manual pagination
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = response.results.slice(startIndex, endIndex);

      const links = paginatedResults.map(page => ({
        id: page.id,
        platform: page.properties.Platform?.select?.name,
        url: page.properties['Account URL']?.url,
        addedBy: null,
        addedDate: null
      }));

      return {
        links,
        hasMore: endIndex < response.results.length,
        total: response.results.length,
        currentPage: page,
        totalPages: Math.ceil(response.results.length / pageSize)
      };
    } catch (error) {
      console.error('Error fetching social links from Notion:', error);
      throw error;
    }
  }

  /**
   * Extract username from social media URL
   */
  extractUsername(url, platform) {
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

      // Fallback to platform name if we can't extract
      return platform || 'Link';
    } catch (error) {
      return platform || 'Link';
    }
  }

  /**
   * Get the Site Inspirations Database ID from config
   */
  async getSiteInspirationsDbId() {
    const config = await this.getConfig();
    return config.siteInspirationsDbId;
  }

  /**
   * Add a site inspiration to Notion
   */
  async addSiteInspiration(url, title, description) {
    try {
      const dbId = await this.getSiteInspirationsDbId();

      if (!dbId) {
        throw new Error('Site Inspirations database ID not configured in Notion');
      }

      // Build properties for the site inspiration
      const properties = {
        'Name': {
          title: [{ text: { content: title || url } }]
        },
        'URL': {
          url: url
        }
      };

      // Add description if provided
      if (description) {
        properties['Description'] = {
          rich_text: [{ text: { content: description } }]
        };
      }

      const response = await this.notion.pages.create({
        parent: { database_id: dbId },
        properties
      });

      console.log('✅ Site inspiration saved to Notion:', title);
      return response;
    } catch (error) {
      console.error('Error adding site inspiration to Notion:', error);
      throw error;
    }
  }

  /**
   * Get the Platform Accounts Database ID from config
   */
  async getPlatformAccountsDbId() {
    const config = await this.getConfig();
    return config.platformAccountsDbId;
  }

  /**
   * Add a platform account with OAuth credentials
   */
  async addPlatformAccount(platform, accountName, username, accessToken, refreshToken = null, platformUserId = null) {
    try {
      const dbId = await this.getPlatformAccountsDbId();

      if (!dbId) {
        throw new Error('Platform Accounts database ID not configured in Notion');
      }

      const properties = {
        'Name': {
          title: [{ text: { content: accountName } }]
        },
        'Platform': {
          select: { name: platform }
        },
        'Username': {
          rich_text: [{ text: { content: username || '' } }]
        },
        'Access Token': {
          rich_text: [{ text: { content: accessToken } }]
        }
      };

      // Add refresh token if provided
      if (refreshToken) {
        properties['Refresh Token'] = {
          rich_text: [{ text: { content: refreshToken } }]
        };
      }

      // Add platform user ID if provided (for LinkedIn person ID or Instagram Business Account ID)
      if (platformUserId) {
        properties['Platform User ID'] = {
          rich_text: [{ text: { content: platformUserId } }]
        };
      }

      const response = await this.notion.pages.create({
        parent: { database_id: dbId },
        properties
      });

      console.log(`✅ ${platform} account saved to Notion:`, accountName);
      return response;
    } catch (error) {
      console.error('Error adding platform account to Notion:', error);
      throw error;
    }
  }

  /**
   * Get all platform accounts for a specific platform
   */
  async getPlatformAccounts(platform, serverId = null) {
    try {
      const dbId = await this.getPlatformAccountsDbId();

      if (!dbId) {
        return []; // Return empty array if database not configured
      }

      const filters = [
        {
          property: 'Platform',
          select: { equals: platform }
        }
      ];

      const response = await this.notion.databases.query({
        database_id: dbId,
        filter: {
          and: filters
        }
      });

      const accounts = response.results.map(page => ({
        id: page.id,
        name: page.properties.Name?.title?.[0]?.plain_text || 'Unnamed Account',
        platform: page.properties.Platform?.select?.name,
        username: page.properties.Username?.rich_text?.[0]?.plain_text,
        access_token: page.properties['Access Token']?.rich_text?.[0]?.plain_text,
        refresh_token: page.properties['Refresh Token']?.rich_text?.[0]?.plain_text,
        platform_user_id: page.properties['Platform User ID']?.rich_text?.[0]?.plain_text,
        // Twitter OAuth 1.0a fields
        api_key: page.properties['API Key']?.rich_text?.[0]?.plain_text,
        api_secret: page.properties['API Secret']?.rich_text?.[0]?.plain_text,
        access_token_secret: page.properties['Access Token Secret']?.rich_text?.[0]?.plain_text
      }));

      return accounts;
    } catch (error) {
      console.error('Error fetching platform accounts from Notion:', error);
      return [];
    }
  }

  /**
   * Update platform account tokens (for token refresh)
   */
  async updatePlatformAccountTokens(accountId, accessToken, refreshToken = null) {
    try {
      const properties = {
        'Access Token': {
          rich_text: [{ text: { content: accessToken } }]
        }
      };

      if (refreshToken) {
        properties['Refresh Token'] = {
          rich_text: [{ text: { content: refreshToken } }]
        };
      }

      await this.notion.pages.update({
        page_id: accountId,
        properties
      });

      console.log('✅ Platform account tokens updated');
    } catch (error) {
      console.error('Error updating platform account tokens:', error);
      throw error;
    }
  }

  /**
   * Clear the configuration cache (useful for forcing a refresh)
   */
  clearCache() {
    this.cache.config = null;
    this.cache.lastFetch = null;
  }

  /**
   * Get post-related configuration (draft channel, publish channel, server ID)
   */
  async getPostConfig() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.mainDatabaseId,
      });

      const config = {
        draftChannelId: null,
        publishChannelId: null,
        serverId: null
      };

      // Parse the configuration from Notion
      for (const page of response.results) {
        const props = page.properties;
        const configName = props.Name?.title?.[0]?.plain_text || '';
        const configValue = props.Value?.rich_text?.[0]?.plain_text ||
          props.Value?.url ||
          props.Value?.title?.[0]?.plain_text;

        if (configName === 'Draft Channel ID' || configName === 'POST_DRAFT_CHANNEL_ID') {
          config.draftChannelId = configValue;
          console.log('📝 Found Draft Channel ID:', configValue);
        } else if (configName === 'Publish Channel ID' || configName === 'POST_PUBLISH_CHANNEL_ID') {
          config.publishChannelId = configValue;
          console.log('📢 Found Publish Channel ID:', configValue);
        } else if (configName === 'Post Server ID' || configName === 'POST_SERVER_ID') {
          config.serverId = configValue;
          console.log('🖥️ Found Server ID:', configValue);
        }
      }

      return config;
    } catch (error) {
      console.error('Error fetching post config from Notion:', error);
      throw error;
    }
  }
}

export default new NotionManager();
