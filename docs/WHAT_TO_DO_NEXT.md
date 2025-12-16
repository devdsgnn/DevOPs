# 🚀 Quick Start Guide - What to Do Next

## ✅ What's Already Done

- ✅ Platform Accounts database created in Notion
- ✅ Database fields configured (6 fields total)
- ✅ Database ID added to Main Config
- ✅ Bot code is ready
- ✅ Commands deployed

## 📍 Where You Are Now

You have an **empty** Platform Accounts database that's ready to receive your social media accounts.

---

## 🎯 Next Steps (Choose Your Path)

### Option A: Test First (Recommended)
**Goal**: Test the UI without actually posting

1. Go to your **Platform Accounts** database in Notion
2. Click **"New"** to create a test account
3. Fill in these fields:

```
Name: Test Twitter Account
Platform: X (select from dropdown)
Username: @test
Access Token: fake_token_123
Refresh Token: (leave empty)
Platform User ID: (leave empty)
```

4. **Save** the entry
5. Go to Discord and run: `/post platform:X`
6. You should see a dropdown with "Test Twitter Account"
7. Select it and fill in the modal
8. It will fail to post (fake token), but you'll see the full workflow!

---

### Option B: Post to Twitter/X for Real
**Goal**: Actually post to Twitter

#### Step 1: Get Twitter OAuth Token

1. Go to: https://developer.twitter.com/
2. Sign in with your Twitter account
3. Click **"Create App"** (or use existing app)
4. Go to **"Keys and tokens"** tab
5. Click **"Generate"** under "Access Token and Secret"
6. Copy the **Bearer Token** (looks like: `AAAAAAAAAAAAAAAAAAAAABcde...`)

#### Step 2: Add to Notion

1. Go to your **Platform Accounts** database in Notion
2. Click **"New"**
3. Fill in:

```
Name: My Twitter Account
Platform: X (select from dropdown)
Username: @yourusername
Access Token: [paste your Bearer Token here]
Refresh Token: (leave empty)
Platform User ID: (leave empty)
```

4. **Save**

#### Step 3: Test in Discord

1. Go to Discord
2. Run: `/post platform:X`
3. Select "My Twitter Account"
4. Fill in the modal:
   - Tweet Content: "Testing my Discord bot! 🚀"
   - Image URL: (leave empty or add a public image URL)
5. Submit
6. Check your Twitter - it should post! 🎉

---

### Option C: Post to LinkedIn
**Goal**: Post to LinkedIn

#### Step 1: Get LinkedIn OAuth Token & Person ID

This is more complex. You need:
1. LinkedIn Developer account
2. Create an app
3. Request "Share on LinkedIn" product access
4. Complete OAuth flow
5. Get access token AND person ID

**Easier Alternative**: Use a service like [Postman](https://www.postman.com/) to test LinkedIn OAuth and get your tokens.

#### Step 2: Add to Notion

```
Name: My LinkedIn Account
Platform: LinkedIn (select from dropdown)
Username: your-linkedin-username
Access Token: [your LinkedIn access token]
Refresh Token: (optional)
Platform User ID: abc123 (your person ID without urn:li:person: prefix)
```

---

### Option D: Post to Instagram
**Goal**: Post to Instagram

**Requirements**:
- Instagram Business or Creator account
- Connected to a Facebook Page
- Facebook App with Instagram permissions

This is the most complex setup. See full guide in `docs/POST_COMMAND_GUIDE.md`.

---

## 🎯 Recommended Path for You

**I recommend starting with Option A (Test) or Option B (Twitter)**

### Why Twitter is Easiest:
- ✅ Simplest OAuth setup
- ✅ No extra IDs needed (no Platform User ID)
- ✅ Quick to get tokens
- ✅ Easy to verify it works

---

## 📝 Exact Steps to Start (Twitter)

### 1️⃣ Open Notion
- Go to: https://notion.so
- Find your **Platform Accounts** database
- It should be empty right now

### 2️⃣ Get Twitter Token
- Go to: https://developer.twitter.com/en/portal/dashboard
- Sign in
- Create app or select existing
- Go to "Keys and tokens"
- Generate Bearer Token
- **Copy it** (you'll need it in next step)

### 3️⃣ Add to Notion
Click "New" in Platform Accounts database and fill:

| Field | What to Enter |
|-------|---------------|
| **Name** | Type: "My Twitter" |
| **Platform** | Click dropdown → Select "X" |
| **Username** | Type: "@yourhandle" |
| **Access Token** | Paste your Bearer Token |
| **Refresh Token** | Leave empty |
| **Platform User ID** | Leave empty |

Click outside or press Enter to save.

### 4️⃣ Test in Discord
1. Open Discord
2. Type: `/post` and press Tab
3. Select `platform:` → Choose "X"
4. Press Enter
5. You should see a dropdown with "My Twitter"
6. Select it
7. Fill in the modal with your tweet
8. Submit!

### 5️⃣ Verify
- Check your Twitter feed
- You should see your tweet! 🎉

---

## 🆘 If You Get Stuck

### "I don't see the /post command"
- Make sure bot is running: `npm start`
- Commands were deployed (already done ✅)
- Bot has permissions in your server

### "No accounts found"
- Check you saved the account in Notion
- Platform field is set to "X"
- Restart the bot: Stop and run `npm start` again

### "Failed to post"
- Check your Bearer Token is correct
- Make sure it hasn't expired
- Verify you have write permissions in Twitter app settings

---

## 📚 Full Documentation

- **Setup Guide**: `docs/POST_COMMAND_GUIDE.md`
- **Adding Accounts**: `docs/ADDING_FIRST_ACCOUNT.md`
- **Quick Reference**: `docs/POST_COMMAND_QUICK_REF.md`

---

## 🎯 Summary

**Right now, you need to:**
1. ✅ Open your Platform Accounts database in Notion
2. ✅ Add your first account (Twitter recommended)
3. ✅ Run `/post` in Discord
4. ✅ Post something!

**That's it!** The bot will handle everything else automatically. 🚀
