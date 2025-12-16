# Adding Your First Platform Account

## ✅ Setup Complete!

Your Platform Accounts database is now configured with all required fields:
- ✅ Name (Title)
- ✅ Platform (Select: X, LinkedIn, Instagram, Dribbble)
- ✅ Username (Text)
- ✅ Access Token (Text)
- ✅ Refresh Token (Text)
- ✅ Platform User ID (Text)

Database ID: `2ca6b4f25007801b97bec5e0a93b0b3c`

---

## 🚀 How to Add Your First Account

### Option 1: Add Manually in Notion

1. **Open your Platform Accounts database** in Notion
2. **Click "New"** to create a new entry
3. **Fill in the fields**:

#### Example: Adding a Twitter/X Account

| Field | Value | Required? |
|-------|-------|-----------|
| **Name** | "Company Twitter" | ✅ Yes |
| **Platform** | Select "X" | ✅ Yes |
| **Username** | "@yourcompany" | ⭕ Optional |
| **Access Token** | "Bearer abc123..." | ✅ Yes |
| **Refresh Token** | "refresh_xyz..." | ⭕ Optional |
| **Platform User ID** | Leave empty (not needed for X) | ⭕ Optional |

#### Example: Adding a LinkedIn Account

| Field | Value | Required? |
|-------|-------|-----------|
| **Name** | "Company LinkedIn" | ✅ Yes |
| **Platform** | Select "LinkedIn" | ✅ Yes |
| **Username** | "company-name" | ⭕ Optional |
| **Access Token** | "AQV..." | ✅ Yes |
| **Refresh Token** | "..." | ⭕ Optional |
| **Platform User ID** | "abc123" (person ID without urn:li:person: prefix) | ✅ Yes |

#### Example: Adding an Instagram Account

| Field | Value | Required? |
|-------|-------|-----------|
| **Name** | "Company Instagram" | ✅ Yes |
| **Platform** | Select "Instagram" | ✅ Yes |
| **Username** | "@yourcompany" | ⭕ Optional |
| **Access Token** | "EAABsb..." | ✅ Yes |
| **Refresh Token** | Leave empty | ⭕ Optional |
| **Platform User ID** | "17841405793187218" (Instagram Business Account ID) | ✅ Yes |

---

## 🔑 Getting Access Tokens

### For X (Twitter)

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create an app or use existing
3. Go to "Keys and tokens" tab
4. Generate "Access Token and Secret"
5. Copy the **Bearer Token** or **Access Token**

**Scopes needed**: `tweet.read`, `tweet.write`, `users.read`

### For LinkedIn

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create an app
3. Request "Share on LinkedIn" product
4. Complete OAuth 2.0 flow
5. Get access token and user ID

**Scopes needed**: `w_member_social`, `r_liteprofile`

**Getting User ID**:
```
GET https://api.linkedin.com/v2/userinfo
Authorization: Bearer YOUR_ACCESS_TOKEN
```
Look for the `sub` field, format as `person:XXXXX`

### For Instagram

1. Convert account to Business/Creator
2. Connect to Facebook Page
3. Create Facebook App at [Facebook Developers](https://developers.facebook.com/)
4. Add Instagram product
5. Get long-lived access token
6. Get Instagram Business Account ID

**Scopes needed**: `instagram_basic`, `instagram_content_publish`

**Getting IG User ID**:
```
GET https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_TOKEN
```
Then get Instagram Business Account ID from the page.

### For Dribbble

1. Go to [Dribbble Applications](https://dribbble.com/account/applications)
2. Register application
3. Complete OAuth with "upload" scope
4. Get access token

**Scope needed**: `upload`

---

## ✅ Testing Your Setup

Once you've added an account:

1. **Restart your bot** (if running):
   ```bash
   npm start
   ```

2. **Run the command in Discord**:
   ```
   /post platform:X
   ```

3. **You should see**:
   - Dropdown to select your account
   - OR "Connect Account" button if no accounts

4. **Select your account** and fill in the modal

5. **Submit** and watch it post!

---

## 🎯 Quick Test Account (For Testing)

If you want to test without real OAuth, you can create a dummy account:

| Field | Test Value |
|-------|-----------|
| Name | "Test Account" |
| Platform | "X" |
| Username | "@test" |
| Access Token | "test_token_123" |

**Note**: This won't actually post (will fail with auth error), but you can test the UI flow!

---

## 📝 Next Steps

1. ✅ Database is set up
2. ✅ Fields are configured
3. ✅ DB ID added to Main Config
4. ⏳ **Add your first account** (follow guide above)
5. ⏳ **Test posting** with `/post`
6. ⏳ **Add more accounts** as needed

---

## 🆘 Troubleshooting

**"No accounts found" when running /post**
- Verify Platform field is set correctly
- Restart the bot to clear cache
- Check that database ID is correct in Main Config

**"Failed to post"**
- Verify access token is valid
- Check token hasn't expired
- Ensure Platform User ID is filled for LinkedIn and Instagram

**"Account not found" after selecting**
- Clear Notion cache (restart bot)
- Check account exists in database
- Verify database ID is correct in Main Config

---

## 🎉 You're Ready!

Your Platform Accounts database is fully configured and ready to use. Add your first account and start posting! 🚀
