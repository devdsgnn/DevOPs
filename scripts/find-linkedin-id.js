import fetch from 'node-fetch';

import dotenv from 'dotenv';

dotenv.config();

const accessToken = process.env.LINKEDIN_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE';

async function getLinkedInPersonId() {
    try {
        console.log('🔍 Trying to get Person ID...\n');

        // Method 1: Try userinfo with OpenID Connect
        console.log('Method 1: Trying /oauth/v2/introspectToken...');
        const introspectResponse = await fetch('https://www.linkedin.com/oauth/v2/introspectToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `token=${accessToken}&client_id=${process.env.LINKEDIN_CLIENT_ID || 'YOUR_CLIENT_ID'}&client_secret=${process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_CLIENT_SECRET'}`
        });

        const introspectData = await introspectResponse.json();
        console.log('Introspect Response:', JSON.stringify(introspectData, null, 2));

        if (introspectData.sub) {
            console.log('\n✅ Found Person ID:', introspectData.sub);
            return;
        }

        // Method 2: Try to create a simple post and see the error
        console.log('\nMethod 2: Testing with simple post (no image)...');
        const testPostData = {
            author: 'urn:li:person:devdsgn',
            lifecycleState: 'PUBLISHED',
            visibility: 'PUBLIC',
            commentary: 'Test post - please ignore'
        };

        const postResponse = await fetch('https://api.linkedin.com/rest/posts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(testPostData)
        });

        const postData = await postResponse.json();
        console.log('Post Response:', JSON.stringify(postData, null, 2));

        if (postData.id) {
            console.log('\n✅ Post created! Extracting Person ID from post...');
            // The post ID contains the person ID
            console.log('Post ID:', postData.id);
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

getLinkedInPersonId();
