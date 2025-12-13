# Site Inspirations - Quick Setup Guide

## What to Add to Your Main Notion Database

Add this row to your main configuration database (the one with ID: `NOTION_MAIN_DATABASE_ID`):

| Name | Value |
|------|-------|
| `DB - SiteInspirations` | `[Your Site Inspirations Database ID]` |

## How to Get Your Site Inspirations Database ID

1. Create a new Notion database with these properties:
   - **Name** (Title) - for the website title
   - **URL** (URL) - for the website URL
   - **Description** (Rich Text) - for the page description

2. Open the database in your browser

3. Copy the database ID from the URL:
   ```
   https://www.notion.so/workspace/abc123def456...?v=xyz
                                  ^^^^^^^^^^^^^^^^
                                  This is your Database ID
   ```

4. Share the database with your Notion integration (same one you used for the bot)

5. Add the row to your main config database as shown above

## Database Properties Required

Your Site Inspirations database MUST have these exact property names:

- ✅ **Name** (Title type)
- ✅ **URL** (URL type)  
- ✅ **Description** (Rich Text type)

## How the /site Command Works

When you run `/site url: https://example.com`, the bot will:

1. ✅ Save the URL to Notion
2. ✅ Extract and save the page title
3. ✅ Extract and save the page description
4. ✅ Send an embedded Discord message with:
   - Title (clickable)
   - Description (truncated to ~2 lines with "...")
   - Link
   - Screenshot of the page (taken after 10 second load time)

**Note:** The screenshot is only sent to Discord, NOT saved in Notion.

## Example Discord Embed

```
✅ Website inspiration saved!

┌─────────────────────────────────────┐
│ Example Website Title               │
│ https://example.com                 │
├─────────────────────────────────────┤
│ This is the description from the    │
│ website's meta tags, truncated to...│
│                                     │
│ 🔗 Link                             │
│ Visit Website                       │
│                                     │
│ [Screenshot Image]                  │
│                                     │
│ Saved to Notion • [timestamp]       │
└─────────────────────────────────────┘
```

## Installation

The following packages were added to support this feature:
- `puppeteer` - for taking screenshots
- `node-fetch` - for fetching webpage content
- `cheerio` - for parsing HTML and extracting metadata

Run `npm install` to install these dependencies.

## Files Created

- `/src/commands/site.js` - The slash command
- `/src/utils/webpageUtils.js` - Utilities for metadata extraction and screenshots
- Updates to `/src/utils/notionManager.js` - Added site inspiration methods
- Updates to `/src/events/interactionCreate.js` - Added handler for /site command

## Next Steps

1. Create your Site Inspirations database in Notion
2. Add the database ID to your main config database
3. Run `npm install` to install new dependencies
4. Restart your bot
5. Run `npm run deploy-commands` to register the new `/site` command
6. Test with `/site url: https://example.com`
