# Platform API Quick Reference

Quick reference for API credentials, endpoints, and common operations for all supported platforms.

---

## 🔑 Credentials Quick Reference

### Twitter/X
```
API Key:              xvz1evFS4wEEPTGEFPHBog
API Secret:           L8qq9PZyRg6ieKGEKhZolGC0vJWLw8iEJ88DRdyOg
Access Token:         370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb
Access Token Secret:  LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE
```

### LinkedIn
```
Access Token:    AQV8...
Refresh Token:   AQX9...
Person ID:       abc123xyz
```

### Instagram
```
Access Token:         EAABsb...
IG Business Account:  17841405793187218
```

### Dribbble
```
Access Token:    abc123...
```

---

## 📡 API Endpoints

### Twitter/X

**Upload Media:**
```
POST https://upload.twitter.com/1.1/media/upload.json
```

**Create Tweet:**
```
POST https://api.twitter.com/2/tweets
```

### LinkedIn

**Get User Info:**
```
GET https://api.linkedin.com/v2/userinfo
```

**Initialize Image Upload:**
```
POST https://api.linkedin.com/rest/images?action=initializeUpload
```

**Create Post:**
```
POST https://api.linkedin.com/rest/posts
```

### Instagram

**Get Pages:**
```
GET https://graph.facebook.com/v18.0/me/accounts
```

**Create Media Container:**
```
POST https://graph.facebook.com/v18.0/{IG_USER_ID}/media
```

**Publish Media:**
```
POST https://graph.facebook.com/v18.0/{IG_USER_ID}/media_publish
```

### Dribbble

**Get User:**
```
GET https://api.dribbble.com/v2/user
```

**Upload Shot:**
```
POST https://api.dribbble.com/v2/shots
```

---

## 🔐 OAuth URLs

### Twitter/X
```
Authorization: N/A (uses OAuth 1.0a)
Token Exchange: N/A (uses OAuth 1.0a)
```

### LinkedIn
```
Authorization:
https://www.linkedin.com/oauth/v2/authorization?
  response_type=code&
  client_id={CLIENT_ID}&
  redirect_uri={REDIRECT_URI}&
  scope=profile%20email%20w_member_social%20openid

Token Exchange:
POST https://www.linkedin.com/oauth/v2/accessToken
```

### Instagram
```
Authorization:
https://www.facebook.com/v18.0/dialog/oauth?
  client_id={APP_ID}&
  redirect_uri={REDIRECT_URI}&
  scope=instagram_basic,instagram_content_publish,pages_read_engagement

Token Exchange:
GET https://graph.facebook.com/v18.0/oauth/access_token?
  client_id={APP_ID}&
  client_secret={APP_SECRET}&
  redirect_uri={REDIRECT_URI}&
  code={CODE}
```

### Dribbble
```
Authorization:
https://dribbble.com/oauth/authorize?
  client_id={CLIENT_ID}&
  redirect_uri={REDIRECT_URI}&
  scope=upload

Token Exchange:
POST https://dribbble.com/oauth/token
```

---

## 📊 Rate Limits

| Platform | Posts/Day | API Calls | Image Uploads |
|----------|-----------|-----------|---------------|
| Twitter/X | Unlimited* | 500k/month | 50/day |
| LinkedIn | 100 | ~100/day | 100/day |
| Instagram | 25 | 200/hour | 25/day |
| Dribbble | Unlimited | 60/min | Unlimited |

---

## 🔄 Token Refresh

### LinkedIn
```bash
curl -X POST "https://www.linkedin.com/oauth/v2/accessToken" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "refresh_token={REFRESH_TOKEN}" \
  -d "client_id={CLIENT_ID}" \
  -d "client_secret={CLIENT_SECRET}"
```

### Instagram (Long-Lived Token)
```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id={APP_ID}&
  client_secret={APP_SECRET}&
  fb_exchange_token={SHORT_LIVED_TOKEN}"
```

---

## 📝 Request Examples

### Twitter/X - Create Tweet with Image

```javascript
// 1. Upload media
const mediaResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
  method: 'POST',
  headers: {
    'Authorization': oauth1Header, // OAuth 1.0a signature
    'Content-Type': 'multipart/form-data'
  },
  body: formData
});

const { media_id_string } = await mediaResponse.json();

// 2. Create tweet
const tweetResponse = await fetch('https://api.twitter.com/2/tweets', {
  method: 'POST',
  headers: {
    'Authorization': oauth1Header,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello Twitter!',
    media: { media_ids: [media_id_string] }
  })
});
```

### LinkedIn - Create Post with Image

```javascript
// 1. Initialize upload
const initResponse = await fetch('https://api.linkedin.com/rest/images?action=initializeUpload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202412'
  },
  body: JSON.stringify({
    initializeUploadRequest: {
      owner: `urn:li:person:${personId}`
    }
  })
});

const { value: { uploadUrl, image } } = await initResponse.json();

// 2. Upload image
await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/octet-stream' },
  body: imageBuffer
});

// 3. Create post
await fetch('https://api.linkedin.com/rest/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
    'LinkedIn-Version': '202412'
  },
  body: JSON.stringify({
    author: `urn:li:person:${personId}`,
    lifecycleState: 'PUBLISHED',
    visibility: 'PUBLIC',
    commentary: 'Hello LinkedIn!',
    content: {
      media: { id: image }
    }
  })
});
```

### Instagram - Create Post with Image

```javascript
// 1. Create media container
const containerResponse = await fetch(
  `https://graph.facebook.com/v18.0/${igUserId}/media`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: 'https://example.com/image.jpg',
      caption: 'Hello Instagram!',
      access_token: accessToken
    })
  }
);

const { id: creationId } = await containerResponse.json();

// 2. Publish media
const publishResponse = await fetch(
  `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken
    })
  }
);
```

### Dribbble - Upload Shot

```javascript
const response = await fetch('https://api.dribbble.com/v2/shots', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Design',
    description: 'A beautiful design',
    image: base64Image,
    tags: ['design', 'ui', 'web']
  })
});
```

---

## 🎨 Platform Colors & Emojis

| Platform | Color | Hex | Emoji |
|----------|-------|-----|-------|
| Twitter/X | Twitter Blue | `#1DA1F2` | 𝕏 |
| LinkedIn | LinkedIn Blue | `#0A66C2` | 💼 |
| Instagram | Instagram Pink | `#E4405F` | 📸 |
| Dribbble | Dribbble Pink | `#EA4C89` | 🏀 |

---

## ⚠️ Common Error Codes

### Twitter/X
- `401` - Authentication failed (check OAuth signature)
- `403` - Read-only app (need Read and Write permissions)
- `429` - Rate limit exceeded
- `400` - Invalid request (check parameters)

### LinkedIn
- `401` - Invalid access token
- `403` - Insufficient permissions
- `429` - Rate limit exceeded
- `400` - Invalid request body

### Instagram
- `190` - Invalid access token
- `100` - Invalid parameter
- `368` - Temporarily blocked (rate limit)
- `200` - Permission denied

### Dribbble
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (missing scope)
- `429` - Too many requests
- `422` - Validation failed

---

## 🔧 Testing Commands

### Test Twitter/X Token
```bash
curl -X GET "https://api.twitter.com/2/users/me" \
  -H "Authorization: Bearer {BEARER_TOKEN}"
```

### Test LinkedIn Token
```bash
curl -X GET "https://api.linkedin.com/v2/userinfo" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

### Test Instagram Token
```bash
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token={ACCESS_TOKEN}"
```

### Test Dribbble Token
```bash
curl -X GET "https://api.dribbble.com/v2/user" \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

---

## 📋 Notion Field Mapping

| Notion Field | Twitter/X | LinkedIn | Instagram | Dribbble |
|--------------|-----------|----------|-----------|----------|
| Name | ✅ | ✅ | ✅ | ✅ |
| Platform | X | LinkedIn | Instagram | Dribbble |
| Username | @handle | username | @handle | @handle |
| API Key | ✅ | ❌ | ❌ | ❌ |
| API Secret | ✅ | ❌ | ❌ | ❌ |
| Access Token | ✅ | ✅ | ✅ | ✅ |
| Access Token Secret | ✅ | ❌ | ❌ | ❌ |
| Refresh Token | ❌ | ✅ | ❌ | ❌ |
| Platform User ID | ❌ | ✅ | ✅ | ❌ |

---

## 🚀 Quick Setup Commands

### Create .env file
```bash
# Twitter/X
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret

# LinkedIn
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret

# Instagram
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret

# Dribbble
DRIBBBLE_CLIENT_ID=your_client_id
DRIBBBLE_CLIENT_SECRET=your_client_secret
```

---

## 📚 More Resources

- [Full Setup Guides](./README.md)
- [Twitter/X Setup](./TWITTER_X_SETUP.md)
- [LinkedIn Setup](./LINKEDIN_SETUP.md)
- [Instagram Setup](./INSTAGRAM_SETUP.md)
- [Dribbble Setup](./DRIBBBLE_SETUP.md)

---

**Need help?** Check the full setup guides linked above! 🚀
