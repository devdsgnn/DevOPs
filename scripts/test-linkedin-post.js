import fetch from 'node-fetch';

const accessToken = 'AQWNPo7k4gEVEMyv3eTtxv2pvVF5FNTbtlaSOfbCAMHukD7KCtITgmiGdUg2ai_G8hlPJpbddFWaeO4RpixE3YmI8DE7lKhIuEdYO_-TbDDrrmcSMz_gssC_GNBgvssQ2HY6yB2pcf-jn2OZhQc8hZ4X3sTezND5jvnG5FYTBRcEsbQJUuZvpDVcIs260tFLcEBKYurtFxhyG6vZtcek069e-TF1OfRciXZJWJ1z8wp-1ojtHDsisTAFJzbviOJcj79gLzfqj2a8Jt7lnmbpD8208nm3xczXznpaomb7w5n3nYLeTT1_DUdigiIjXlGYSbnwm4ALUqRFKhwbR3mgFN7sdP-vxg';

async function testLinkedInPost() {
    try {
        console.log('🧪 Testing LinkedIn post without image...\n');

        // Try posting with just text (no Person ID needed for author)
        const testPostData = {
            author: 'urn:li:person:devdsgn',
            commentary: 'Test post from Discord bot - please ignore! 🤖',
            visibility: 'PUBLIC',
            distribution: {
                feedDistribution: 'MAIN_FEED',
                targetEntities: [],
                thirdPartyDistributionChannels: []
            },
            lifecycleState: 'PUBLISHED',
            isReshareDisabledByAuthor: false
        };

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(testPostData)
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ Post created successfully!');
            console.log('Post ID:', data.id);
        } else {
            console.log('\n❌ Post failed');
            console.log('Try checking your LinkedIn profile for the numeric ID');
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testLinkedInPost();
