# `/post` Command - Quick Reference

## Command Overview
Post content directly to social media platforms from Discord.

## Supported Platforms
- **𝕏 (Twitter)** - Black embed (#000000)
- **LinkedIn** - Blue embed (#0A66C2)  
- **Instagram** - Purple embed (#C13584)
- **Dribbble** - Pink embed (#EA4C89)

## Quick Start

### 1. Setup Notion Database
Create "Platform Accounts" database with these fields:
- Name (Title)
- Platform (Select: X, LinkedIn, Instagram, Dribbble)
- Username (Text)
- Access Token (Text)
- Refresh Token (Text)
- User ID (Text) - for LinkedIn
- IG User ID (Text) - for Instagram
- Server ID (Text)
- Added By (Text)

Add to main config: `DB - PlatformAccounts` → `[Database ID]`

### 2. Connect Platform Account
Run `/post platform:[platform]` → Click "Connect Account" → Follow OAuth instructions

### 3. Post Content
Run `/post platform:[platform]` → Select account → Fill modal → Submit

## Platform Requirements

### X (Twitter)
- **Text**: 280 chars max
- **Image**: Optional, JPG/PNG/GIF, 5MB max
- **OAuth Scopes**: `tweet.read`, `tweet.write`, `users.read`

### LinkedIn  
- **Text**: 3,000 chars max
- **Image/URL**: Optional
- **OAuth Scopes**: `w_member_social`, `r_liteprofile`
- **Need**: User ID (person:XXXXX format)

### Instagram
- **Caption**: 2,200 chars max
- **Image/Video**: REQUIRED, publicly accessible URL
- **Hashtags**: Optional, comma-separated
- **OAuth Scopes**: `instagram_basic`, `instagram_content_publish`
- **Need**: Instagram Business Account ID
- **Limit**: 50 posts/24 hours

### Dribbble
- **Title**: Required, 100 chars max
- **Description**: Optional, 1,000 chars max
- **Tags**: Optional, max 12, comma-separated
- **Image**: REQUIRED, 400x300 or 800x600 pixels, 8MB max, GIF/JPG/PNG
- **OAuth Scope**: `upload`
- **Need**: Dribbble Player or Team account

## Modal Fields by Platform

| Platform | Title | Content | Tags | Image | URL |
|----------|-------|---------|------|-------|-----|
| X | - | ✅ (280) | - | ⭕ | - |
| LinkedIn | - | ✅ (3000) | - | ⭕ | ⭕ |
| Instagram | - | ✅ (2200) | ⭕ | ✅ | - |
| Dribbble | ✅ (100) | ⭕ (1000) | ⭕ | ✅ | - |

✅ = Required | ⭕ = Optional | - = Not available

## Tag Format
Always use comma-separated format WITHOUT # symbol:
```
design, ui, branding, creative
```

## Image URLs
- Must be direct, publicly accessible URLs
- Examples:
  - ✅ `https://example.com/image.jpg`
  - ✅ `https://i.imgur.com/abc123.png`
  - ❌ `https://drive.google.com/...` (not direct)
  - ❌ `C:\Users\...\image.jpg` (local file)

## Workflow

```
/post → Select Platform
  ↓
Check for Connected Accounts
  ↓
┌─────────────────┬─────────────────┐
│ Accounts Found  │ No Accounts     │
├─────────────────┼─────────────────┤
│ Select Account  │ Connect Account │
│ from Dropdown   │ Button          │
└────────┬────────┴────────┬────────┘
         ↓                 ↓
    Fill Modal      Follow OAuth
         ↓           Instructions
    Submit Post           ↓
         ↓           Add to Notion
    ✅ Success            ↓
         ↓           Return to Start
    Channel
    Notification
```

## Success Response
- Ephemeral confirmation with embed
- Post URL link
- Channel notification: "🎉 **[User]** just posted to [Platform]!"

## Error Handling
- Invalid token → Re-authenticate
- Missing required fields → Modal validation
- Image size/format → Check platform requirements
- Rate limit → Wait and retry

## Files Created
1. `src/commands/post.js` - Main command
2. `src/utils/platformPoster.js` - API integration
3. `src/utils/notionManager.js` - Account management (updated)
4. `src/events/interactionCreate.js` - Handlers (updated)
5. `docs/POST_COMMAND_GUIDE.md` - Full documentation

## Next Steps
1. Install dependencies: `npm install`
2. Deploy commands: `npm run deploy-commands`
3. Create Platform Accounts database in Notion
4. Add database ID to main config
5. Connect your first account
6. Test posting!

## Security Notes
- Tokens stored in Notion (keep database private)
- Never share access tokens publicly
- Refresh tokens regularly
- Use separate tokens for testing

## Support Resources
- [Twitter API Docs](https://developer.twitter.com/en/docs/twitter-api)
- [LinkedIn API Docs](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api)
- [Instagram API Docs](https://developers.facebook.com/docs/instagram-api)
- [Dribbble API Docs](https://developer.dribbble.com/v2/)
