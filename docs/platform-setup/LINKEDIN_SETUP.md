# LinkedIn API Setup Guide

## 🎯 Overview

This guide walks you through setting up LinkedIn API access for posting to your personal LinkedIn profile or company page.

---

## 📋 Prerequisites

- LinkedIn account (personal or company page admin)
- Access to [LinkedIn Developers](https://www.linkedin.com/developers/)
- Verified email address

---

## 🚀 Step-by-Step Setup

### Step 1: Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click **Create App**
3. Fill in the application form:
   - **App name**: `YourBotName` (e.g., "Social Media Manager Bot")
   - **LinkedIn Page**: Select your company page (required, even for personal posting)
   - **App logo**: Upload a logo (min 300x300px)
   - **Legal agreement**: Check the box to accept terms
4. Click **Create app**

**⚠️ NOTE**: LinkedIn requires a Company Page during app creation, even if you only want to post to your personal profile. You can create a free company page if you don't have one.

### Step 2: Request API Access

1. In your app dashboard, go to **Products** tab
2. Request access to:
   - ✅ **Share on LinkedIn** (required for posting)
   - ✅ **Sign In with LinkedIn using OpenID Connect** (for authentication)
3. Click **Request access** for each product
4. Wait for approval (usually instant for "Share on LinkedIn")

### Step 3: Configure App Settings

1. Go to **Auth** tab
2. Under **OAuth 2.0 settings**:
   - **Redirect URLs**: Add `http://localhost:3000/callback` (or your domain)
3. Copy your credentials:
   - **Client ID**
   - **Client Secret**
4. Save changes

### Step 4: Complete OAuth Flow

LinkedIn uses OAuth 2.0 for authentication. You need to complete the OAuth flow to get an access token.

#### OAuth Flow:

1. **Redirect user to authorization URL**:
```
https://www.linkedin.com/oauth/v2/authorization?
  response_type=code&
  client_id={CLIENT_ID}&
  redirect_uri={REDIRECT_URI}&
  scope=profile%20email%20w_member_social%20openid
```

2. **User authorizes** → LinkedIn redirects to your callback URL with a `code`

3. **Exchange code for access token**:
```bash
curl -X POST "https://www.linkedin.com/oauth/v2/accessToken" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code={CODE}" \
  -d "client_id={CLIENT_ID}" \
  -d "client_secret={CLIENT_SECRET}" \
  -d "redirect_uri={REDIRECT_URI}"
```

**Response:**
```json
{
  "access_token": "AQV8...",
  "expires_in": 5184000,
  "refresh_token": "AQX9...",
  "refresh_token_expires_in": 31536000
}
```

**Token Expiry:**
- Access token: 60 days
- Refresh token: 365 days

### Step 5: Get Your Person ID

To post to your personal profile, you need your LinkedIn Person ID:

```bash
curl -X GET "https://api.linkedin.com/v2/userinfo" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

**Response:**
```json
{
  "sub": "abc123xyz",
  "name": "Your Name",
  "given_name": "Your",
  "family_name": "Name",
  "email": "your@email.com",
  "email_verified": true
}
```

**Save the `sub` value!** This is your Person ID (without the `urn:li:person:` prefix).

---

## 📝 Add to Notion Database

Add a new row in your **Platform Accounts** database:

| Field | Value | Example |
|-------|-------|---------|
| **Name** | Account display name | `My LinkedIn` |
| **Platform** | Select: `LinkedIn` | LinkedIn |
| **Username** | Your LinkedIn username | `john-doe` |
| **Access Token** | OAuth access token | `AQV8...` |
| **Refresh Token** | OAuth refresh token | `AQX9...` |
| **Platform User ID** | Your Person ID (sub) | `abc123xyz` |

**Required Fields:**
- ✅ Name
- ✅ Platform (must be "LinkedIn")
- ✅ Access Token
- ✅ Platform User ID (the `sub` from userinfo)
- ⭕ Refresh Token (recommended for token renewal)

---

## 🔧 API Details

### Authentication Method
- **OAuth 2.0** with Bearer token
- Tokens expire after 60 days

### API Version
- LinkedIn API v2 (REST API)
- LinkedIn Version: `202412` (or latest)

### Endpoints Used

1. **Get User Info**:
```
GET https://api.linkedin.com/v2/userinfo
```

2. **Initialize Image Upload**:
```
POST https://api.linkedin.com/rest/images?action=initializeUpload
```

3. **Upload Image**:
```
PUT {uploadUrl from step 2}
```

4. **Create Post**:
```
POST https://api.linkedin.com/rest/posts
```

### Required Headers
```javascript
{
  'Authorization': 'Bearer {ACCESS_TOKEN}',
  'Content-Type': 'application/json',
  'X-Restli-Protocol-Version': '2.0.0',
  'LinkedIn-Version': '202412'
}
```

### Required Scopes
- `profile` - Read user profile
- `email` - Read user email
- `w_member_social` - Post on behalf of user
- `openid` - OpenID Connect authentication

### Post Data Structure
```javascript
{
  author: "urn:li:person:{PERSON_ID}",
  lifecycleState: "PUBLISHED",
  visibility: "PUBLIC",
  commentary: "Your post text",
  content: {
    media: {
      id: "urn:li:image:{IMAGE_URN}"  // If image uploaded
    }
  }
}
```

---

## ✅ Testing Your Setup

### 1. Restart Your Bot
```bash
npm start
```

### 2. Run the Command in Discord
```
/post platform:LinkedIn
```

### 3. Expected Flow
1. Select your LinkedIn account from dropdown
2. Enter post text in modal
3. Upload image (optional)
4. Preview appears with LinkedIn blue color (💼)
5. Click **Publish**
6. Post appears on LinkedIn!

### 4. Verify on LinkedIn
- Check your LinkedIn feed
- Post should appear with text and image (if uploaded)

---

## 🎨 Bot Features

### Preview
- **Color**: LinkedIn Blue (`#0A66C2`)
- **Emoji**: 💼
- **Shows**: Text preview, image thumbnail, account name

### Publishing
- **Status**: "Publishing to LinkedIn..." with LinkedIn blue
- **Success**: Beautiful embed with post link and timestamp
- **Error**: Red embed with error details

---

## ❓ Troubleshooting

### "Invalid access token"
**Solution:**
- Token expired (60 days)
- Use refresh token to get new access token (see Token Refresh section)
- Verify token has `w_member_social` scope

### "Person ID not found"
**Solution:**
- Make sure you're using the `sub` from `/v2/userinfo`
- Format should be just the ID, not `urn:li:person:{ID}`
- Re-run Step 5 to get correct Person ID

### "Insufficient permissions"
**Solution:**
- Verify "Share on LinkedIn" product is approved
- Check OAuth scopes include `w_member_social`
- Re-authorize with correct scopes

### "Image upload failed"
**Solution:**
- Check image size (max 8MB)
- Verify image format (JPG, PNG, GIF)
- Ensure access token has proper permissions
- LinkedIn may be rate limiting uploads

### "Post creation failed"
**Solution:**
- Verify Person ID is correct
- Check post text isn't too long (max 3,000 characters)
- Ensure image URN is valid (if using image)

### "Company Page required"
**Solution:**
- LinkedIn requires a Company Page to create an app
- Create a free company page at [linkedin.com/company/setup](https://www.linkedin.com/company/setup/new/)
- You can still post to your personal profile after creating the app

---

## 📊 Rate Limits

### LinkedIn API Limits
- **100 API calls per day** per user (free tier)
- **Image uploads**: 100 per day
- **Posts**: 100 per day per user

### Best Practices
- Don't post too frequently (LinkedIn may flag as spam)
- Recommended: Max 5-10 posts per day
- Space out posts throughout the day

---

## 🔄 Token Refresh

Access tokens expire after 60 days. Refresh tokens expire after 365 days.

### Refresh Access Token

```bash
curl -X POST "https://www.linkedin.com/oauth/v2/accessToken" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "refresh_token={REFRESH_TOKEN}" \
  -d "client_id={CLIENT_ID}" \
  -d "client_secret={CLIENT_SECRET}"
```

**Response:**
```json
{
  "access_token": "AQV8...",
  "expires_in": 5184000,
  "refresh_token": "AQX9...",
  "refresh_token_expires_in": 31536000
}
```

**⚠️ IMPORTANT**: Update both tokens in Notion after refresh!

### Automated Refresh (Recommended)

Implement token refresh in your bot to automatically refresh tokens before expiry:

```javascript
// Check if token expires in next 7 days
const expiresIn = 60 * 24 * 60 * 60 * 1000; // 60 days in ms
const expiryDate = new Date(tokenCreatedAt + expiresIn);
const daysUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24);

if (daysUntilExpiry < 7) {
  // Refresh token
  const newTokens = await refreshLinkedInToken(refreshToken);
  // Update in Notion
  await updateNotionAccount(accountId, newTokens);
}
```

---

## 🔒 Security Best Practices

1. **Never share your tokens publicly**
2. **Store tokens securely** in Notion (private database)
3. **Use refresh tokens** to avoid re-authorization
4. **Regenerate tokens** if compromised
5. **Limit app permissions** to minimum required
6. **Use HTTPS** for all OAuth redirects

---

## ⚠️ Important Limitations

### LinkedIn API Restrictions
- ✅ Can post text and images to personal profile
- ✅ Can post to company pages (if admin)
- ✅ Can include hashtags and mentions
- ❌ Cannot post videos (requires different API)
- ❌ Cannot post articles (requires different API)
- ❌ Cannot edit posts after publishing
- ❌ Cannot delete posts via API
- ❌ Cannot schedule posts (immediate publish only)

### Content Requirements
- **Text**: Max 3,000 characters
- **Images**: Max 8MB, JPG/PNG/GIF
- **Hashtags**: Max 3 recommended (more may reduce reach)
- **Mentions**: Use @[Name](profileURL) format

---

## 📚 Resources

- [LinkedIn API Documentation](https://learn.microsoft.com/en-us/linkedin/)
- [Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin)
- [OAuth 2.0 Guide](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [Image Upload API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/images-api)
- [Posts API](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin#creating-a-share)

---

## 🎉 You're Ready!

Once you've added your LinkedIn credentials to Notion, you can start posting immediately! The bot handles:
- ✅ OAuth 2.0 authentication
- ✅ Image download from Discord
- ✅ Image upload to LinkedIn CDN
- ✅ Post creation with media
- ✅ Beautiful status updates
- ✅ Error handling

**No code changes needed!** 🚀

---

## 💡 Pro Tips

1. **Use compelling headlines** (first 2 lines are most important)
2. **Include relevant hashtags** (max 3 for best reach)
3. **Tag people and companies** to increase visibility
4. **Post during business hours** (9am-5pm in your timezone)
5. **Engage with comments** within first hour
6. **Use high-quality images** (1200x627px recommended)
7. **Keep it professional** (LinkedIn is a professional network)
8. **Tell stories** (personal experiences resonate well)

---

## 🔄 OAuth Helper Script (Optional)

If you need help with OAuth, here's a simple Node.js script:

```javascript
// linkedin-oauth.js
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const REDIRECT_URI = 'http://localhost:3000/callback';

// Step 1: Redirect to LinkedIn
app.get('/auth', (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=profile%20email%20w_member_social%20openid`;
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI
    })
  });
  
  const tokens = await response.json();
  
  // Get user info
  const userResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { 'Authorization': `Bearer ${tokens.access_token}` }
  });
  
  const userInfo = await userResponse.json();
  
  res.json({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    person_id: userInfo.sub
  });
});

app.listen(3000, () => console.log('Visit http://localhost:3000/auth'));
```

Run with: `node linkedin-oauth.js`
