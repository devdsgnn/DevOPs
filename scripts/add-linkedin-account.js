import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const platformAccountsDbId = process.env.NOTION_PLATFORM_ACCOUNTS_DB_ID || '2ca6b4f25007801b97bec5e0a93b0b3c';

async function addLinkedInAccount() {
    try {
        console.log('📝 Adding LinkedIn account to Notion...');

        const accountData = {
            name: 'DevDsgn LinkedIn',
            platform: 'LinkedIn',
            username: 'devdsgn',
            accessToken: process.env.LINKEDIN_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE',
            platformUserId: 'devdsgn', // Using username as fallback
            clientId: process.env.LINKEDIN_CLIENT_ID || 'YOUR_CLIENT_ID_HERE',
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE'
        };

        await notion.pages.create({
            parent: { database_id: platformAccountsDbId },
            properties: {
                Name: {
                    title: [{ text: { content: accountData.name } }]
                },
                Platform: {
                    select: { name: accountData.platform }
                },
                Username: {
                    rich_text: [{ text: { content: accountData.username } }]
                },
                'Access Token': {
                    rich_text: [{ text: { content: accountData.accessToken } }]
                },
                'Platform User ID': {
                    rich_text: [{ text: { content: accountData.platformUserId } }]
                },
                'API Key': {
                    rich_text: [{ text: { content: accountData.clientId } }]
                },
                'API Secret': {
                    rich_text: [{ text: { content: accountData.clientSecret } }]
                }
            }
        });

        console.log('✅ LinkedIn account added successfully!');
        console.log('\n📋 Account Details:');
        console.log('   Name:', accountData.name);
        console.log('   Platform:', accountData.platform);
        console.log('   Username:', accountData.username);
        console.log('\n🚀 You can now use /post command with LinkedIn!');

    } catch (error) {
        console.error('❌ Error adding account:', error.message);
        if (error.body) {
            console.error('Details:', JSON.stringify(error.body, null, 2));
        }
    }
}

addLinkedInAccount();
