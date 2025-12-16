import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PLATFORM_ACCOUNTS_DB_ID = '2ca6b4f25007801b97bec5e0a93b0b3c';

async function updateTwitterAccount() {
    console.log('🐦 Updating Twitter account with OAuth 1.0a tokens...\n');

    try {
        // First, find the existing Twitter account
        const response = await notion.databases.query({
            database_id: PLATFORM_ACCOUNTS_DB_ID,
            filter: {
                property: 'Platform',
                select: { equals: 'X' }
            }
        });

        if (response.results.length === 0) {
            console.log('❌ No Twitter account found. Creating new one...\n');

            // Create new account
            await notion.pages.create({
                parent: { database_id: PLATFORM_ACCOUNTS_DB_ID },
                properties: {
                    'Name': {
                        title: [{ text: { content: 'DevDsgn Twitter' } }]
                    },
                    'Platform': {
                        select: { name: 'X' }
                    },
                    'Username': {
                        rich_text: [{ text: { content: '@_DevDsgn' } }]
                    },
                    'API Key': {
                        rich_text: [{ text: { content: 'AhRUwDjJACN2qvAidTZa6p6lX' } }]
                    },
                    'API Secret': {
                        rich_text: [{ text: { content: 'fN2U4l098RLrnQViIp15AhOwj54Szxpo7NG9FfT0sQKAgmK2kW' } }]
                    },
                    'Access Token': {
                        rich_text: [{ text: { content: '1946120733333114880-QEiKhBUO8ZO8wkRqKoYzttpi3luEHU' } }]
                    },
                    'Access Token Secret': {
                        rich_text: [{ text: { content: 'Xo7TiOh5HHcMMNZ6dOfQM0JJbLwcVOUGqUhAzNxBRQlnt' } }]
                    }
                }
            });

            console.log('✅ New Twitter account created!\n');
        } else {
            // Update existing account
            const accountId = response.results[0].id;

            await notion.pages.update({
                page_id: accountId,
                properties: {
                    'API Key': {
                        rich_text: [{ text: { content: 'AhRUwDjJACN2qvAidTZa6p6lX' } }]
                    },
                    'API Secret': {
                        rich_text: [{ text: { content: 'fN2U4l098RLrnQViIp15AhOwj54Szxpo7NG9FfT0sQKAgmK2kW' } }]
                    },
                    'Access Token': {
                        rich_text: [{ text: { content: '1946120733333114880-QEiKhBUO8ZO8wkRqKoYzttpi3luEHU' } }]
                    },
                    'Access Token Secret': {
                        rich_text: [{ text: { content: 'Xo7TiOh5HHcMMNZ6dOfQM0JJbLwcVOUGqUhAzNxBRQlnt' } }]
                    }
                }
            });

            console.log('✅ Twitter account updated!\n');
        }

        console.log('Account Details:');
        console.log('   Name: DevDsgn Twitter');
        console.log('   Platform: X');
        console.log('   Username: @_DevDsgn');
        console.log('   API Key: AhRU...p6lX ✅');
        console.log('   API Secret: fN2U...K2kW ✅');
        console.log('   Access Token: 1946...EHU ✅');
        console.log('   Access Token Secret: Xo7T...lnt ✅\n');

        console.log('🎉 All set! You can now post to Twitter!\n');
        console.log('Next steps:');
        console.log('1. Restart the bot');
        console.log('2. Run /post platform:X in Discord');
        console.log('3. Fill in your tweet');
        console.log('4. Upload an image (optional)');
        console.log('5. Watch it post! 🚀\n');

    } catch (error) {
        console.error('❌ Error updating account:', error.message);
    }
}

updateTwitterAccount();
