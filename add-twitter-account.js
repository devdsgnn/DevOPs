import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PLATFORM_ACCOUNTS_DB_ID = '2ca6b4f25007801b97bec5e0a93b0b3c';

async function addTwitterAccount() {
    console.log('🐦 Adding Twitter/X account to Notion...\n');

    try {
        const response = await notion.pages.create({
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
                'Access Token': {
                    rich_text: [{ text: { content: 'AAAAAAAAAAAAAAAAAAAAALWk6AEAAAAAlVYnftzxb111cK1dJSLfD2%2FztMc%3Dxss2O30rCR7VyMCw5pGa2VvLGWjQNC6uf7obwlGnx3HWStW9oG' } }]
                }
            }
        });

        console.log('✅ Twitter account added successfully!\n');
        console.log('Account Details:');
        console.log('   Name: DevDsgn Twitter');
        console.log('   Platform: X');
        console.log('   Username: @_DevDsgn');
        console.log('   Access Token: ****...StW9oG (hidden for security)\n');
        console.log('🎉 You\'re all set!\n');
        console.log('Next steps:');
        console.log('1. Go to Discord');
        console.log('2. Run: /post platform:X');
        console.log('3. Select "DevDsgn Twitter" from the dropdown');
        console.log('4. Fill in your tweet content');
        console.log('5. Submit and watch it post to Twitter! 🚀\n');

    } catch (error) {
        console.error('❌ Error adding account:', error.message);

        if (error.code === 'object_not_found') {
            console.error('\n⚠️  Database not found. Please check:');
            console.error('   • Database ID is correct');
            console.error('   • Notion integration has access to the database');
        } else if (error.code === 'validation_error') {
            console.error('\n⚠️  Validation error. Please check:');
            console.error('   • All required fields exist in the database');
            console.error('   • Platform select has "X" as an option');
        }
    }
}

addTwitterAccount();
