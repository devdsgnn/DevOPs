# Social Media Posting Command - Setup Guide

## Overview
The `/post` command allows you to publish content directly to LinkedIn, Instagram, Dribbble, and X (Twitter) from Discord. This guide covers setup, configuration, and usage.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Notion Database Setup](#notion-database-setup)
3. [Platform-Specific Setup](#platform-specific-setup)
4. [Usage Guide](#usage-guide)
5. [API Requirements Summary](#api-requirements-summary)

---

## Prerequisites

### Required Packages
Install the necessary npm packages:
```bash
npm install form-data
```

### Environment Variables
No additional environment variables needed beyond existing Discord and Notion credentials.

---

## Notion Database Setup

### Create Platform Accounts Database

1. **Create a new Notion database** with the following properties:

| Property Name | Type | Description |
|--------------|------|-------------|
| Name | Title | Account display name (e.g., "Company Twitter") |
| Platform | Select | Options: X, LinkedIn, Instagram, Dribbble |
| Username | Text | Platform username (e.g., @username) |
| Access Token | Text | OAuth access token |
| Refresh Token | Text | OAuth refresh token (optional) |
| Platform User ID | Text | LinkedIn person ID or Instagram Business Account ID |

2. **Add the database ID to your main configuration database**:
   - In your main Notion config database, add a new row:
   - **Name**: `DB - PlatformAccounts`
   - **Value**: `[Your Platform Accounts Database ID]`

---

## Platform-Specific Setup

### 1. X (Twitter)

#### Requirements
- Twitter Developer Account
- App with OAuth 2.0 enabled
- Required scopes: `tweet.read`, `tweet.write`, `users.read`, `offline.access`

#### Setup Steps
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use existing
3. Enable OAuth 2.0 in app settings
4. Set permissions to "Read and Write"
5. Generate access token
6. Save to Notion:
   - **Platform**: X
   - **Access Token**: Your access token
   - **Username**: Your Twitter handle

#### API Capabilities
- **Text**: Up to 280 characters
- **Media**: Images (JPG, PNG, GIF - max 5MB)
- **Required**: Text
- **Optional**: Image URL

---

### 2. LinkedIn

#### Requirements
- LinkedIn Developer Account
- App with "Share on LinkedIn" product enabled
- Required scopes: `w_member_social`, `r_liteprofile`

#### Setup Steps
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create an application
3. Request access to "Share on LinkedIn" product
4. Complete OAuth 2.0 flow
5. Get access token and user ID
6. Save to Notion:
   - **Platform**: LinkedIn
   - **Access Token**: Your access token
   - **User ID**: Your LinkedIn member ID (format: person:XXXXX)

#### API Capabilities
- **Text**: Up to 3,000 characters
- **Media**: Images, videos, articles
- **Required**: Text
- **Optional**: Image URL, Article URL

---

### 3. Instagram

#### Requirements
- Instagram Business or Creator Account
- Connected to a Facebook Page
- Facebook App with Instagram permissions
- Required scopes: `instagram_basic`, `instagram_content_publish`

#### Setup Steps
1. Convert Instagram account to Business/Creator
2. Connect to a Facebook Page
3. Create Facebook App at [Facebook Developers](https://developers.facebook.com/)
4. Add Instagram product to your app
5. Get long-lived access token
6. Get Instagram Business Account ID
7. Save to Notion:
   - **Platform**: Instagram
   - **Access Token**: Your access token
   - **IG User ID**: Your Instagram Business Account ID

#### API Capabilities
- **Caption**: Up to 2,200 characters
- **Media**: Images or videos (publicly accessible URL required)
- **Hashtags**: Supported (comma-separated)
- **Required**: Caption, Image/Video URL
- **Optional**: Hashtags

#### Important Notes
- Media must be hosted on a publicly accessible server
- Maximum 50 posts per 24 hours
- Images must be publicly accessible URLs

---

### 4. Dribbble

#### Requirements
- Dribbble Player or Team account
- Registered Dribbble application
- Required scope: `upload`

#### Setup Steps
1. Go to [Dribbble Applications](https://dribbble.com/account/applications)
2. Register a new application
3. Complete OAuth flow with `upload` scope
4. Get access token
5. Save to Notion:
   - **Platform**: Dribbble
   - **Access Token**: Your access token
   - **Username**: Your Dribbble username

#### API Capabilities
- **Title**: Required (max 100 characters)
- **Description**: Optional (max 1,000 characters)
- **Tags**: Optional (max 12 tags, comma-separated)
- **Image**: Required
  - Format: GIF, JPG, or PNG
  - Size: Exactly 400x300 or 800x600 pixels
  - Max file size: 8MB

#### Important Notes
- Must be a Dribbble Player or Team member to post
- Videos are not supported
- Image dimensions must be exact (400x300 or 800x600)

---

## Usage Guide

### Basic Workflow

1. **Start the command**:
   ```
   /post platform:[X/LinkedIn/Instagram/Dribbble]
   ```

2. **Select or connect account**:
   - If accounts exist: Select from dropdown
   - If no accounts: Click "Connect Account" button
   - Follow OAuth instructions

3. **Fill in content modal**:
   - Platform-specific fields will appear
   - All required fields must be filled
   - Tags should be comma-separated (e.g., `design, ui, branding`)

4. **Submit and publish**:
   - Bot will post to the selected platform
   - You'll receive a confirmation with post URL
   - Channel will be notified of successful post

### Platform-Specific Field Guide

#### X (Twitter)
- **Tweet Content** (required): Your tweet text (max 280 chars)
- **Image URL** (optional): Direct URL to image

#### LinkedIn
- **Post Content** (required): Your post text (max 3,000 chars)
- **Article/Link URL** (optional): URL to share
- **Image URL** (optional): Direct URL to image

#### Instagram
- **Caption** (required): Post caption (max 2,200 chars)
- **Image/Video URL** (required): Publicly accessible media URL
- **Hashtags** (optional): Comma-separated tags

#### Dribbble
- **Shot Title** (required): Title for your shot (max 100 chars)
- **Description** (optional): Describe your work (max 1,000 chars)
- **Tags** (optional): Max 12 tags, comma-separated
- **Image URL** (required): Must be 400x300 or 800x600, max 8MB

### Tips for Success

1. **Image URLs**: Always use direct, publicly accessible URLs
2. **Tags**: Use comma separation without # symbol (e.g., `design, art, creative`)
3. **Testing**: Test with a single post before bulk posting
4. **Tokens**: Keep access tokens secure and refresh when needed
5. **Rate Limits**: Be aware of platform-specific posting limits

---

## API Requirements Summary

| Platform | Required Fields | Optional Fields | Media Requirements | Character Limit |
|----------|----------------|-----------------|-------------------|-----------------|
| **X** | Text | Image URL | JPG/PNG/GIF, 5MB max | 280 |
| **LinkedIn** | Text | Image URL, Article URL | Various formats | 3,000 |
| **Instagram** | Caption, Image URL | Hashtags | Publicly accessible URL | 2,200 |
| **Dribbble** | Title, Image URL | Description, Tags | 400x300 or 800x600, 8MB | Title: 100, Desc: 1,000 |

---

## Troubleshooting

### Common Issues

**"No accounts found"**
- Ensure you've added the account to Notion
- Check that Platform Accounts database ID is in main config
- Verify Server ID matches your Discord server

**"Failed to post"**
- Check access token is valid and not expired
- Verify all required fields are filled
- Ensure image URLs are publicly accessible
- Check platform-specific requirements (image size, etc.)

**"Account not found"**
- Refresh Notion cache
- Verify account exists in Platform Accounts database
- Check platform and server ID filters

### Token Refresh

Most OAuth tokens expire. To refresh:
1. Complete OAuth flow again for the platform
2. Update the Access Token in Notion for that account
3. Keep Refresh Token if provided by platform

---

## Security Best Practices

1. **Never share access tokens** in public channels
2. **Use Notion permissions** to restrict who can view tokens
3. **Rotate tokens regularly** for security
4. **Monitor API usage** to detect unauthorized access
5. **Use environment-specific tokens** for testing vs production

---

## Support

For issues or questions:
1. Check platform-specific API documentation
2. Verify Notion database configuration
3. Review bot logs for detailed error messages
4. Test OAuth flow manually to verify credentials
