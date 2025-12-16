import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const MAIN_CONFIG_DB_ID = process.env.NOTION_MAIN_DATABASE_ID;

async function verifySetup() {
    console.log('🔍 Verifying Platform Accounts setup...\n');

    try {
        // Query Main Config database
        const response = await notion.databases.query({
            database_id: MAIN_CONFIG_DB_ID
        });

        // Look for Platform Accounts DB ID
        let platformAccountsDbId = null;

        for (const page of response.results) {
            const configName = page.properties.Name?.title?.[0]?.plain_text || '';

            if (configName === 'DB - PlatformAccounts' || configName.includes('PlatformAccounts')) {
                platformAccountsDbId = page.properties.Value?.rich_text?.[0]?.plain_text;
                console.log('✅ Platform Accounts DB found in Main Config');
                console.log(`   Name: ${configName}`);
                console.log(`   Database ID: ${platformAccountsDbId}\n`);
                break;
            }
        }

        if (!platformAccountsDbId) {
            console.log('❌ Platform Accounts DB ID not found in Main Config\n');
            return;
        }

        // Verify the Platform Accounts database structure
        console.log('🔍 Checking Platform Accounts database structure...\n');

        const dbInfo = await notion.databases.retrieve({
            database_id: platformAccountsDbId
        });

        const expectedFields = [
            'Name',
            'Platform',
            'Username',
            'Access Token',
            'Refresh Token',
            'Platform User ID'
        ];

        console.log('Database Fields:');
        expectedFields.forEach(field => {
            if (dbInfo.properties[field]) {
                const type = dbInfo.properties[field].type;
                console.log(`   ✅ ${field} (${type})`);
            } else {
                console.log(`   ❌ ${field} - MISSING`);
            }
        });

        console.log('\n📊 Platform Options:');
        if (dbInfo.properties.Platform?.select?.options) {
            dbInfo.properties.Platform.select.options.forEach(option => {
                console.log(`   • ${option.name} (${option.color})`);
            });
        }

        console.log('\n🎉 Setup verification complete!');
        console.log('\n📝 Next Steps:');
        console.log('1. Complete OAuth setup for your desired platforms');
        console.log('2. Add your first account to Platform Accounts database:');
        console.log('   • Name: e.g., "Company Twitter"');
        console.log('   • Platform: Select from dropdown (X, LinkedIn, Instagram, Dribbble)');
        console.log('   • Username: Your platform username');
        console.log('   • Access Token: OAuth access token');
        console.log('   • Platform User ID: LinkedIn person ID or Instagram Business Account ID (if needed)');
        console.log('3. Run /post in Discord to start posting!\n');

    } catch (error) {
        console.error('❌ Error verifying setup:', error.message);

        if (error.code === 'object_not_found') {
            console.error('\n⚠️  Database not found. Please check:');
            console.error('   • Database ID is correct');
            console.error('   • Notion integration has access to the database');
        }
    }
}

verifySetup();
