# ⚡ Quick Start Guide

Get your Discord bot running in 5 minutes!

## 📋 What You Need

Before starting, have these ready:
- Discord bot token
- Discord client ID
- Notion integration token
- Notion main database ID

Don't have these? See [SETUP.md](SETUP.md) for detailed instructions.

---

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (30 seconds)
```bash
npm install
```
✅ Already done!

### Step 2: Configure Environment (2 minutes)

Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

Edit `.env` and fill in your credentials:
```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_MAIN_DATABASE_ID=xxxxxxxxxxxxx
DISCORD_BOT_TOKEN=xxxxxxxxxxxxx
DISCORD_CLIENT_ID=xxxxxxxxxxxxx
```

### Step 3: Set Up Notion Databases (2 minutes)

1. **Create Main Config Database** in Notion with these columns:
   - Type (Select)
   - Value (Text)
   - Server ID (Text)
   - Channel ID (Text)

2. **Create Social Links Database** with these columns:
   - Platform (Select: X, Dribbble, YouTube, Framer, Instagram)
   - Account URL (URL)
   - Server ID (Text)
   - Added By (Text)
   - Added Date (Date)

3. **Share both databases** with your Notion integration

4. **Add Social Links DB ID** to your Main Config Database:
   - Type: "Social Links Database ID"
   - Value: [paste the social links database ID]

Need help? See [NOTION_SETUP.md](NOTION_SETUP.md)

### Step 4: Deploy Commands (30 seconds)
```bash
npm run deploy-commands
```

Wait for success message!

### Step 5: Start the Bot (10 seconds)
```bash
npm start
```

You should see:
```
✅ Bot is ready! Logged in as YourBot#1234
📊 Serving 1 server(s)
```

---

## ✅ Test It Out

### Test /add Command

1. Go to your Discord server
2. Type `/add`
3. Select a platform (e.g., "X")
4. Enter a URL in the modal
5. Submit!

You should see: ✅ Successfully added 1 X link(s)!

### Test /links Command

1. Type `/links`
2. You should see your link displayed
3. Try `/links platform:X` to filter

---

## 🎯 Next Steps

### For Local Development
- Use `npm run dev` for auto-reload
- Check console for errors
- Test on multiple servers

### For Production (Railway)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repository
   - Add environment variables (same as .env)
   - Deploy!

3. **Verify:**
   - Check Railway logs
   - Test commands in Discord

---

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup guide
- **NOTION_SETUP.md** - Notion database setup
- **ARCHITECTURE.md** - How it works
- **DEPLOYMENT_CHECKLIST.md** - Pre-deployment checklist
- **PROJECT_SUMMARY.md** - Project overview

---

## 🆘 Troubleshooting

### Commands not showing?
```bash
npm run deploy-commands
```
Wait 5 minutes, then restart Discord.

### "API token is invalid"?
- Check `NOTION_API_KEY` in `.env`
- Verify databases are shared with integration

### Bot offline?
- Check console for errors
- Verify `DISCORD_BOT_TOKEN` is correct
- Make sure bot is invited to server

### Links not saving?
- Check Social Links Database ID in Main Config
- Verify all database properties exist
- Check console for Notion errors

---

## 🎉 You're Done!

Your bot is now running and ready to manage social media links across multiple Discord servers!

### Quick Commands Reference:

**Development:**
```bash
npm start              # Start bot
npm run dev            # Start with auto-reload
npm run deploy-commands # Deploy slash commands
```

**Git:**
```bash
git add .
git commit -m "message"
git push
```

### Important Links:

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Notion Integrations](https://www.notion.so/my-integrations)
- [Railway Dashboard](https://railway.app/dashboard)

---

**Need more help?** Check the other documentation files or review the code comments!
