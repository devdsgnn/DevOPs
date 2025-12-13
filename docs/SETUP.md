# Quick Setup Guide

## Step 1: Install Dependencies

Run this command in the terminal:
```bash
npm install
```

## Step 2: Create your .env file

Copy `.env.example` to `.env` and fill in your credentials:

```bash
# Notion Configuration
NOTION_API_KEY=your_notion_integration_token_here
NOTION_MAIN_DATABASE_ID=your_main_database_id_here

# Discord Configuration
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
```

### How to get these values:

**NOTION_API_KEY:**
1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Give it a name (e.g., "Discord Bot")
4. Copy the "Internal Integration Token"

**NOTION_MAIN_DATABASE_ID:**
1. Create a new database in Notion (see README.md for structure)
2. Open the database as a full page
3. Copy the ID from the URL: `notion.so/workspace/DATABASE_ID?v=...`

**DISCORD_BOT_TOKEN:**
1. Go to https://discord.com/developers/applications
2. Create a new application or select existing one
3. Go to "Bot" section
4. Click "Reset Token" and copy it

**DISCORD_CLIENT_ID:**
1. In the same Discord application
2. Go to "OAuth2" → "General"
3. Copy the "Client ID"

## Step 3: Set up Notion Databases

### Main Configuration Database

Create a database with these columns:
- **Type** (Select): Discord Token, Discord Client ID, Social Links Database ID
- **Value** (Text): The actual value
- **Server ID** (Text): For server-specific configs
- **Channel ID** (Text): For server-specific configs

Add these rows:
1. Type: "Discord Token" → Value: (leave empty, we use .env)
2. Type: "Discord Client ID" → Value: (leave empty, we use .env)
3. Type: "Social Links Database ID" → Value: (your social links DB ID)

### Social Links Database

Create another database with these columns:
- **Platform** (Select): X, Dribbble, YouTube, Framer, Instagram
- **Account URL** (URL)
- **Server ID** (Text)
- **Added By** (Text)
- **Added Date** (Date)

**IMPORTANT:** Share both databases with your Notion integration!

## Step 4: Deploy Commands

```bash
npm run deploy-commands
```

## Step 5: Start the Bot

```bash
npm start
```

## For Railway Deployment

1. Push code to GitHub
2. Connect Railway to your repo
3. Add environment variables in Railway dashboard
4. Deploy!

See README.md for detailed instructions.
