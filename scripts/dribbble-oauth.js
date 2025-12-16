import express from 'express';
import fetch from 'node-fetch';

const app = express();
const CLIENT_ID = 'B2gdr2qTegi6XP6kv0BA6CwtbYlVd4hcBaK9b5GlHV4';
const CLIENT_SECRET = 'HVxC6x8-kOaBk51ZIY7bClnhX81Bd1VcP9U1fl6EeeQ';
const REDIRECT_URI = 'http://localhost:3000/callback';

// Step 1: Redirect to Dribbble authorization
app.get('/auth', (req, res) => {
    const authUrl = `https://dribbble.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=upload`;
    console.log('🔗 Redirecting to Dribbble authorization...');
    res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for token
app.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        res.send('<h1>❌ Error: No authorization code received</h1>');
        return;
    }

    console.log('📝 Authorization code received:', code);
    console.log('🔄 Exchanging code for access token...');

    try {
        const response = await fetch('https://dribbble.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECT_URI
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Token exchange failed:', data);
            res.send(`<h1>❌ Error</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
            return;
        }

        console.log('✅ Access token received!');
        console.log('Token:', data.access_token);

        res.send(`
            <html>
            <head>
                <title>Dribbble OAuth Success</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                    h1 { color: #ea4c89; }
                    pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
                    .token { background: #e8f5e9; padding: 10px; border-left: 4px solid #4caf50; margin: 20px 0; }
                    .instructions { background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0; }
                </style>
            </head>
            <body>
                <h1>✅ Dribbble OAuth Successful!</h1>
                
                <div class="token">
                    <h2>🔑 Your Access Token:</h2>
                    <pre>${data.access_token}</pre>
                </div>

                <div class="instructions">
                    <h2>📝 Next Steps:</h2>
                    <ol>
                        <li>Copy the access token above</li>
                        <li>Go to your Notion Platform Accounts database</li>
                        <li>Add a new row with:
                            <ul>
                                <li><strong>Name:</strong> DevDsgn Dribbble</li>
                                <li><strong>Platform:</strong> Dribbble</li>
                                <li><strong>Username:</strong> _DevDsgn</li>
                                <li><strong>Access Token:</strong> [paste token here]</li>
                            </ul>
                        </li>
                        <li>Save and test with <code>/post platform:Dribbble</code></li>
                    </ol>
                </div>

                <h3>Full Response:</h3>
                <pre>${JSON.stringify(data, null, 2)}</pre>

                <p style="color: #666; margin-top: 40px;">You can close this window now.</p>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('❌ Error:', error);
        res.send(`<h1>❌ Error</h1><pre>${error.message}</pre>`);
    }
});

app.listen(3000, () => {
    console.log('\n🎨 Dribbble OAuth Server Started!\n');
    console.log('📍 Open this URL in your browser:');
    console.log('👉 http://localhost:3000/auth\n');
    console.log('This will redirect you to Dribbble to authorize the app.');
    console.log('After authorization, you\'ll get your access token!\n');
});
