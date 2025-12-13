# 🚀 Deployment Checklist

Use this checklist to ensure everything is set up correctly before deploying your bot.

## ☐ Prerequisites

- [ ] Node.js v18+ installed
- [ ] npm installed
- [ ] Git installed (for Railway deployment)
- [ ] Discord account
- [ ] Notion account

---

## ☐ Discord Setup

- [ ] Created Discord application at https://discord.com/developers/applications
- [ ] Created bot user in the application
- [ ] Copied bot token
- [ ] Copied client ID
- [ ] Enabled necessary intents (if required)
- [ ] Generated invite URL with correct permissions:
  - [ ] `bot` scope
  - [ ] `applications.commands` scope
  - [ ] Send Messages permission
  - [ ] Embed Links permission
  - [ ] Use Slash Commands permission
- [ ] Invited bot to at least one test server

---

## ☐ Notion Setup

### Integration
- [ ] Created Notion integration at https://www.notion.so/my-integrations
- [ ] Copied integration token
- [ ] Named the integration appropriately

### Main Configuration Database
- [ ] Created database in Notion
- [ ] Added "Type" property (Select)
- [ ] Added "Value" property (Text)
- [ ] Added "Server ID" property (Text)
- [ ] Added "Channel ID" property (Text)
- [ ] Shared database with integration
- [ ] Copied database ID from URL
- [ ] Added sample configuration entries

### Social Links Database
- [ ] Created second database in Notion
- [ ] Added "Platform" property (Select with options: X, Dribbble, YouTube, Framer, Instagram)
- [ ] Added "Account URL" property (URL)
- [ ] Added "Server ID" property (Text)
- [ ] Added "Added By" property (Text)
- [ ] Added "Added Date" property (Date)
- [ ] Shared database with integration
- [ ] Copied database ID
- [ ] Added Social Links Database ID to Main Configuration Database

---

## ☐ Local Setup

- [ ] Ran `npm install`
- [ ] Created `.env` file (copied from `.env.example`)
- [ ] Added `NOTION_API_KEY` to `.env`
- [ ] Added `NOTION_MAIN_DATABASE_ID` to `.env`
- [ ] Added `DISCORD_BOT_TOKEN` to `.env`
- [ ] Added `DISCORD_CLIENT_ID` to `.env`
- [ ] Verified all environment variables are correct

---

## ☐ Command Deployment

- [ ] Ran `npm run deploy-commands`
- [ ] Saw success message
- [ ] Waited 5 minutes for Discord to update
- [ ] Verified commands appear in Discord (type `/` in a server)

---

## ☐ Local Testing

- [ ] Ran `npm start`
- [ ] Bot shows as online in Discord
- [ ] Tested `/add` command:
  - [ ] Modal appears
  - [ ] Can enter URLs
  - [ ] Success message appears
  - [ ] Data appears in Notion
- [ ] Tested `/links` command:
  - [ ] Links display correctly
  - [ ] Pagination works (if >10 links)
  - [ ] Platform filtering works
- [ ] Checked console for errors

---

## ☐ Railway Deployment (Optional)

### Repository Setup
- [ ] Initialized git repository (`git init`)
- [ ] Added all files (`git add .`)
- [ ] Made initial commit (`git commit -m "Initial commit"`)
- [ ] Created GitHub repository
- [ ] Pushed to GitHub

### Railway Setup
- [ ] Created Railway account at https://railway.app
- [ ] Created new project
- [ ] Connected GitHub repository
- [ ] Added environment variables:
  - [ ] `NOTION_API_KEY`
  - [ ] `NOTION_MAIN_DATABASE_ID`
  - [ ] `DISCORD_BOT_TOKEN`
  - [ ] `DISCORD_CLIENT_ID`
- [ ] Deployed project
- [ ] Checked deployment logs for errors
- [ ] Verified bot is online

### Post-Deployment Testing
- [ ] Bot appears online in Discord
- [ ] Tested `/add` command on Railway deployment
- [ ] Tested `/links` command on Railway deployment
- [ ] Verified data is being saved to Notion
- [ ] Checked Railway logs for any errors

---

## ☐ Multi-Server Testing

- [ ] Invited bot to second test server
- [ ] Ran `/add` in second server
- [ ] Verified links are server-specific
- [ ] Ran `/links` in both servers
- [ ] Confirmed each server only sees its own links

---

## ☐ Documentation

- [ ] Read README.md
- [ ] Read SETUP.md
- [ ] Read NOTION_SETUP.md
- [ ] Read PROJECT_SUMMARY.md
- [ ] Bookmarked important links:
  - [ ] Discord Developer Portal
  - [ ] Notion Integrations
  - [ ] Railway Dashboard (if using)

---

## ☐ Final Checks

- [ ] Bot has a profile picture (optional but recommended)
- [ ] Bot has a description (optional)
- [ ] All sensitive data is in `.env` (not hardcoded)
- [ ] `.env` is in `.gitignore`
- [ ] No errors in console/logs
- [ ] Bot responds to commands within 3 seconds
- [ ] Notion databases are properly organized

---

## 🎉 Deployment Complete!

If all items are checked, your bot is ready for production use!

### Quick Reference Commands:

**Local Development:**
```bash
npm start          # Start the bot
npm run dev        # Start with auto-reload
npm run deploy-commands  # Deploy slash commands
```

**Git Commands:**
```bash
git add .
git commit -m "Your message"
git push
```

### Important URLs:

- Discord Developer Portal: https://discord.com/developers/applications
- Notion Integrations: https://www.notion.so/my-integrations
- Railway Dashboard: https://railway.app/dashboard
- Discord.js Docs: https://discord.js.org
- Notion API Docs: https://developers.notion.com

---

## 🆘 Troubleshooting

If something isn't working, check:

1. **Console/Railway logs** for error messages
2. **Environment variables** are set correctly
3. **Notion databases** are shared with integration
4. **Discord bot** has correct permissions
5. **Commands** have been deployed (`npm run deploy-commands`)

Still stuck? Review the README.md troubleshooting section!

---

**Last Updated:** Check this list every time you deploy to a new environment!
