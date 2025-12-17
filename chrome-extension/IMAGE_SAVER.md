# 📌 Pinterest-Style Image Saver

## ✨ New Feature Added!

You can now save images directly from any website with a Pinterest-style "Save" button!

---

## 🎯 How It Works

1. **Hover over any image** on any website
2. A **"📌 Save" button** appears in the top-left corner
3. **Click it** to save the image to Discord
4. **Done!** The image is posted to your Discord channel

---

## 🔥 Special Features

### **Social Media Detection**

When you save images from social media, it automatically includes the post link:

- **X/Twitter** → Saves the tweet link
- **Instagram** → Saves the post link  
- **Pinterest** → Saves the pin link

The Discord embed will show:
- Image
- Page title (linked to post URL)
- Footer showing source (e.g., "📌 Saved from X/Twitter")

### **Regular Websites**

For other websites, it saves:
- Image
- Page title (linked to page URL)
- Footer: "📌 Saved Image"

---

## 🚀 How to Use

### **Step 1: Reload Extension**

Since we added new features, reload the extension:

1. Go to `chrome://extensions/`
2. Find "Site Inspiration Saver"
3. Click **Remove**
4. Click **Load unpacked**
5. Select `C:\Ops\chrome-extension`

### **Step 2: Make Sure Backend is Running**

```bash
npm run extension
```

### **Step 3: Try It!**

1. Go to **X/Twitter** or any website with images
2. **Hover over an image** (must be at least 150x150px)
3. **Click "📌 Save"**
4. Check Discord! 🎉

---

## 💡 Examples

### **Saving from X/Twitter:**
- Hover over tweet image
- Click "📌 Save"
- Discord shows: Image + Tweet link + "Saved from X/Twitter"

### **Saving from Instagram:**
- Hover over post image
- Click "📌 Save"  
- Discord shows: Image + Post link + "Saved from Instagram"

### **Saving from any website:**
- Hover over any image
- Click "📌 Save"
- Discord shows: Image + Page link + "Saved Image"

---

## 🎨 Features

✅ **Pinterest-style hover button** - Appears on image hover  
✅ **Smart post detection** - Finds tweet/post links automatically  
✅ **Beautiful Discord embeds** - Clean, professional look  
✅ **Loading states** - Shows "Saving..." then "Saved!"  
✅ **Works everywhere** - Any website with images  
✅ **Minimum size filter** - Only shows on images 150x150px+  

---

## 📸 Two Ways to Save

### **1. Screenshot Mode** (Original)
- Click extension icon
- Click "Capture & Save"
- Saves full viewport screenshot + metadata to Notion

### **2. Image Save Mode** (New!)
- Hover over any image
- Click "📌 Save"
- Saves just the image to Discord (with post link if social media)

---

## ⚠️ Notes

- Button only appears on images **150x150px or larger**
- Works on **all websites** (Twitter, Instagram, Pinterest, etc.)
- Automatically detects social media post URLs
- Saves to the same Discord channel as screenshots

---

Enjoy your new Pinterest-style image saver! 📌✨
