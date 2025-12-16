# Instagram API Setup Guide

## 🎯 Overview

This guide walks you through setting up Instagram API access for posting photos with captions to Instagram Business or Creator accounts.

---

## 📋 Prerequisites

- Instagram account (must be **Business** or **Creator** account)
- Facebook Page connected to your Instagram account
- Facebook Developer account
- Instagram account must be linked to a Facebook Page

---

## 🚀 Step-by-Step Setup

### Step 1: Convert to Business/Creator Account

1. Open Instagram app on mobile
2. Go to **Settings** → **Account**
3. Tap **Switch to Professional Account**
4. Choose **Business** or **Creator**
5. Complete the setup

### Step 2: Connect to Facebook Page

1. In Instagram app, go to **Settings** → **Account**
2. Tap **Linked Accounts** → **Facebook**
3. Log in to Facebook
4. Select the Facebook Page to connect
5. Confirm connection

**⚠️ IMPORTANT**: You must have admin access to the Facebook Page!

### Step 3: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Business** as app type
4. Fill in:
   - **App name**: `YourBotName` (e.g., "Social Media Manager")
   - **App contact email**: Your email
   - **Business Account**: Select or create one
5. Click **Create App**

### Step 4: Add Instagram Product

1. In your app dashboard, find **Add Products**
2. Locate **Instagram** and click **Set Up**
3. Follow the setup wizard
4. You should see Instagram added to your app

### Step 5: Configure App Settings

1. Go to **Settings** → **Basic**
2. Fill in required fields:
   - **App Domains**: Your domain or `localhost`
   - **Privacy Policy URL**: Your privacy policy
   - **Terms of Service URL**: Your terms
3. Add **Instagram Basic Display** product
4. Save changes

### Step 6: Get Access Token

#### Option A: Using Graph API Explorer (Easiest)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from dropdown
3. Click **Generate Access Token**
4. Select permissions:
   - ✅ `instagram_basic`
   - ✅ `instagram_content_publish`
   - ✅ `pages_read_engagement`
   - ✅ `pages_show_list`
5. Click **Generate Access Token**
6. Copy the token (this is a short-lived token)

#### Option B: Using OAuth Flow

1. Redirect user to:
```
https://www.facebook.com/v18.0/dialog/oauth?
  client_id={APP_ID}&
  redirect_uri={REDIRECT_URI}&
  scope=instagram_basic,instagram_content_publish,pages_read_engagement,pages_show_list
```

2. Exchange code for access token:
```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?
  client_id={APP_ID}&
  client_secret={APP_SECRET}&
  redirect_uri={REDIRECT_URI}&
  code={CODE}"
```

### Step 7: Get Long-Lived Access Token

Short-lived tokens expire in 1 hour. Convert to long-lived (60 days):

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id={APP_ID}&
  client_secret={APP_SECRET}&
  fb_exchange_token={SHORT_LIVED_TOKEN}"
```

**Response:**
```json
{
  "access_token": "EAABsb...",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

### Step 8: Get Instagram Business Account ID

1. Get your Facebook Pages:
```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token={ACCESS_TOKEN}"
```

**Response:**
```json
{
  "data": [
    {
      "id": "123456789",
      "name": "Your Page Name",
      "access_token": "EAABsb..."
    }
  ]
}
```

2. Get Instagram Business Account ID from the Page:
```bash
curl -X GET "https://graph.facebook.com/v18.0/{PAGE_ID}?fields=instagram_business_account&access_token={PAGE_ACCESS_TOKEN}"
```

**Response:**
```json
{
  "instagram_business_account": {
    "id": "17841405793187218"
  },
  "id": "123456789"
}
```

**Save this ID!** This is your `Platform User ID` for Notion.

---

## 📝 Add to Notion Database

Add a new row in your **Platform Accounts** database:

| Field | Value | Example |
|-------|-------|---------|
| **Name** | Account display name | `Company Instagram` |
| **Platform** | Select: `Instagram` | Instagram |
| **Username** | Your Instagram handle | `@yourcompany` |
| **Access Token** | Long-lived access token | `EAABsb...` |
| **Refresh Token** | Leave empty | (not used) |
| **Platform User ID** | Instagram Business Account ID | `17841405793187218` |

**Required Fields:**
- ✅ Name
- ✅ Platform (must be "Instagram")
- ✅ Access Token (long-lived, 60 days)
- ✅ Platform User ID (Instagram Business Account ID)

---

## 🔧 API Details

### Authentication Method
- **OAuth 2.0** with Facebook Graph API
- Uses Facebook Page access token

### API Version
- Instagram Graph API (via Facebook Graph API v18.0+)

### Endpoints Used

1. **Create Media Container**:
```
POST https://graph.facebook.com/v18.0/{IG_USER_ID}/media
```

2. **Publish Media**:
```
POST https://graph.facebook.com/v18.0/{IG_USER_ID}/media_publish
```

### Required Permissions
- `instagram_basic`
- `instagram_content_publish`
- `pages_read_engagement`
- `pages_show_list`

### Post Flow
1. Upload image to publicly accessible URL (Discord CDN)
2. Create media container with image URL and caption
3. Publish media container to Instagram feed

---

## ✅ Testing Your Setup

### 1. Restart Your Bot
```bash
npm start
```

### 2. Run the Command in Discord
```
/post platform:Instagram
```

### 3. Expected Flow
1. Select your Instagram account from dropdown
2. Enter post caption in modal
3. Upload image (**required** for Instagram)
4. Preview appears with Instagram pink color (📸)
5. Click **Publish**
6. Post appears on Instagram!

### 4. Verify on Instagram
- Check your Instagram profile
- Post should appear with image and caption

---

## 🎨 Bot Features

### Preview
- **Color**: Instagram Pink (`#E4405F`)
- **Emoji**: 📸
- **Shows**: Caption preview, image thumbnail, account name

### Publishing
- **Status**: "Publishing to Instagram..." with Instagram pink
- **Success**: Beautiful embed with post link and timestamp
- **Error**: Red embed with error details

---

## ❓ Troubleshooting

### "Invalid access token"
**Solution:**
- Token expired (60 days for long-lived)
- Regenerate long-lived token using Step 7
- Ensure token has required permissions

### "Instagram account not found"
**Solution:**
- Verify Platform User ID is correct
- Must be Instagram Business Account ID, not Page ID
- Re-run Step 8 to get correct ID

### "Account is not a Business account"
**Solution:**
- Instagram account must be Business or Creator
- Follow Step 1 to convert account
- Reconnect to Facebook Page

### "Image URL not accessible"
**Solution:**
- Instagram requires publicly accessible image URL
- Discord CDN URLs work (bot downloads and uses Discord URL)
- Image must be accessible when Instagram fetches it

### "Caption too long"
**Solution:**
- Instagram captions max 2,200 characters
- Reduce caption length
- Bot should handle this automatically

### "Publishing failed"
**Solution:**
- Check if media container was created successfully
- Verify image format (JPG, PNG)
- Image size: min 320px, max 8MB
- Aspect ratio: 4:5 to 1.91:1

### "Permission denied"
**Solution:**
- App not approved for `instagram_content_publish`
- Submit app for review in Facebook App Dashboard
- Or use in Development Mode (limited to app admins/testers)

---

## 📊 Rate Limits

### Instagram Graph API Limits
- **200 calls per hour** per user
- **Media publish**: 25 posts per 24 hours per account
- **Container creation**: 50 per hour

### Best Practices
- Don't publish too frequently (Instagram may flag as spam)
- Recommended: Max 1 post per hour
- Space out posts throughout the day

---

## 🔄 Token Refresh

Access tokens expire after 60 days. To avoid disruption:

### Option 1: Manual Refresh
- Every 50 days, regenerate long-lived token (Step 7)
- Update token in Notion

### Option 2: Automated Refresh (Advanced)
Implement token refresh in your bot:
```javascript
// Exchange for new long-lived token before expiry
const response = await fetch(
  `https://graph.facebook.com/v18.0/oauth/access_token?` +
  `grant_type=fb_exchange_token&` +
  `client_id=${APP_ID}&` +
  `client_secret=${APP_SECRET}&` +
  `fb_exchange_token=${CURRENT_TOKEN}`
);
```

---

## 🔒 Security Best Practices

1. **Never share access tokens publicly**
2. **Use long-lived tokens** (60 days) instead of short-lived (1 hour)
3. **Store tokens securely** in Notion (private database)
4. **Regenerate tokens** if compromised
5. **Limit app permissions** to minimum required
6. **Keep app in Development Mode** unless you need public access

---

## ⚠️ Important Limitations

### Instagram API Restrictions
- ✅ Can post photos with captions
- ✅ Can post carousels (multiple images)
- ❌ Cannot post Stories (requires different API)
- ❌ Cannot post Reels (requires different API)
- ❌ Cannot post videos (requires different flow)
- ❌ Cannot edit posts after publishing
- ❌ Cannot delete posts via API

### Content Requirements
- **Image required** (cannot post text-only)
- **Aspect ratio**: 4:5 (portrait) to 1.91:1 (landscape)
- **Min dimensions**: 320px
- **Max file size**: 8MB
- **Formats**: JPG, PNG

---

## 📚 Resources

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Content Publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [Facebook App Dashboard](https://developers.facebook.com/apps/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Access Tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)

---

## 🎉 You're Ready!

Once you've added your Instagram credentials to Notion, you can start posting to Instagram immediately! The bot handles:
- ✅ OAuth 2.0 authentication
- ✅ Media container creation
- ✅ Image publishing to Instagram feed
- ✅ Beautiful status updates
- ✅ Error handling

**No code changes needed!** 🚀

---

## 💡 Pro Tips

1. **Test in Development Mode** first (only visible to app admins)
2. **Use high-quality images** (min 1080px width recommended)
3. **Include hashtags** in captions for better reach
4. **Tag location** (requires additional API call)
5. **Schedule posts** during peak engagement times
6. **Monitor rate limits** to avoid being blocked
