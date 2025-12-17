# 📸 Site Inspiration Saver - Chrome Extension

A Chrome extension that captures screenshots of websites and automatically saves them to Discord and Notion.

## Features

- 📸 **One-Click Screenshot Capture** - Capture the visible portion of any webpage
- 🎯 **Automatic Metadata Extraction** - Extracts title, description, and URL from the page
- 💬 **Discord Integration** - Sends beautiful embeds with screenshots to Discord via webhook
- 📝 **Notion Integration** - Saves website information to your Notion database
- 🎨 **Beautiful UI** - Modern gradient design with glassmorphism effects

## Installation

### 1. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder from this project

### 2. Configure API Credentials

1. Click the extension icon in your Chrome toolbar
2. Fill in the following credentials:
   - **Discord Webhook URL**: Create a webhook in your Discord channel settings
   - **Notion API Key**: Get from [Notion Integrations](https://www.notion.so/my-integrations)
   - **Notion Database ID**: The ID of your Site Inspirations database

3. Click **Save Configuration**

## Getting Your Credentials

### Discord Webhook URL

1. Open Discord and go to your server
2. Right-click the channel where you want screenshots posted
3. Select **Edit Channel** → **Integrations** → **Webhooks**
4. Click **New Webhook** or **Copy Webhook URL**
5. Paste the URL into the extension settings

### Notion API Key

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click **+ New integration**
3. Give it a name (e.g., "Site Inspiration Saver")
4. Select the workspace
5. Copy the **Internal Integration Token**

### Notion Database ID

You can use the existing database from the main bot project:
- The database ID is stored in your `.env` file as `NOTION_SITE_INSPIRATIONS_DB_ID`
- Make sure to **share the database** with your Notion integration:
  1. Open the database in Notion
  2. Click **Share** → **Invite**
  3. Select your integration

## Database Schema

Your Notion database should have these properties:

- **Name** (Title) - Website title
- **URL** (URL) - Website URL
- **Description** (Rich Text) - Website description
- **Saved At** (Date) - When it was saved

## Usage

1. Navigate to any website you want to save
2. Click the extension icon
3. Click **📸 Capture & Save**
4. Wait for the success message
5. Check Discord and Notion for your saved inspiration!

## Features in Detail

### Screenshot Capture
- Captures the **visible viewport** of the current tab
- High-quality PNG format
- Automatically attached to Discord message and Notion page

### Metadata Extraction
- Extracts Open Graph metadata (og:title, og:description)
- Falls back to Twitter Card metadata
- Uses page title and meta description as final fallback

### Discord Embed
- Beautiful embed with clickable title linking to the website
- Truncated description (max 200 characters)
- Screenshot displayed as image
- Timestamp and footer

### Notion Entry
- Creates a new page in your database
- Populates all fields automatically
- Includes timestamp for tracking

## Troubleshooting

### "Failed to send to Discord"
- Check that your webhook URL is correct
- Make sure the webhook hasn't been deleted
- Verify the channel still exists

### "Failed to save to Notion"
- Verify your API key is correct
- Make sure the database is shared with your integration
- Check that the database ID is correct
- Ensure all required properties exist in the database

### Extension doesn't appear
- Make sure Developer mode is enabled
- Try reloading the extension
- Check the Chrome console for errors

## Privacy & Security

- All credentials are stored locally in Chrome's sync storage
- No data is sent to third-party servers (except Discord and Notion)
- Screenshots are captured locally and sent directly to your configured endpoints

## Development

The extension uses:
- **Manifest V3** - Latest Chrome extension standard
- **Chrome APIs**: tabs, scripting, storage
- **Vanilla JavaScript** - No frameworks required
- **Modern CSS** - Gradients and glassmorphism

## File Structure

```
chrome-extension/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup UI
├── popup.css          # Popup styling
├── popup.js           # Main logic
├── background.js      # Service worker
├── icons/             # Extension icons
└── README.md          # This file
```

## License

Part of the DevOps bot project.
