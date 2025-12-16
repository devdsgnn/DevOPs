import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PLATFORM_ACCOUNTS_DB_ID = '2ca6b4f25007801b97bec5e0a93b0b3c';

async function addClientIdSecret() {
    console.log('🔧 Adding Client ID and Client Secret fields...\n');

    try {
        // Step 1: Add new fields to database
        await notion.databases.update({
            database_id: PLATFORM_ACCOUNTS_DB_ID,
            properties: {
                'Client ID': {
                    rich_text: {}
                },
                'Client Secret': {
                    rich_text: {}
                }
            }
        });

        console.log('✅ Fields added to database!\n');

        // Step 2: Find and update Twitter account
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
                    'Client ID': {
                        rich_text: [{ text: { content: 'MVlUNW5JMjVnOVU0U0lacUZzYWM6MTpjaQ' } }]
                    },
                    'Client Secret': {
                        rich_text: [{ text: { content: '1Bg8gpUW-scvI_C5kyf7UVFWaEwFNC3w0LXgA2SjwDgG0e7ZqX' } }]
                    }
                }
            });

            console.log('✅ Twitter account updated with Client ID and Secret!\n');
            console.log('Account: @_DevDsgn');
            console.log('   Client ID: MVlU...pjaQ ✅');
            console.log('   Client Secret: 1Bg8...ZqX ✅\n');
        } else {
            console.log('❌ Twitter account not found');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

addClientIdSecret();
