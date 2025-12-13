import notionManager from './src/utils/notionManager.js';

console.log('🧪 Testing Notion connection...\n');

try {
    console.log('📊 Fetching config from Notion...');
    const config = await notionManager.getConfig();

    console.log('\n✅ Config loaded successfully!');
    console.log('Social Links DB ID:', config.socialLinksDbId || '❌ NOT FOUND');

    if (!config.socialLinksDbId) {
        console.log('\n⚠️  WARNING: Social Links Database ID not found!');
        console.log('Make sure you have a row in your Main Config database:');
        console.log('  Name: DB - SocialLinks');
        console.log('  Value: [your social links database ID]');
    } else {
        console.log('\n✅ Everything looks good! Ready to add links.');
    }
} catch (error) {
    console.error('\n❌ Error connecting to Notion:');
    console.error(error.message);
    console.log('\nCheck:');
    console.log('1. NOTION_API_KEY is correct in .env');
    console.log('2. NOTION_MAIN_DATABASE_ID is correct in .env');
    console.log('3. Both databases are shared with your integration');
}

process.exit(0);
