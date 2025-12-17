# 🚀 Quick Setup Guide

## Step 1: Get Your Discord Webhook

1. Open Discord
2. Go to the channel where you want screenshots posted
3. Click the gear icon (⚙️) next to the channel name
4. Go to **Integrations** → **Webhooks**
5. Click **New Webhook** or use an existing one
6. Click **Copy Webhook URL**

**Example webhook URL:**
```
https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz
```

---

## Step 2: Get Your Notion Credentials

### Notion API Key

1. Go to https://www.notion.so/my-integrations
2. Click **+ New integration**
3. Name it: `Site Inspiration Saver`
4. Select your workspace
5. Click **Submit**
6. Copy the **Internal Integration Token** (starts with `secret_`)

### Notion Database ID

**Option A: Use existing database from main bot**

If you're already running the main Discord bot in this project:

1. Open your `.env` file in the root directory
2. Look for: `NOTION_SITE_INSPIRATIONS_DB_ID=...`
3. Copy the value (32 characters, no dashes)

**Option B: Create new database**

1. Create a new database in Notion
2. Add these properties:
   - **Name** (Title)
   - **URL** (URL)
   - **Description** (Rich Text)
   - **Saved At** (Date)
3. Get the database ID from the URL:
   ```
   https://notion.so/workspace/DATABASE_ID?v=...
                              ^^^^^^^^^^^^
   ```

### Share Database with Integration

⚠️ **IMPORTANT**: You must share the database with your integration!

1. Open your database in Notion
2. Click **Share** (top-right)
3. Click **Invite**
4. Select your integration: `Site Inspiration Saver`
5. Click **Invite**

---

## Step 3: Install the Extension

1. Open Chrome
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **Load unpacked**
5. Navigate to and select: `C:\Ops\chrome-extension`
6. Click **Select Folder**

---

## Step 4: Configure the Extension

1. Click the extension icon (📸) in your Chrome toolbar
2. Enter your credentials:
   - **Discord Webhook URL**: Paste from Step 1
   - **Notion API Key**: Paste from Step 2
   - **Notion Database ID**: Paste from Step 2
3. Click **💾 Save Configuration**

---

## Step 5: Test It!

1. Navigate to any website (e.g., https://dribbble.com)
2. Click the extension icon
3. Click **📸 Capture & Save**
4. Wait for the success message
5. Check your Discord channel and Notion database!

---

## 🎉 You're Done!

The extension will now:
- ✅ Capture screenshots of any webpage
- ✅ Extract title and description automatically
- ✅ Send to Discord with a beautiful embed
- ✅ Save to Notion with all metadata

---

## 💡 Tips

- **Pin the extension**: Right-click the extension icon → Pin
- **Keyboard shortcut**: You can set a custom keyboard shortcut in `chrome://extensions/shortcuts`
- **Multiple databases**: You can change the database ID anytime in settings

---

## ⚠️ Troubleshooting

### "Failed to save to Notion"
- Make sure you **shared the database** with your integration
- Verify the database ID is correct (32 characters)
- Check that all required properties exist

### "Failed to send to Discord"
- Verify the webhook URL is complete and correct
- Make sure the webhook wasn't deleted

### Extension doesn't show up
- Make sure Developer mode is enabled
- Try clicking the puzzle icon (🧩) in Chrome toolbar
- The extension might be hidden - click "Pin" to show it

---

## 🔄 Using with Main Bot

This extension works perfectly alongside the main Discord bot!

Both can use the **same Notion database**, so you can:
- Use `/site` command in Discord for automated screenshots
- Use the Chrome extension for manual captures while browsing
- All inspirations saved in one place! 🎯
