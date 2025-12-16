import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const mainDbId = process.env.NOTION_MAIN_DATABASE_ID;

async function addPostConfig() {
    try {
        console.log('📝 Adding post configuration to Notion...');

        // Configuration entries to add
        const configs = [
            {
                name: 'Draft Channel ID',
                value: '1450436525585072138',
                description: 'Channel for post draft previews'
            },
            {
                name: 'Publish Channel ID',
                value: '1450436543595417732',
                description: 'Channel for publish status updates'
            },
            {
                name: 'Post Server ID',
                value: '1448936162134593538',
                description: 'Server where post channels are located'
            }
        ];

        for (const config of configs) {
            console.log(`  Adding: ${config.name} = ${config.value}`);

            await notion.pages.create({
                parent: { database_id: mainDbId },
                properties: {
                    Name: {
                        title: [{ text: { content: config.name } }]
                    },
                    Value: {
                        rich_text: [{ text: { content: config.value } }]
                    }
                }
            });

            console.log(`  ✅ Added ${config.name}`);
        }

        console.log('\n✅ All post configuration entries added successfully!');
    } catch (error) {
        console.error('❌ Error adding configuration:', error.message);
        if (error.code === 'object_not_found') {
            console.error('   Make sure NOTION_MAIN_DATABASE_ID is correct in .env');
        }
    }
}

addPostConfig();
