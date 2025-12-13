# ✅ /site Command - Complete Setup Summary

## 🎯 What You Need to Do

### Step 1: Create Site Inspirations Database in Notion

Create a new database with these **exact** property names:

| Property Name | Type | Required |
|--------------|------|----------|
| **Name** | Title | ✅ Yes |
| **URL** | URL | ✅ Yes |
| **Description** | Rich Text | ✅ Yes |

### Step 2: Add to Main Configuration Database

In your main Notion config database, add this row:

| Name | Value |
|------|-------|
| `DB - SiteInspirations` | `[Your Site Inspirations Database ID]` |

**How to get the Database ID:**
1. Open your Site Inspirations database in Notion
2. Copy the URL from your browser
3. Extract the 32-character ID from the URL:
   ```
   https://www.notion.so/workspace/abc123def456...?v=xyz
                                  ^^^^^^^^^^^^^^^^
                                  This is your Database ID
   ```

### Step 3: Share Database with Integration

1. Open the Site Inspirations database
2. Click `•••` → "Add connections"
3. Select your Discord bot integration
4. Click "Confirm"

## 🚀 How It Works

When you run:
```
/site url: https://example.com
```

The bot will:

1. ✅ **Extract metadata** from the webpage
   - Page title (from `<title>`, `og:title`, or `twitter:title`)
   - Description (from meta tags)

2. ✅ **Save to Notion** with:
   - Name: The extracted title
   - URL: The website URL
   - Description: The full description

3. ✅ **Take a screenshot**
   - Waits 10 seconds for page to fully load
   - Captures 1920x1080 viewport
   - Screenshot is sent to Discord only (NOT saved in Notion)

4. ✅ **Send Discord embed** with:
   - Title (clickable link to the site)
   - Description (truncated to ~2 lines with "...")
   - Link button
   - Screenshot image attached

## 📋 Example Discord Output

```
✅ Website inspiration saved!

┌─────────────────────────────────────────┐
│ Beautiful Design Portfolio              │
│ https://example.com                     │
├─────────────────────────────────────────┤
│ A stunning collection of modern web     │
│ design inspirations and creative...     │
│                                         │
│ 🔗 Link                                 │
│ Visit Website                           │
│                                         │
│ [Screenshot of the webpage]             │
│                                         │
│ Saved to Notion • Dec 13, 2025 5:47 PM │
└─────────────────────────────────────────┘
```

## 📦 Installed Packages

The following packages were added:
- ✅ `puppeteer@latest` - For taking screenshots
- ✅ `node-fetch@^3.3.2` - For fetching webpage content
- ✅ `cheerio@^1.0.0-rc.12` - For parsing HTML metadata

## 📁 Files Created/Modified

### New Files:
- ✅ `src/commands/site.js` - The /site slash command
- ✅ `src/utils/webpageUtils.js` - Metadata extraction & screenshot utilities
- ✅ `SITE_INSPIRATIONS_SETUP.md` - Detailed setup guide
- ✅ `SITE_INSPIRATIONS_QUICKSTART.md` - Quick reference
- ✅ `SITE_COMMAND_SUMMARY.md` - This file

### Modified Files:
- ✅ `package.json` - Added new dependencies
- ✅ `src/utils/notionManager.js` - Added site inspiration methods
- ✅ `src/events/interactionCreate.js` - Added handleSiteCommand function

## 🎮 Ready to Use!

The command is already deployed. Just:

1. Set up your Notion database (steps above)
2. Add the database ID to your config
3. Start the bot: `npm start`
4. Test it: `/site url: https://dribbble.com`

## 🔧 Troubleshooting

### "Site Inspirations database ID not configured"
- Check that you added `DB - SiteInspirations` to your main config database
- Restart the bot to clear the cache

### Screenshot fails but URL saves
- This is normal for some websites that block automation
- The URL and metadata will still be saved to Notion

### "Invalid URL format"
- Make sure to include `https://` or `http://`
- Example: `https://example.com` not `example.com`

---

## 📝 Next: Fix /links Command

As you mentioned, I'll also fix the `/links` command to:
- Remove pagination buttons
- Send multiple embeds at once (10 links per embed)
- Avoid the 1024 character limit error

Would you like me to fix that now?
