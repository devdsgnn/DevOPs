# Twitter/X API Setup Guide

## 🎯 Overview

This guide walks you through setting up Twitter/X API access for posting tweets with text and images.

---

## 📋 Prerequisites

- Twitter/X account
- Access to [Twitter Developer Portal](https://developer.twitter.com/)
- Elevated API access (free tier works for basic posting)

---

## 🚀 Step-by-Step Setup

### Step 1: Create a Twitter Developer Account

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Click **Sign up** (if you don't have a developer account)
3. Fill in the application form:
   - **What's your use case?** → Building a bot
   - **Will you make Twitter content available to government entities?** → No
   - Accept the terms and conditions
4. Verify your email address

### Step 2: Create an App

1. In the Developer Portal, click **Projects & Apps** → **Overview**
2. Click **+ Create App** (or **+ Create Project** if you don't have one)
3. Fill in app details:
   - **App name**: `YourBotName` (e.g., "Social Media Manager Bot")
   - **Description**: Brief description of what your bot does
   - **Website URL**: Your website or `https://example.com`
   - **Callback URL**: `http://localhost:3000/callback` (for OAuth)
4. Click **Create**

### Step 3: Set App Permissions

1. Go to your app's **Settings** tab
2. Scroll to **User authentication settings**
3. Click **Set up** or **Edit**
4. Configure:
   - **App permissions**: ✅ **Read and Write** (required for posting)
   - **Type of App**: **Web App, Automated App or Bot**
   - **Callback URI**: `http://localhost:3000/callback`
   - **Website URL**: Your website or `https://example.com`
5. Click **Save**

### Step 4: Get Your API Keys

1. Go to **Keys and tokens** tab
2. You need **4 tokens** for OAuth 1.0a:

#### Required Tokens:

| Token Name | Field in Notion | Where to Find |
|------------|----------------|---------------|
| **API Key** | API Key | Under "Consumer Keys" |
| **API Key Secret** | API Secret | Under "Consumer Keys" (click "Regenerate" if hidden) |
| **Access Token** | Access Token | Under "Authentication Tokens" |
| **Access Token Secret** | Access Token Secret | Under "Authentication Tokens" |

3. Click **Generate** under "Authentication Tokens" if you don't see Access Token/Secret
4. **⚠️ IMPORTANT**: Copy all 4 tokens immediately - you won't see the secrets again!

---

## 📝 Add to Notion Database

Add a new row in your **Platform Accounts** database:

| Field | Value | Example |
|-------|-------|---------|
| **Name** | Account display name | `Company Twitter` |
| **Platform** | Select: `X` | X |
| **Username** | Your Twitter handle | `@yourcompany` |
| **API Key** | Consumer Key | `xvz1evFS4wEEPTGEFPHBog` |
| **API Secret** | Consumer Secret | `L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg` |
| **Access Token** | OAuth 1.0a Access Token | `370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb` |
| **Access Token Secret** | OAuth 1.0a Access Token Secret | `LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE` |

**Required Fields:**
- ✅ Name
- ✅ Platform (must be "X")
- ✅ API Key
- ✅ API Secret
- ✅ Access Token
- ✅ Access Token Secret

---

## 🔧 API Details

### Authentication Method
- **OAuth 1.0a** (required for posting)
- **NOT** OAuth 2.0 Bearer Token (read-only)

### API Version
- Twitter API v2

### Endpoints Used
1. **Upload Media** (v1.1):
   ```
   POST https://upload.twitter.com/1.1/media/upload.json
   ```

2. **Create Tweet** (v2):
   ```
   POST https://api.twitter.com/2/tweets
   ```

### Required Scopes
- `tweet.read`
- `tweet.write`
- `users.read`

---

## ✅ Testing Your Setup

### 1. Restart Your Bot
```bash
npm start
```

### 2. Run the Command in Discord
```
/post platform:X
```

### 3. Expected Flow
1. Select your Twitter account from dropdown
2. Enter post text in modal
3. Upload image (optional)
4. Preview appears with Twitter blue color (𝕏)
5. Click **Publish**
6. Post appears on Twitter!

### 4. Verify on Twitter
- Check your Twitter profile
- Post should appear with text and image (if uploaded)

---

## 🎨 Bot Features

### Preview
- **Color**: Twitter Blue (`#1DA1F2`)
- **Emoji**: 𝕏
- **Shows**: Text preview, image thumbnail, account name

### Publishing
- **Status**: "Publishing to X..." with Twitter blue
- **Success**: Beautiful embed with post link and timestamp
- **Error**: Red embed with error details

---

## ❓ Troubleshooting

### "Invalid or expired token"
**Solution:**
- Regenerate your tokens in Developer Portal
- Make sure you copied all 4 tokens correctly
- Verify app permissions are "Read and Write"

### "Read-only application cannot POST"
**Solution:**
- You're using Bearer Token (OAuth 2.0) instead of OAuth 1.0a
- Follow Step 4 to get the correct 4 tokens
- Ensure app permissions are "Read and Write"

### "Could not authenticate you"
**Solution:**
- Check all 4 tokens are entered correctly in Notion
- No extra spaces or line breaks
- API Key and API Secret match your app

### "Media upload failed"
**Solution:**
- Check image size (max 5MB for images)
- Supported formats: JPG, PNG, GIF, WebP
- Verify you have "Read and Write" permissions

### "Rate limit exceeded"
**Solution:**
- Twitter has rate limits:
  - **Free tier**: 1,500 tweets per month
  - **Basic**: 3,000 tweets per month
  - **Pro**: 10,000 tweets per month
- Wait for rate limit to reset (usually 15 minutes)

---

## 📊 Rate Limits

### Free Tier (Elevated Access)
- **Tweets**: 1,500 per month
- **Media uploads**: 50 per 24 hours
- **API calls**: 500,000 per month

### Basic ($100/month)
- **Tweets**: 3,000 per month
- **Media uploads**: 100 per 24 hours
- **API calls**: 10,000,000 per month

---

## 🔒 Security Best Practices

1. **Never share your tokens publicly**
2. **Store tokens in Notion** (private database)
3. **Regenerate tokens** if compromised
4. **Use environment variables** for sensitive data
5. **Restrict app permissions** to minimum required

---

## 📚 Resources

- [Twitter API Documentation](https://developer.twitter.com/en/docs)
- [OAuth 1.0a Guide](https://developer.twitter.com/en/docs/authentication/oauth-1-0a)
- [Tweet Creation](https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/introduction)
- [Media Upload](https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/overview)
- [Developer Portal](https://developer.twitter.com/en/portal/dashboard)

---

## 🎉 You're Ready!

Once you've added your Twitter credentials to Notion, you can start posting tweets immediately! The bot handles:
- ✅ OAuth 1.0a authentication
- ✅ Image upload to Twitter CDN
- ✅ Tweet creation with media
- ✅ Beautiful status updates
- ✅ Error handling

**No code changes needed!** 🚀
