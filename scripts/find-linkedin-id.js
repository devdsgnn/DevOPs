import fetch from 'node-fetch';

const accessToken = 'AQWNPo7k4gEVEMyv3eTtxv2pvVF5FNTbtlaSOfbCAMHukD7KCtITgmiGdUg2ai_G8hlPJpbddFWaeO4RpixE3YmI8DE7lKhIuEdYO_-TbDDrrmcSMz_gssC_GNBgvssQ2HY6yB2pcf-jn2OZhQc8hZ4X3sTezND5jvnG5FYTBRcEsbQJUuZvpDVcIs260tFLcEBKYurtFxhyG6vZtcek069e-TF1OfRciXZJWJ1z8wp-1ojtHDsisTAFJzbviOJcj79gLzfqj2a8Jt7lnmbpD8208nm3xczXznpaomb7w5n3nYLeTT1_DUdigiIjXlGYSbnwm4ALUqRFKhwbR3mgFN7sdP-vxg';

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
            body: `token=${accessToken}&client_id=86fzo0cgmre1ai&client_secret=WPL_AP1.3QyuHCZsatlDwUOQ.S2/MDg==`
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
