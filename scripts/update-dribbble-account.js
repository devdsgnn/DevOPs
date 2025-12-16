import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const platformAccountsDbId = process.env.NOTION_PLATFORM_ACCOUNTS_DB_ID || '2ca6b4f25007801b97bec5e0a93b0b3c';

async function updateDribbbleAccount() {
    try {
        console.log('🔍 Finding Dribbble account in Notion...');

        // Find the Dribbble account
        const response = await notion.databases.query({
            database_id: platformAccountsDbId,
            filter: {
                and: [
                    {
                        property: 'Platform',
                        select: {
                            equals: 'Dribbble'
                        }
                    },
                    {
                        property: 'Username',
                        rich_text: {
                            contains: '_DevDsgn'
                        }
                    }
                ]
            }
        });

        if (response.results.length === 0) {
            console.log('❌ Dribbble account not found.');
            return;
        }

        const pageId = response.results[0].id;
        console.log('✅ Found existing account, updating with Client ID and Secret...');

        await notion.pages.update({
            page_id: pageId,
            properties: {
                'API Key': {
                    rich_text: [{ text: { content: 'B2gdr2qTegi6XP6kv0BA6CwtbYlVd4hcBaK9b5GlHV4' } }]
                },
                'API Secret': {
                    rich_text: [{ text: { content: 'HVxC6x8-kOaBk51ZIY7bClnhX81Bd1VcP9U1fl6EeeQ' } }]
                }
            }
        });

        console.log('✅ Updated Dribbble account with Client credentials!');
        console.log('\n📋 Account Details:');
        console.log('   Name: DevDsgn Dribbble');
        console.log('   Platform: Dribbble');
        console.log('   Username: _DevDsgn');
        console.log('   Client ID: B2gdr2qTegi6XP6kv0BA6CwtbYlVd4hcBaK9b5GlHV4');
        console.log('   Client Secret: HVxC6x8-kOaBk51ZIY7bClnhX81Bd1VcP9U1fl6EeeQ');
        console.log('   Access Token: D6ayqOUZPRfeErUiietqXxfBxSxiBHHVMR44nLeCp2U');
        console.log('\n🚀 Ready to post to Dribbble!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.body) {
            console.error('Details:', JSON.stringify(error.body, null, 2));
        }
    }
}

updateDribbbleAccount();
