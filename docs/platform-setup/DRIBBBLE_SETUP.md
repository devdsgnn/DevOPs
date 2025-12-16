# Dribbble API Setup Guide

## 🎯 Overview

This guide walks you through setting up Dribbble API access for posting shots (designs) to your Dribbble account.

---

## 📋 Prerequisites

- Dribbble account (Pro account recommended for full features)
- Access to [Dribbble Account Settings](https://dribbble.com/account/applications)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Dribbble Application

1. Go to [Dribbble Applications](https://dribbble.com/account/applications)
2. Click **Register a new application**
3. Fill in the application form:
   - **Name**: `YourBotName` (e.g., "Social Media Manager Bot")
   - **Description**: Brief description of what your bot does
   - **Website URL**: Your website or `https://example.com`
   - **Callback URL**: `http://localhost:3000/callback` (for OAuth)
4. Click **Register application**

### Step 2: Get Client Credentials

After creating your app, you'll see:

| Field | Description |
|-------|-------------|
| **Client ID** | Your application's public identifier |
| **Client Secret** | Your application's secret key (keep private!) |

**⚠️ IMPORTANT**: Copy both values - you'll need them for OAuth!

### Step 3: Authorize Your Application

Dribbble uses OAuth 2.0 for authentication. You need to complete the OAuth flow:

#### OAuth Flow:

1. **Redirect user to authorization URL**:
```
https://dribbble.com/oauth/authorize?
  client_id={CLIENT_ID}&
  redirect_uri={REDIRECT_URI}&
  scope=upload
```

2. **User authorizes** → Dribbble redirects to your callback URL with a `code`

3. **Exchange code for access token**:
```bash
curl -X POST "https://dribbble.com/oauth/token" \
  -d "client_id={CLIENT_ID}" \
  -d "client_secret={CLIENT_SECRET}" \
  -d "code={CODE}" \
  -d "redirect_uri={REDIRECT_URI}"
```

**Response:**
```json
{
  "access_token": "abc123...",
  "token_type": "bearer",
  "scope": "upload"
}
```

### Step 4: Get Your User Information (Optional)

To verify your token and get your user ID:

```bash
curl -X GET "https://api.dribbble.com/v2/user" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

**Response:**
```json
{
  "id": 123456,
  "name": "Your Name",
  "login": "yourhandle",
  "avatar_url": "https://...",
  "pro": true
}
```

---

## 📝 Add to Notion Database

Add a new row in your **Platform Accounts** database:

| Field | Value | Example |
|-------|-------|---------|
| **Name** | Account display name | `My Dribbble` |
| **Platform** | Select: `Dribbble` | Dribbble |
| **Username** | Your Dribbble handle | `@yourhandle` |
| **Access Token** | OAuth access token | `abc123...` |
| **Refresh Token** | Leave empty | (Dribbble tokens don't expire) |
| **Platform User ID** | Leave empty | (not required) |

**Required Fields:**
- ✅ Name
- ✅ Platform (must be "Dribbble")
- ✅ Access Token

---

## 🔧 API Details

### Authentication Method
- **OAuth 2.0** with Bearer token
- Tokens don't expire (unless revoked)

### API Version
- Dribbble API v2

### Endpoints Used

1. **Upload Shot**:
```
POST https://api.dribbble.com/v2/shots
```

### Required Scope
- `upload` - Allows creating shots

### Shot Upload Flow
1. Prepare image (JPG, PNG, GIF)
2. Encode image as base64 or multipart form data
3. POST to `/v2/shots` with image and metadata
4. Receive shot URL in response

---

## 🎨 Shot Requirements

### Image Specifications
- **Format**: JPG, PNG, GIF
- **Max file size**: 8MB
- **Recommended dimensions**: 
  - Standard: 800x600px (4:3 ratio)
  - HD: 1600x1200px (4:3 ratio)
  - Retina: 2400x1800px (4:3 ratio)
- **Aspect ratio**: 4:3 recommended (other ratios accepted)

### Content Guidelines
- **Title**: Max 255 characters
- **Description**: Max 10,000 characters (supports Markdown)
- **Tags**: Max 20 tags, each max 40 characters

---

## ✅ Testing Your Setup

### 1. Restart Your Bot
```bash
npm start
```

### 2. Run the Command in Discord
```
/post platform:Dribbble
```

### 3. Expected Flow
1. Select your Dribbble account from dropdown
2. Enter shot title and description in modal
3. Upload image (**required** for Dribbble)
4. Preview appears with Dribbble pink color (🏀)
5. Click **Publish**
6. Shot appears on Dribbble!

### 4. Verify on Dribbble
- Check your Dribbble profile
- Shot should appear in your shots list
- May be in draft mode depending on account settings

---

## 🎨 Bot Features

### Preview
- **Color**: Dribbble Pink (`#EA4C89`)
- **Emoji**: 🏀
- **Shows**: Title, description preview, image thumbnail, account name

### Publishing
- **Status**: "Publishing to Dribbble..." with Dribbble pink
- **Success**: Beautiful embed with shot link and timestamp
- **Error**: Red embed with error details

---

## ❓ Troubleshooting

### "Invalid access token"
**Solution:**
- Token may have been revoked
- Re-run OAuth flow (Step 3) to get new token
- Verify token has `upload` scope

### "Unauthorized"
**Solution:**
- Check Client ID and Client Secret are correct
- Ensure you completed OAuth flow properly
- Verify redirect URI matches exactly

### "Image upload failed"
**Solution:**
- Check image size (max 8MB)
- Verify image format (JPG, PNG, GIF)
- Ensure image dimensions are reasonable (min 400px)

### "Shot creation failed"
**Solution:**
- Title may be too long (max 255 chars)
- Description may be too long (max 10,000 chars)
- Image may not meet requirements

### "Pro account required"
**Solution:**
- Some features require Dribbble Pro
- Upgrade to Pro at [dribbble.com/pro](https://dribbble.com/pro)
- Or use limited free tier features

---

## 📊 Rate Limits

### Dribbble API Limits
- **60 requests per minute** per access token
- **Unlimited shots** (no daily limit)
- **Rate limit headers** included in responses

### Best Practices
- Don't post too frequently (quality over quantity)
- Recommended: Max 5-10 shots per day
- Space out posts throughout the week

---

## 🔒 Security Best Practices

1. **Never share your access token publicly**
2. **Store tokens securely** in Notion (private database)
3. **Revoke tokens** if compromised (in Dribbble settings)
4. **Use HTTPS** for all API calls
5. **Keep Client Secret private** (never commit to Git)

---

## ⚠️ Important Limitations

### Dribbble API Restrictions
- ✅ Can upload shots with images
- ✅ Can add title and description
- ✅ Can add tags
- ❌ Cannot edit shots after publishing (must delete and re-upload)
- ❌ Cannot delete shots via API (must use web interface)
- ❌ Cannot upload videos (Pro feature, different endpoint)
- ❌ Cannot schedule shots (immediate publish only)

### Account Requirements
- **Free accounts**: Can upload shots (with watermark)
- **Pro accounts**: Full features, no watermark, analytics
- **Team accounts**: Shared shot management

---

## 🎨 Pro Features (Dribbble Pro Required)

If you have Dribbble Pro, you get additional features:

### Enhanced Shot Options
- **Video uploads** (MP4, MOV)
- **GIF animations** (unlimited frames)
- **Shot scheduling** (via web interface)
- **Analytics** (views, likes, comments)
- **No watermark** on free shots

### API Enhancements
- Higher rate limits
- Priority support
- Advanced shot metadata

---

## 📚 Resources

- [Dribbble API Documentation](https://developer.dribbble.com/v2/)
- [OAuth Guide](https://developer.dribbble.com/v2/oauth/)
- [Shot Upload](https://developer.dribbble.com/v2/shots/#create-a-shot)
- [Dribbble Applications](https://dribbble.com/account/applications)
- [Dribbble Pro](https://dribbble.com/pro)

---

## 🎉 You're Ready!

Once you've added your Dribbble credentials to Notion, you can start posting shots immediately! The bot handles:
- ✅ OAuth 2.0 authentication
- ✅ Image upload to Dribbble
- ✅ Shot creation with metadata
- ✅ Beautiful status updates
- ✅ Error handling

**No code changes needed!** 🚀

---

## 💡 Pro Tips

1. **Use high-quality images** (2x or 4x resolution for Retina displays)
2. **Write compelling descriptions** (supports Markdown formatting)
3. **Add relevant tags** (helps with discoverability)
4. **Engage with community** (respond to comments)
5. **Post consistently** (quality over quantity)
6. **Use 4:3 aspect ratio** (standard Dribbble format)
7. **Include process shots** (show your workflow)
8. **Tell a story** (context makes shots more engaging)

---

## 🌟 Shot Best Practices

### Image Quality
- Use 2x resolution (1600x1200px minimum)
- Export at high quality (90%+ JPEG quality)
- Optimize file size (compress without losing quality)

### Presentation
- Show your work in context (mockups, devices)
- Use clean backgrounds
- Highlight key features
- Include before/after comparisons

### Description
- Explain your design decisions
- Share your process
- Include project details
- Add links to live projects
- Use Markdown for formatting

### Tags
- Use specific, relevant tags
- Include design style (minimal, flat, 3D, etc.)
- Add industry tags (web, mobile, branding, etc.)
- Include tool tags (Figma, Sketch, Photoshop, etc.)

---

## 🔄 OAuth Helper Script (Optional)

If you need help with OAuth, here's a simple Node.js script:

```javascript
// dribbble-oauth.js
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const REDIRECT_URI = 'http://localhost:3000/callback';

// Step 1: Redirect to Dribbble
app.get('/auth', (req, res) => {
  const authUrl = `https://dribbble.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=upload`;
  res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  
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
  res.json(data); // Contains access_token
});

app.listen(3000, () => console.log('Visit http://localhost:3000/auth'));
```

Run with: `node dribbble-oauth.js`
