import fetch from 'node-fetch';

const accessToken = 'AQWNPo7k4gEVEMyv3eTtxv2pvVF5FNTbtlaSOfbCAMHukD7KCtITgmiGdUg2ai_G8hlPJpbddFWaeO4RpixE3YmI8DE7lKhIuEdYO_-TbDDrrmcSMz_gssC_GNBgvssQ2HY6yB2pcf-jn2OZhQc8hZ4X3sTezND5jvnG5FYTBRcEsbQJUuZvpDVcIs260tFLcEBKYurtFxhyG6vZtcek069e-TF1OfRciXZJWJ1z8wp-1ojtHDsisTAFJzbviOJcj79gLzfqj2a8Jt7lnmbpD8208nm3xczXznpaomb7w5n3nYLeTT1_DUdigiIjXlGYSbnwm4ALUqRFKhwbR3mgFN7sdP-vxg';

async function getPersonId() {
    try {
        // Try the introspection endpoint
        const response = await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'LinkedIn-Version': '202412'
            }
        });

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.id) {
            console.log('\n✅ Person ID:', data.id);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

getPersonId();
