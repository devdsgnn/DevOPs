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
                        rich_text: [{ text: { content: 'AQW_WG_DfaQkVM7Bdg9J0A91xXg5nZn6sbXsgHlq0WjWgZsIIriey5JW2Vd_-PZsUxR_7FZPnTYAkf_IUWY9jtEjODEuQOafqz_IK-jZRbwfE0kElB0xqWMTaey0nC6LiNrQDAY33B-vJPXxmn3GZcsNgR5hoXGGuhfonfK9bqcyj5swOn-BF1FF0Tlnz2KQ_eyrctuigSlHVFevVxOoBL5iAVoM60UKySGdVa1d6q5bmPANiMFZ2fmMhxwDS1QY6osMDsoiKebe7JZtl1XYRISHNkFCtSjzcvcJO2kZ1k0x3ADst9ctM2oZJNzBDpdBXp3iN6H6qh-oyIxJjA7YrPSfkLtFHw' } }]
                    },
                    'Refresh Token': {
                        rich_text: [{ text: { content: 'AQXvetQELapiBQyWmcn2-gA6wSLJbTptxlgtPO90QZ7xJiBvQDrt3fnCMMmkXhEjHx3PxU0ZRjKgkyGuFiPpdQcaOqVXo-Zr1x1V2N6mDiKYYoppkkkck72NEalGi3h83jDu4Rxu_d-YaZQ9PkM3WWFnv3BG8-b_0A2a8OYEAHwMpcQr_OKw7r5m73UJGF9UGvCejtC-6dbxAscXwu8R0_yjiWFGeru4L-PlE1vew9X8MdMqHZqI1i3m-4nGeAY5t1ZH_DkcMW8siTgPgZwU5ZHVk6r6IfM2Ekb7WM4p6BSPycjJrI9mqkkJR1vc26tMrq3VVGfMt3BmCO14WYaxo3QJjjyYag' } }]
                    },
                    'Platform User ID': {
                        rich_text: [{ text: { content: 'PKn7VAkIXA' } }]
                    },
                    'API Key': {
                        rich_text: [{ text: { content: '86fzo0cgmre1ai' } }]
                    },
                    'API Secret': {
                        rich_text: [{ text: { content: 'WPL_AP1.3QyuHCZsatlDwUOQ.S2/MDg==' } }]
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
                        rich_text: [{ text: { content: 'AQW_WG_DfaQkVM7Bdg9J0A91xXg5nZn6sbXsgHlq0WjWgZsIIriey5JW2Vd_-PZsUxR_7FZPnTYAkf_IUWY9jtEjODEuQOafqz_IK-jZRbwfE0kElB0xqWMTaey0nC6LiNrQDAY33B-vJPXxmn3GZcsNgR5hoXGGuhfonfK9bqcyj5swOn-BF1FF0Tlnz2KQ_eyrctuigSlHVFevVxOoBL5iAVoM60UKySGdVa1d6q5bmPANiMFZ2fmMhxwDS1QY6osMDsoiKebe7JZtl1XYRISHNkFCtSjzcvcJO2kZ1k0x3ADst9ctM2oZJNzBDpdBXp3iN6H6qh-oyIxJjA7YrPSfkLtFHw' } }]
                    },
                    'Refresh Token': {
                        rich_text: [{ text: { content: 'AQXvetQELapiBQyWmcn2-gA6wSLJbTptxlgtPO90QZ7xJiBvQDrt3fnCMMmkXhEjHx3PxU0ZRjKgkyGuFiPpdQcaOqVXo-Zr1x1V2N6mDiKYYoppkkkck72NEalGi3h83jDu4Rxu_d-YaZQ9PkM3WWFnv3BG8-b_0A2a8OYEAHwMpcQr_OKw7r5m73UJGF9UGvCejtC-6dbxAscXwu8R0_yjiWFGeru4L-PlE1vew9X8MdMqHZqI1i3m-4nGeAY5t1ZH_DkcMW8siTgPgZwU5ZHVk6r6IfM2Ekb7WM4p6BSPycjJrI9mqkkJR1vc26tMrq3VVGfMt3BmCO14WYaxo3QJjjyYag' } }]
                    },
                    'Platform User ID': {
                        rich_text: [{ text: { content: 'PKn7VAkIXA' } }]
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
