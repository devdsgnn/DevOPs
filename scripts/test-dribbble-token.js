import fetch from 'node-fetch';

const ACCESS_TOKEN = 'D6ayqOUZPRfeErUiietqXxfBxSxiBHHVMR44nLeCp2U';

async function testDribbbleAccess() {
    try {
        console.log('🔍 Testing Dribbble access token...\n');

        // Test 1: Get user info
        console.log('Test 1: Getting user information...');
        const userResponse = await fetch('https://api.dribbble.com/v2/user', {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        console.log('Status:', userResponse.status, userResponse.statusText);
        const userData = await userResponse.json();

        if (userResponse.ok) {
            console.log('✅ User Info:');
            console.log('   Name:', userData.name);
            console.log('   Username:', userData.login);
            console.log('   Pro:', userData.pro);
            console.log('   Type:', userData.type);
            console.log('   Can Upload:', userData.can_upload_shot);
        } else {
            console.log('❌ Error:', userData);
        }

        // Test 2: Check token scopes
        console.log('\nTest 2: Checking token details...');
        const tokenResponse = await fetch('https://api.dribbble.com/v2/user', {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        console.log('Headers:', Object.fromEntries(tokenResponse.headers.entries()));

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testDribbbleAccess();
