import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const platformAccountsDbId = process.env.NOTION_PLATFORM_ACCOUNTS_DB_ID || '2ca6b4f25007801b97bec5e0a93b0b3c';

async function addDribbbleAccount() {
    try {
        console.log('📝 Adding Dribbble account to Notion...');

        const accountData = {
            name: 'DevDsgn Dribbble',
            platform: 'Dribbble',
            username: '_DevDsgn',
            accessToken: 'D6ayqOUZPRfeErUiietqXxfBxSxiBHHVMR44nLeCp2U'
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
                }
            }
        });

        console.log('✅ Dribbble account added successfully!');
        console.log('\n📋 Account Details:');
        console.log('   Name:', accountData.name);
        console.log('   Platform:', accountData.platform);
        console.log('   Username:', accountData.username);
        console.log('   Token Scope: upload');
        console.log('\n🚀 You can now use /post platform:Dribbble in Discord!');

    } catch (error) {
        console.error('❌ Error adding account:', error.message);
        if (error.body) {
            console.error('Details:', JSON.stringify(error.body, null, 2));
        }
    }
}

addDribbbleAccount();
