# Setting Up Post Draft & Publish Channels

This guide explains how to configure the Discord channels for the `/post` command's draft preview and publishing workflow.

## Overview

The `/post` command creates a **draft preview** in one channel, then when you click "Publish", it posts to the social platform and shows the **publish status** in another channel.

## Required Notion Configuration

You need to add the following entries to your **Main Configuration Database** in Notion:

### 1. Draft Channel ID

This is where draft previews appear with Publish/Delete buttons.

| Name | Value |
|------|-------|
| `Draft Channel ID` | `1450436525585072138` |

**Alternative name:** `POST_DRAFT_CHANNEL_ID`

### 2. Publish Channel ID

This is where the publishing process and results are shown.

| Name | Value |
|------|-------|
| `Publish Channel ID` | `1450436543595417732` |

**Alternative name:** `POST_PUBLISH_CHANNEL_ID`

### 3. Post Server ID (Optional)

The Discord server ID where these channels are located.

| Name | Value |
|------|-------|
| `Post Server ID` | `1448936162134593538` |

**Alternative name:** `POST_SERVER_ID`

## How It Works

### 1. Creating a Draft

When you use `/post`:
1. Select platform (Twitter, LinkedIn, etc.)
2. Select account
3. Enter post text
4. Optional: Upload image
5. **Draft preview appears** in the Draft Channel (`1450436525585072138`)
   - Shows the post content
   - Shows "Publish" and "Delete" buttons
   - Can be published anytime (even hours later!)

### 2. Publishing

When you click "Publish":
1. **Publishing status appears** in the Publish Channel (`1450436543595417732`)
   - Shows "Publishing to [Platform]..." (orange)
2. The post is sent to the social media platform
3. **Status updates**:
   - ✅ **Success:** Green embed with link to published post
   - ❌ **Error:** Red embed with error details
4. **Draft preview is deleted** from the Draft Channel
5. Draft status in Notion is updated to "Published"

### 3. Deleting a Draft

When you click "Delete":
1. Draft message is removed from the Draft Channel
2. Draft status in Notion is updated to "Deleted"

## Notion Database Fields

Make sure your **Platform Accounts** database has these fields:

- `Name` (Title) - Draft title
- `Platform` (Select) - X, LinkedIn, Instagram, Dribbble
- `Status` (Select) - Draft, Published, Deleted
- `Draft Data` (Rich Text) - JSON containing draft information

## Example Workflow

```
User: /post platform:X
Bot: (shows account selection)
User: 1
Bot: (asks for text)
User: Hello world!
Bot: (asks for image)
User: (uploads image)

📝 DRAFT CHANNEL (1450436525585072138):
┌─────────────────────────────┐
│ @TwitterAccount             │
│ Hello world!                │
│ [image preview]             │
│ [🚀 Publish] [🗑️ Delete]   │
└─────────────────────────────┘

(User clicks Publish - can be minutes or hours later)

📢 PUBLISH CHANNEL (1450436543595417732):
┌─────────────────────────────┐
│ Publishing to X...          │ ← Orange (in-progress)
│ Account: @TwitterAccount    │
│ Content: Hello world!       │
└─────────────────────────────┘

(After posting)

┌─────────────────────────────┐
│ ✅ Published to X!          │ ← Green (success)
│ Account: @TwitterAccount    │
│ Content: Hello world!       │
│ 🔗 View Post               │
└─────────────────────────────┘

(Draft message deleted from Draft Channel)
```

## Troubleshooting

**Problem:** Channels not found
- **Solution:** Make sure the channel IDs are correct in your Notion database
- Verify the bot has access to both channels

**Problem:** Draft data not found
- **Solution:** Ensure the "Draft Data" field exists in your Platform Accounts database
- Check that it's a Rich Text field type

**Problem:** Preview message not deleted
- **Solution:** Ensure the bot has "Manage Messages" permission in the Draft Channel
