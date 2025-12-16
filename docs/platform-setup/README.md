# Platform API Setup Guides

Complete guides for setting up API access for all supported social media platforms.

---

## 📚 Available Platforms

| Platform | Guide | Difficulty | Setup Time | Token Expiry |
|----------|-------|------------|------------|--------------|
| **Twitter/X** | [Setup Guide](./TWITTER_X_SETUP.md) | ⭐⭐ Medium | 15-20 min | Never (OAuth 1.0a) |
| **LinkedIn** | [Setup Guide](./LINKEDIN_SETUP.md) | ⭐⭐⭐ Hard | 20-30 min | 60 days |
| **Instagram** | [Setup Guide](./INSTAGRAM_SETUP.md) | ⭐⭐⭐⭐ Very Hard | 30-45 min | 60 days |
| **Dribbble** | [Setup Guide](./DRIBBBLE_SETUP.md) | ⭐⭐ Medium | 15-20 min | Never |

---

## 🚀 Quick Start

### 1. Choose Your Platform

Click on the platform guide above to get started.

### 2. Complete the Setup

Each guide includes:
- ✅ Step-by-step instructions
- ✅ Screenshots and examples
- ✅ API credentials needed
- ✅ Troubleshooting tips
- ✅ Rate limits and best practices

### 3. Add to Notion

After getting your API credentials, add them to your **Platform Accounts** database in Notion.

### 4. Test in Discord

Run `/post` in Discord and select your platform to test!

---

## 📋 Platform Comparison

### Twitter/X
**Best for:** Quick updates, news, engagement  
**Pros:** Easy setup, no token expiry, high rate limits  
**Cons:** Requires 4 OAuth tokens, character limit (280)  
**Image required:** No  
**Video support:** Yes (via API v2)

### LinkedIn
**Best for:** Professional content, B2B, thought leadership  
**Pros:** Great for business, professional audience  
**Cons:** Tokens expire (60 days), requires company page for app  
**Image required:** No  
**Video support:** No (via API)

### Instagram
**Best for:** Visual content, brand awareness, engagement  
**Pros:** High engagement, visual platform  
**Cons:** Complex setup, requires Business account, image required  
**Image required:** Yes  
**Video support:** No (via Content Publishing API)

### Dribbble
**Best for:** Design portfolios, creative work  
**Pros:** Simple setup, design-focused audience  
**Cons:** Limited audience, Pro account recommended  
**Image required:** Yes  
**Video support:** Yes (Pro only)

---

## 🔑 Required Credentials by Platform

### Twitter/X
- API Key (Consumer Key)
- API Secret (Consumer Secret)
- Access Token
- Access Token Secret

### LinkedIn
- Access Token
- Refresh Token (optional but recommended)
- Platform User ID (Person ID)

### Instagram
- Access Token (long-lived, 60 days)
- Platform User ID (Instagram Business Account ID)

### Dribbble
- Access Token

---

## 📝 Notion Database Structure

Your **Platform Accounts** database should have these fields:

| Field Name | Type | Required | Used By |
|------------|------|----------|---------|
| **Name** | Title | ✅ All | All platforms |
| **Platform** | Select | ✅ All | All platforms |
| **Username** | Text | ⭕ Optional | All platforms |
| **API Key** | Text | ✅ Twitter | Twitter/X only |
| **API Secret** | Text | ✅ Twitter | Twitter/X only |
| **Access Token** | Text | ✅ All | All platforms |
| **Access Token Secret** | Text | ✅ Twitter | Twitter/X only |
| **Refresh Token** | Text | ⭕ Optional | LinkedIn |
| **Platform User ID** | Text | ✅ LinkedIn, Instagram | LinkedIn, Instagram |

---

## 🎯 Setup Priority Recommendations

### Start with Twitter/X
- Easiest to set up
- No token expiry
- Great for testing the bot

### Then LinkedIn
- Professional platform
- Good for business content
- Tokens expire but can be refreshed

### Then Dribbble (if applicable)
- Simple setup
- Great for designers
- No token expiry

### Finally Instagram (if needed)
- Most complex setup
- Requires Business account
- Great for visual content

---

## ⚠️ Common Issues Across Platforms

### "Invalid access token"
**Causes:**
- Token expired (LinkedIn, Instagram)
- Token revoked by user
- Wrong token type (e.g., Bearer token for Twitter)

**Solutions:**
- Refresh token (if available)
- Re-run OAuth flow
- Verify token type matches platform requirements

### "Insufficient permissions"
**Causes:**
- Missing required scopes
- App not approved for required products
- Account type restrictions (e.g., Instagram Business)

**Solutions:**
- Request required scopes during OAuth
- Apply for API products in developer portal
- Convert account to required type

### "Rate limit exceeded"
**Causes:**
- Too many API calls
- Too many posts in short time
- Platform-specific limits

**Solutions:**
- Wait for rate limit reset
- Reduce posting frequency
- Upgrade to higher tier (if available)

---

## 🔒 Security Best Practices

### For All Platforms

1. **Never commit tokens to Git**
   - Use `.env` files (add to `.gitignore`)
   - Store in Notion (private database)
   - Use environment variables

2. **Rotate tokens regularly**
   - Refresh tokens before expiry
   - Regenerate if compromised
   - Keep refresh tokens secure

3. **Limit permissions**
   - Only request required scopes
   - Don't request unnecessary permissions
   - Review app permissions regularly

4. **Monitor usage**
   - Track API calls
   - Watch for unusual activity
   - Set up alerts for rate limits

5. **Use HTTPS**
   - All OAuth redirects must use HTTPS in production
   - Localhost HTTP is OK for development

---

## 📊 Rate Limits Summary

| Platform | Posts/Day | API Calls/Hour | Image Uploads/Day |
|----------|-----------|----------------|-------------------|
| **Twitter/X** | Unlimited* | 500,000/month | 50 |
| **LinkedIn** | 100 | ~100/day | 100 |
| **Instagram** | 25 | 200 | 25 |
| **Dribbble** | Unlimited | 60/minute | Unlimited |

*Subject to Twitter's posting limits and spam detection

---

## 🔄 Token Refresh Schedule

| Platform | Access Token | Refresh Token | Recommendation |
|----------|--------------|---------------|----------------|
| **Twitter/X** | Never expires | N/A | No action needed |
| **LinkedIn** | 60 days | 365 days | Refresh every 50 days |
| **Instagram** | 60 days | N/A | Regenerate every 50 days |
| **Dribbble** | Never expires | N/A | No action needed |

---

## 🆘 Getting Help

### Platform-Specific Issues
- Check the troubleshooting section in each platform's guide
- Review platform's API documentation
- Check platform status pages

### Bot Issues
- Check bot logs for error messages
- Verify credentials in Notion
- Restart bot after updating credentials

### Still Stuck?
- Review the [main documentation](../README.md)
- Check [Discord bot setup](../QUICKSTART.md)
- Review [Notion setup](../NOTION_SETUP.md)

---

## 📚 Additional Resources

### Official Documentation
- [Twitter API Docs](https://developer.twitter.com/en/docs)
- [LinkedIn API Docs](https://learn.microsoft.com/en-us/linkedin/)
- [Instagram API Docs](https://developers.facebook.com/docs/instagram-api)
- [Dribbble API Docs](https://developer.dribbble.com/v2/)

### OAuth Resources
- [OAuth 1.0a Spec](https://oauth.net/core/1.0a/)
- [OAuth 2.0 Spec](https://oauth.net/2/)
- [Understanding OAuth](https://www.oauth.com/)

### Testing Tools
- [Postman](https://www.postman.com/) - API testing
- [curl](https://curl.se/) - Command-line API testing
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/) - Facebook/Instagram
- [LinkedIn API Console](https://www.linkedin.com/developers/tools/api-console)

---

## ✅ Setup Checklist

Use this checklist to track your platform setup progress:

### Twitter/X
- [ ] Created Twitter Developer account
- [ ] Created app in Developer Portal
- [ ] Set permissions to "Read and Write"
- [ ] Generated all 4 OAuth tokens
- [ ] Added credentials to Notion
- [ ] Tested posting with `/post`

### LinkedIn
- [ ] Created LinkedIn Developer account
- [ ] Created app with Company Page
- [ ] Requested "Share on LinkedIn" product
- [ ] Completed OAuth flow
- [ ] Got Person ID from `/v2/userinfo`
- [ ] Added credentials to Notion
- [ ] Tested posting with `/post`

### Instagram
- [ ] Converted account to Business/Creator
- [ ] Connected to Facebook Page
- [ ] Created Facebook app
- [ ] Added Instagram product
- [ ] Generated long-lived access token
- [ ] Got Instagram Business Account ID
- [ ] Added credentials to Notion
- [ ] Tested posting with `/post`

### Dribbble
- [ ] Created Dribbble account
- [ ] Registered application
- [ ] Completed OAuth flow with `upload` scope
- [ ] Got access token
- [ ] Added credentials to Notion
- [ ] Tested posting with `/post`

---

## 🎉 Next Steps

Once you've set up your platforms:

1. **Test posting** - Use `/post` to create test posts
2. **Monitor performance** - Check analytics on each platform
3. **Optimize content** - Tailor content for each platform
4. **Automate workflows** - Set up posting schedules
5. **Engage with audience** - Respond to comments and messages

---

## 💡 Pro Tips

### Cross-Platform Strategy
- **Tailor content** for each platform's audience
- **Adjust tone** (professional for LinkedIn, casual for Twitter)
- **Optimize images** for each platform's dimensions
- **Use platform-specific features** (hashtags, mentions, etc.)

### Content Best Practices
- **Twitter**: Short, punchy, engaging
- **LinkedIn**: Professional, thought leadership, long-form
- **Instagram**: Visual storytelling, behind-the-scenes
- **Dribbble**: High-quality design work, process shots

### Timing
- **Twitter**: Multiple times per day
- **LinkedIn**: 1-2 times per day (business hours)
- **Instagram**: 1-2 times per day (peak engagement times)
- **Dribbble**: 1-2 times per week (quality over quantity)

---

## 🔧 Maintenance

### Weekly
- [ ] Check for failed posts
- [ ] Review error logs
- [ ] Monitor rate limits

### Monthly
- [ ] Review token expiry dates
- [ ] Refresh LinkedIn/Instagram tokens if needed
- [ ] Check API usage statistics
- [ ] Review platform analytics

### Quarterly
- [ ] Audit app permissions
- [ ] Review security settings
- [ ] Update documentation
- [ ] Test all platforms

---

**Ready to get started?** Pick a platform above and follow the setup guide! 🚀
