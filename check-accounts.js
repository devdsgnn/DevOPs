import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PLATFORM_ACCOUNTS_DB_ID = '2ca6b4f25007801b97bec5e0a93b0b3c';

async function checkAccounts() {
    console.log('🔍 Checking Platform Accounts database...\n');

    try {
        // Query the database
        const response = await notion.databases.query({
            database_id: PLATFORM_ACCOUNTS_DB_ID
        });

        console.log(`Found ${response.results.length} account(s) in database\n`);

        if (response.results.length === 0) {
            console.log('❌ No accounts found in database!');
            console.log('\nThis means the account was not saved properly.');
            console.log('Let me try adding it again...\n');
            return false;
        }

        // Display each account
        response.results.forEach((page, index) => {
            console.log(`Account ${index + 1}:`);
            console.log(`   Name: ${page.properties.Name?.title?.[0]?.plain_text || 'N/A'}`);
            console.log(`   Platform: ${page.properties.Platform?.select?.name || 'N/A'}`);
            console.log(`   Username: ${page.properties.Username?.rich_text?.[0]?.plain_text || 'N/A'}`);
            console.log(`   Access Token: ${page.properties['Access Token']?.rich_text?.[0]?.plain_text ? '✅ Present' : '❌ Missing'}`);
            console.log(`   ID: ${page.id}\n`);
        });

        return true;

    } catch (error) {
        console.error('❌ Error checking database:', error.message);

        if (error.code === 'object_not_found') {
            console.error('\n⚠️  Database not found!');
            console.error('   • Check database ID is correct');
            console.error('   • Verify Notion integration has access');
        }

        return false;
    }
}

checkAccounts();
