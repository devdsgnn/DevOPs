import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PLATFORM_ACCOUNTS_DB_ID = '2ca6b4f25007801b97bec5e0a93b0b3c';

async function updateDatabaseForTwitterOAuth() {
    console.log('🔧 Updating Platform Accounts database for Twitter OAuth 1.0a...\n');

    try {
        // Add new fields for Twitter OAuth 1.0a
        const properties = {
            'API Key': {
                rich_text: {}
            },
            'API Secret': {
                rich_text: {}
            },
            'Access Token Secret': {
                rich_text: {}
            }
        };

        await notion.databases.update({
            database_id: PLATFORM_ACCOUNTS_DB_ID,
            properties: properties
        });

        console.log('✅ Database updated successfully!\n');
        console.log('Added fields:');
        console.log('   • API Key (Text) - For Twitter OAuth 1.0a');
        console.log('   • API Secret (Text) - For Twitter OAuth 1.0a');
        console.log('   • Access Token Secret (Text) - For Twitter OAuth 1.0a\n');

        console.log('📝 Note: The existing "Access Token" field will now store the OAuth 1.0a Access Token\n');

        console.log('🎯 Next Steps:');
        console.log('1. Go to Twitter Developer Portal');
        console.log('2. Get your 4 OAuth 1.0a tokens (see docs/TWITTER_OAUTH_SETUP.md)');
        console.log('3. Update your Twitter account in Notion with all 4 tokens\n');

    } catch (error) {
        console.error('❌ Error updating database:', error.message);
    }
}

updateDatabaseForTwitterOAuth();
