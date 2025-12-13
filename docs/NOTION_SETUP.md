# Notion Database Templates

## 1. Main Configuration Database

**Database Name:** Bot Configuration

### Properties:
1. **Name** (Title) - The name/identifier of the config
2. **Type** (Select) - Options:
   - Discord Token
   - Discord Client ID
   - Social Links Database ID
   - Discord Server
3. **Value** (Text) - The actual value
4. **Server ID** (Text) - Discord server ID (for server configs)
5. **Channel ID** (Text) - Discord channel ID (for server configs)

### Sample Data:

| Name | Type | Value | Server ID | Channel ID |
|------|------|-------|-----------|------------|
| Bot Token | Discord Token | (stored in .env) | - | - |
| Client ID | Discord Client ID | (stored in .env) | - | - |
| Social Links DB | Social Links Database ID | abc123def456 | - | - |
| Server 1 | Discord Server | - | 123456789012345678 | 987654321098765432 |
| Server 2 | Discord Server | - | 234567890123456789 | 876543210987654321 |

**Note:** You can leave Discord Token and Client ID values empty since we use .env for those. The important one is the Social Links Database ID.

---

## 2. Social Links Database

**Database Name:** Social Media Links

### Properties:
1. **Name** (Title) - Auto-generated or platform name
2. **Platform** (Select) - Options:
   - X
   - Dribbble
   - YouTube
   - Framer
   - Instagram
3. **Account URL** (URL) - The social media profile URL
4. **Server ID** (Text) - Discord server where it was added
5. **Added By** (Text) - Discord user ID who added it
6. **Added Date** (Date) - When it was added

### Sample Data:

| Name | Platform | Account URL | Server ID | Added By | Added Date |
|------|----------|-------------|-----------|----------|------------|
| X Account 1 | X | https://x.com/username | 123456789 | 987654321 | 2024-01-15 |
| YouTube Channel | YouTube | https://youtube.com/@channel | 123456789 | 987654321 | 2024-01-15 |
| Dribbble Profile | Dribbble | https://dribbble.com/user | 234567890 | 876543210 | 2024-01-16 |

---

## Setup Instructions:

1. **Create both databases in Notion**
2. **Add the properties as listed above**
3. **Share both databases with your Notion integration:**
   - Click "..." (three dots) in the top right
   - Click "Add connections"
   - Select your integration
4. **Get the database IDs:**
   - Open each database as a full page
   - Copy the ID from the URL: `notion.so/workspace/DATABASE_ID?v=...`
5. **Add the Social Links Database ID to your Main Configuration Database**
6. **Add the Main Configuration Database ID to your .env file**

---

## Important Notes:

- The bot will automatically populate the Social Links database when users use `/add`
- You can manually add entries to either database if needed
- Server ID and Channel ID in the main config are optional - they're for future features
- Make sure to share BOTH databases with your Notion integration, or the bot won't be able to access them!

---

## How to Get Discord IDs:

1. **Enable Developer Mode in Discord:**
   - User Settings → Advanced → Enable "Developer Mode"

2. **Get Server ID:**
   - Right-click on the server icon → "Copy Server ID"

3. **Get Channel ID:**
   - Right-click on a channel → "Copy Channel ID"

4. **Get User ID:**
   - Right-click on a user → "Copy User ID"
