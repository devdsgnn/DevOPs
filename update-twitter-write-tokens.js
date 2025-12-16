import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PLATFORM_ACCOUNTS_DB_ID = '2ca6b4f25007801b97bec5e0a93b0b3c';

async function updateTwitterTokensWithWritePermission() {
    console.log('🔐 Updating Twitter tokens with Read & Write permissions...\n');

    try {
        // Find Twitter account
        const response = await notion.databases.query({
            database_id: PLATFORM_ACCOUNTS_DB_ID,
            filter: {
                property: 'Platform',
                select: { equals: 'X' }
            }
        });

        if (response.results.length > 0) {
            const accountId = response.results[0].id;

            await notion.pages.update({
                page_id: accountId,
                properties: {
                    'Access Token': {
                        rich_text: [{ text: { content: '1946120733333114880-dMuTnkBCjTGDH2aghCdfkGiPQohf1c' } }]
                    },
                    'Access Token Secret': {
                        rich_text: [{ text: { content: 'BKKP7l5JbnWgDSlG8DbWR0RKz6Qsulq2IiVsuKJszfG8f' } }]
                    },
                    'Client Secret': {
                        rich_text: [{ text: { content: '1Bg8gpUW-scvI_C5kyf7UVFWaEwFNC3w0LXgA2SjwDgG0e7ZqX' } }]
                    }
                }
            });

            console.log('✅ Twitter account updated with Read & Write tokens!\n');
            console.log('Account: @_DevDsgn');
            console.log('   Access Token: 1946...f1c ✅ (NEW - Read & Write)');
            console.log('   Access Token Secret: BKKP...G8f ✅ (NEW - Read & Write)');
            console.log('   Client Secret: 1Bg8...ZqX ✅\n');

            console.log('🎉 All set! Your app now has Read & Write permissions!\n');
            console.log('Next steps:');
            console.log('1. Bot is already running');
            console.log('2. Run /post platform:X in Discord');
            console.log('3. Post your first tweet! 🚀\n');

        } else {
            console.log('❌ Twitter account not found');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

updateTwitterTokensWithWritePermission();
