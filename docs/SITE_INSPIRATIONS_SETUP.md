# Site Inspirations Database Setup

This guide explains how to set up the Site Inspirations database in Notion for the `/site` command.

## Database Structure

Create a new database in Notion with the following properties:

### Required Properties

1. **Name** (Title)
   - Type: Title
   - Description: The title of the website

2. **URL** (URL)
   - Type: URL
   - Description: The website URL

3. **Description** (Text)
   - Type: Text (Rich text)
   - Description: The meta description from the website

### Optional Properties (for future use)

4. **Added Date** (Date)
   - Type: Date
   - Description: When the inspiration was saved

5. **Tags** (Multi-select)
   - Type: Multi-select
   - Description: Categories or tags for the inspiration

6. **Rating** (Select)
   - Type: Select
   - Options: ⭐, ⭐⭐, ⭐⭐⭐, ⭐⭐⭐⭐, ⭐⭐⭐⭐⭐
   - Description: Your rating of the inspiration

## Setup Steps

### 1. Create the Database

1. In Notion, create a new page
2. Add a database (full page)
3. Name it "Site Inspirations" or similar
4. Add the properties listed above

### 2. Get the Database ID

1. Open the database in Notion
2. Copy the URL from your browser
3. The database ID is the 32-character string after the workspace name and before the `?v=`
   - Example: `https://www.notion.so/workspace/DATABASE_ID?v=...`
   - Extract: `DATABASE_ID`

### 3. Add to Main Configuration Database

In your main Notion configuration database (the one with `NOTION_MAIN_DATABASE_ID`), add a new row:

- **Name**: `DB - SiteInspirations`
- **Value**: `[paste your Site Inspirations database ID here]`

Alternative names that work:
- `SITE_INSPIRATIONS_DB_ID`
- Any name containing "SiteInspirations"

### 4. Share with Integration

1. Open your Site Inspirations database in Notion
2. Click the `•••` menu in the top right
3. Click "Add connections"
4. Select your Discord bot integration
5. Click "Confirm"

## Usage

Once set up, users can save website inspirations using:

```
/site url: https://example.com
```

The bot will:
1. Extract the page title and description
2. Save it to your Notion database
3. Take a screenshot of the website
4. Send an embedded message in Discord with:
   - The title (clickable link)
   - Description (truncated to 2 lines)
   - The URL
   - A screenshot of the page

## Example Database View

You can create different views in Notion to organize your inspirations:

### Gallery View
- Group by: Tags
- Show: Screenshot (if you add a Files property later)

### Table View
- Sort by: Added Date (newest first)
- Filter: Rating is ⭐⭐⭐⭐⭐ or higher

### Board View
- Group by: Tags
- Sort by: Added Date

## Troubleshooting

### "Site Inspirations database ID not configured"
- Make sure you added the database ID to your main config database
- Check that the Name field is exactly `DB - SiteInspirations`
- Clear the bot's cache by restarting it

### Screenshots not appearing
- This could be due to:
  - The website blocking automated browsers
  - Network issues
  - The website taking too long to load
- The bot will still save the URL and metadata even if screenshots fail

### Missing metadata
- Some websites don't provide proper meta tags
- The bot will use the URL as the title if no metadata is found
- Description will be empty if not available
