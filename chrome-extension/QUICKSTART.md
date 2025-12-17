# 🚀 QUICK START - 3 Steps!

## Step 1: Configure Channel ID (10 seconds)

Add this to your **Notion main database**:

| Name | Value |
|------|-------|
| `Publish Channel ID` | `your_discord_channel_id` |

**Get channel ID:** Discord → Right-click channel → "Copy Channel ID"

---

## Step 2: Start the Backend (10 seconds)

Open a terminal and run:

```bash
npm run extension
```

You'll see:
```
✅ Discord bot connected for extension
🚀 Extension backend running on http://localhost:3001
📸 Ready to receive screenshot requests
```

**Keep this terminal running!**

> **Note:** If you also want the `/site` Discord command, open a **second terminal** and run `npm start`

---

## Step 3: Load Extension in Chrome (30 seconds)

1. Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top-right)
3. Click **Load unpacked**
4. Select: `C:\Ops\chrome-extension`

✅ Done! You'll see the 📸 icon.

---

## ✨ Use It!

1. Go to any website (try https://dribbble.com)
2. Click 📸 extension icon
3. Click **"Capture & Save"**
4. Check Discord and Notion! 🎉

---

## 💡 What You Need Running

### **Option 1: Extension Only**
```bash
npm run extension
```
- ✅ Chrome extension works
- ❌ `/site` Discord command won't work

### **Option 2: Both (2 terminals)**

**Terminal 1:**
```bash
npm start
```

**Terminal 2:**
```bash
npm run extension
```
- ✅ Chrome extension works
- ✅ `/site` Discord command works

---

## ⚠️ Troubleshooting

**"Backend not running!" in extension?**
- Make sure `npm run extension` is running
- Check that terminal for errors

**"No channel ID configured!"?**
- Add "Publish Channel ID" to Notion main database

---

That's it! Just `npm run extension` and load the Chrome extension! 🚀
