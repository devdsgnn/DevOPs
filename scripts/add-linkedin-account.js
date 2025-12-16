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
            accessToken: 'AQWNPo7k4gEVEMyv3eTtxv2pvVF5FNTbtlaSOfbCAMHukD7KCtITgmiGdUg2ai_G8hlPJpbddFWaeO4RpixE3YmI8DE7lKhIuEdYO_-TbDDrrmcSMz_gssC_GNBgvssQ2HY6yB2pcf-jn2OZhQc8hZ4X3sTezND5jvnG5FYTBRcEsbQJUuZvpDVcIs260tFLcEBKYurtFxhyG6vZtcek069e-TF1OfRciXZJWJ1z8wp-1ojtHDsisTAFJzbviOJcj79gLzfqj2a8Jt7lnmbpD8208nm3xczXznpaomb7w5n3nYLeTT1_DUdigiIjXlGYSbnwm4ALUqRFKhwbR3mgFN7sdP-vxg',
            platformUserId: 'devdsgn', // Using username as fallback
            clientId: '86fzo0cgmre1ai',
            clientSecret: 'WPL_AP1.3QyuHCZsatlDwUOQ.S2/MDg=='
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
