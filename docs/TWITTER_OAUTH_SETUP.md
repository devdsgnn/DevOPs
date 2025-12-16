# Twitter OAuth 1.0a Setup Guide

## ⚠️ Important: Twitter Requires OAuth 1.0a for Posting

The Bearer Token you have is **read-only**. To post tweets, you need **OAuth 1.0a** tokens.

## 🔑 Getting the Right Tokens

### Step 1: Go to Twitter Developer Portal
https://developer.twitter.com/en/portal/dashboard

### Step 2: Select Your App
Click on the app you created (or create a new one)

### Step 3: Set Permissions to "Read and Write"
1. Go to **Settings** tab
2. Scroll to **"User authentication settings"**
3. Click **"Set up"** or **"Edit"**
4. Set **App permissions** to **"Read and Write"**
5. Set **Type of App** to **"Web App"** or **"Native App"**
6. Add a **Callback URL** (can be `http://localhost:3000` for testing)
7. Save changes

### Step 4: Get Your 4 Tokens
1. Go to **"Keys and tokens"** tab
2. You need these **4 values**:

```
API Key (Consumer Key):          [Copy this]
API Key Secret (Consumer Secret): [Copy this]
Access Token:                     [Copy this]
Access Token Secret:              [Copy this]
```

If you don't see Access Token/Secret, click **"Generate"** button under "Authentication Tokens"

## 📝 What to Store in Notion

You need to update your Notion database structure to store 4 tokens instead of 1:

### Current Structure (Wrong):
- Access Token: Bearer token (read-only)

### New Structure (Correct):
- API Key: `your_api_key_here`
- API Secret: `your_api_secret_here`
- Access Token: `your_access_token_here`
- Access Token Secret: `your_access_token_secret_here`

## 🔧 Database Update Needed

We need to add 3 new fields to the Platform Accounts database:
1. **API Key** (Text)
2. **API Secret** (Text)
3. **Access Token Secret** (Text)

And rename:
- **Access Token** → Keep as is (but use OAuth 1.0a Access Token, not Bearer)

## ✅ Once You Have the Tokens

Provide me with all 4 tokens and I'll update your Notion account automatically!

Format:
```
API Key: xxxxx
API Secret: xxxxx
Access Token: xxxxx
Access Token Secret: xxxxx
```

## 🎯 Why This Change?

Twitter's API has different authentication methods:
- **OAuth 2.0 Bearer Token** → Read-only (can't post)
- **OAuth 1.0a** → Full access (can post tweets)

For posting, we MUST use OAuth 1.0a with all 4 tokens.
