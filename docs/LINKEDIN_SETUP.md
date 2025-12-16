# LinkedIn Posting Setup Guide

## ✅ What's Already Done

The LinkedIn posting functionality is **fully implemented** and ready to use! Here's what works:

### 1. **Code Implementation**
- ✅ LinkedIn API integration in `platformPoster.js`
- ✅ Image upload support (uploads to LinkedIn CDN)
- ✅ Text post support
- ✅ LinkedIn blue color (`#0A66C2`) in all embeds
- ✅ LinkedIn emoji (💼) in published embeds
- ✅ Same preview → publish flow as Twitter

### 2. **How It Works**
1. `/post` → Select **LinkedIn** platform
2. Select your LinkedIn account
3. Enter post text
4. Upload image (optional)
5. Preview appears in Draft Channel with LinkedIn blue color
6. Click **Publish**
7. Bot downloads image → Uploads to LinkedIn → Posts
8. Beautiful published embed appears in Publish Channel

---

## 📋 What You Need to Do

### Step 1: Get LinkedIn API Credentials

You need to create a LinkedIn App and get OAuth tokens:

#### A. Create LinkedIn App
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click **Create App**
3. Fill in:
   - **App name**: Your bot name
   - **LinkedIn Page**: Your company page
   - **App logo**: Upload a logo
   - **Legal agreement**: Accept terms
4. Click **Create app**

#### B. Request API Access
1. In your app, go to **Products** tab
2. Request access to:
   - ✅ **Share on LinkedIn** (required for posting)
   - ✅ **Sign In with LinkedIn using OpenID Connect** (for auth)
3. Wait for approval (usually instant for Share on LinkedIn)

#### C. Get OAuth Credentials
1. Go to **Auth** tab
2. Copy:
   - **Client ID**
   - **Client Secret**
3. Add redirect URL: `http://localhost:3000/callback` (or your domain)

#### D. Get Access Token
You need to complete OAuth flow to get:
- **Access Token** (expires in 60 days)
- **Refresh Token** (to renew access token)

**OAuth Flow:**
```
1. Redirect user to:
https://www.linkedin.com/oauth/v2/authorization?
  response_type=code&
  client_id={YOUR_CLIENT_ID}&
  redirect_uri={YOUR_REDIRECT_URI}&
  scope=profile%20email%20w_member_social

2. User authorizes → LinkedIn redirects with code

3. Exchange code for tokens:
POST https://www.linkedin.com/oauth/v2/accessToken
{
  grant_type: "authorization_code",
  code: "{CODE}",
  client_id: "{CLIENT_ID}",
  client_secret: "{CLIENT_SECRET}",
  redirect_uri: "{REDIRECT_URI}"
}

4. Response contains:
{
  "access_token": "...",
  "expires_in": 5184000,
  "refresh_token": "..."
}
```

#### E. Get Your LinkedIn Person ID
```bash
curl -X GET 'https://api.linkedin.com/v2/userinfo' \
  -H 'Authorization: Bearer {ACCESS_TOKEN}'
```

Response will include your `sub` (Person ID):
```json
{
  "sub": "abc123xyz",
  "name": "Your Name",
  "email": "your@email.com"
}
```

---

### Step 2: Add Account to Notion

Add a new row in your **Platform Accounts** database:

| Field | Value | Example |
|-------|-------|---------|
| **Name** | Account display name | `My LinkedIn` |
| **Platform** | Select: `LinkedIn` | LinkedIn |
| **Username** | Your LinkedIn username | `john-doe` or `@john-doe` |
| **Access Token** | OAuth access token | `AQV8...` |
| **Refresh Token** | OAuth refresh token | `AQX9...` |
| **Platform User ID** | Your Person ID (sub) | `abc123xyz` |

**Important Fields:**
- ✅ `Access Token` - Required for API calls
- ✅ `Platform User ID` - Required (the `sub` from userinfo)
- ✅ `Refresh Token` - Optional but recommended for token renewal

---

### Step 3: Test It!

1. Run `/post` in Discord
2. Select **LinkedIn** platform
3. Select your LinkedIn account
4. Enter text: `Testing LinkedIn posting from Discord! 🚀`
5. Upload an image (optional)
6. Click **Publish**

**Expected Result:**
- ✅ Post appears on your LinkedIn feed
- ✅ Image included (if uploaded)
- ✅ Beautiful embed in Publish Channel with LinkedIn blue color

---

## 🔧 API Details

### LinkedIn API Endpoints Used

1. **Initialize Image Upload**
   ```
   POST https://api.linkedin.com/rest/images?action=initializeUpload
   ```

2. **Upload Image**
   ```
   PUT {uploadUrl from step 1}
   ```

3. **Create Post**
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

## 🎨 LinkedIn Colors & Branding

- **Color**: `#0A66C2` (LinkedIn Blue)
- **Emoji**: 💼
- **Preview**: LinkedIn blue embed
- **Processing**: LinkedIn blue "Publishing to LinkedIn..."
- **Published**: LinkedIn blue with thumbnail and link

---

## 🔄 Token Refresh (Optional)

Access tokens expire in 60 days. To refresh:

```javascript
POST https://www.linkedin.com/oauth/v2/accessToken
{
  grant_type: "refresh_token",
  refresh_token: "{REFRESH_TOKEN}",
  client_id: "{CLIENT_ID}",
  client_secret: "{CLIENT_SECRET}"
}
```

---

## ❓ Troubleshooting

### "Invalid access token"
- ✅ Check token hasn't expired (60 days)
- ✅ Use refresh token to get new access token
- ✅ Verify token has `w_member_social` scope

### "Person ID not found"
- ✅ Make sure you're using the `sub` from `/v2/userinfo`
- ✅ Format should be just the ID, not `urn:li:person:{ID}`

### "Image upload failed"
- ✅ Check image size (max 8MB)
- ✅ Verify image format (JPG, PNG, GIF)
- ✅ Ensure access token has proper permissions

---

## 📚 Resources

- [LinkedIn API Docs](https://learn.microsoft.com/en-us/linkedin/)
- [Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin)
- [OAuth 2.0](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [Image Upload](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/images-api)

---

## ✅ Ready to Go!

Once you add your LinkedIn credentials to Notion, you can start posting immediately. The bot handles everything:
- ✅ Image download from Discord
- ✅ Image upload to LinkedIn
- ✅ Post creation
- ✅ Beautiful status updates

**No code changes needed!** 🎉
