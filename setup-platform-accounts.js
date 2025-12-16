import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const PLATFORM_ACCOUNTS_DB_ID = '2ca6b4f25007801b97bec5e0a93b0b3c';
const MAIN_CONFIG_DB_ID = process.env.NOTION_MAIN_DATABASE_ID;

async function updatePlatformAccountsDatabase() {
    console.log('🔧 Updating Platform Accounts database structure...\n');

    try {
        // Step 1: Remove old fields and add new unified field
        console.log('📋 Updating database fields...');

        const properties = {
            // Keep existing fields
            'Platform': {
                select: {
                    options: [
                        { name: 'X', color: 'default' },
                        { name: 'LinkedIn', color: 'blue' },
                        { name: 'Instagram', color: 'purple' },
                        { name: 'Dribbble', color: 'pink' }
                    ]
                }
            },
            'Username': {
                rich_text: {}
            },
            'Access Token': {
                rich_text: {}
            },
            'Refresh Token': {
                rich_text: {}
            },
            // New unified field
            'Platform User ID': {
                rich_text: {}
            },
            // Remove old fields by setting them to null
            'User ID': null,
            'IG User ID': null,
            'Server ID': null,
            'Added By': null
        };

        await notion.databases.update({
            database_id: PLATFORM_ACCOUNTS_DB_ID,
            properties: properties
        });

        console.log('✅ Database structure updated successfully!\n');
        console.log('   Removed fields:');
        console.log('   • User ID (replaced with Platform User ID)');
        console.log('   • IG User ID (replaced with Platform User ID)');
        console.log('   • Server ID (no longer needed)');
        console.log('   • Added By (no longer needed)\n');

        console.log('   Added field:');
        console.log('   • Platform User ID (Text) - For LinkedIn person ID or Instagram Business Account ID\n');

        console.log('🎉 Update complete! Your database structure is now simplified.\n');
        console.log('Current fields:');
        console.log('   • Name (Title)');
        console.log('   • Platform (Select)');
        console.log('   • Username (Text)');
        console.log('   • Access Token (Text)');
        console.log('   • Refresh Token (Text)');
        console.log('   • Platform User ID (Text)\n');

    } catch (error) {
        console.error('❌ Error updating database:', error.message);

        if (error.code === 'object_not_found') {
            console.error('\n⚠️  Database not found. Please check:');
            console.error('   • Platform Accounts DB ID is correct');
            console.error('   • Notion integration has access to the database');
        }
    }
}

updatePlatformAccountsDatabase();
