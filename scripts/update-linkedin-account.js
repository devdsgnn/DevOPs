import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const platformAccountsDbId = process.env.NOTION_PLATFORM_ACCOUNTS_DB_ID || '2ca6b4f25007801b97bec5e0a93b0b3c';

async function updateLinkedInAccount() {
    try {
        console.log('🔍 Finding LinkedIn account in Notion...');

        // Find the LinkedIn account
        const response = await notion.databases.query({
            database_id: platformAccountsDbId,
            filter: {
                and: [
                    {
                        property: 'Platform',
                        select: {
                            equals: 'LinkedIn'
                        }
                    },
                    {
                        property: 'Username',
                        rich_text: {
                            contains: 'devdsgn'
                        }
                    }
                ]
            }
        });

        if (response.results.length === 0) {
            console.log('❌ LinkedIn account not found. Creating new one...');

            await notion.pages.create({
                parent: { database_id: platformAccountsDbId },
                properties: {
                    Name: {
                        title: [{ text: { content: 'Devarsh LinkedIn' } }]
                    },
                    Platform: {
                        select: { name: 'LinkedIn' }
                    },
                    Username: {
                        rich_text: [{ text: { content: 'devdsgn' } }]
                    },
                    'Access Token': {
                        rich_text: [{ text: { content: process.env.LINKEDIN_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE' } }]
                    },
                    'Refresh Token': {
                        rich_text: [{ text: { content: process.env.LINKEDIN_REFRESH_TOKEN || 'YOUR_REFRESH_TOKEN_HERE' } }]
                    },
                    'Platform User ID': {
                        rich_text: [{ text: { content: process.env.LINKEDIN_PERSON_ID || 'YOUR_PERSON_ID_HERE' } }]
                    },
                    'API Key': {
                        rich_text: [{ text: { content: process.env.LINKEDIN_CLIENT_ID || 'YOUR_CLIENT_ID_HERE' } }]
                    },
                    'API Secret': {
                        rich_text: [{ text: { content: process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE' } }]
                    }
                }
            });

            console.log('✅ Created new LinkedIn account!');
        } else {
            const pageId = response.results[0].id;
            console.log('✅ Found existing account, updating...');

            await notion.pages.update({
                page_id: pageId,
                properties: {
                    Name: {
                        title: [{ text: { content: 'Devarsh LinkedIn' } }]
                    },
                    'Access Token': {
                        rich_text: [{ text: { content: process.env.LINKEDIN_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE' } }]
                    },
                    'Refresh Token': {
                        rich_text: [{ text: { content: process.env.LINKEDIN_REFRESH_TOKEN || 'YOUR_REFRESH_TOKEN_HERE' } }]
                    },
                    'Platform User ID': {
                        rich_text: [{ text: { content: process.env.LINKEDIN_PERSON_ID || 'YOUR_PERSON_ID_HERE' } }]
                    }
                }
            });

            console.log('✅ Updated LinkedIn account!');
        }

        console.log('\n📋 Account Details:');
        console.log('   Name: Devarsh LinkedIn');
        console.log('   Platform: LinkedIn');
        console.log('   Username: devdsgn');
        console.log('   Person ID: PKn7VAkIXA');
        console.log('   Scopes: email, openid, profile, r_profile_basicinfo, r_verify, w_member_social');
        console.log('\n🚀 Ready to post to LinkedIn!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.body) {
            console.error('Details:', JSON.stringify(error.body, null, 2));
        }
    }
}

updateLinkedInAccount();
