# 🏗️ Bot Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Discord Servers                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Server 1 │  │ Server 2 │  │ Server 3 │  │ Server N │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      Discord Bot (Node.js)          │
        │  ┌───────────────────────────────┐  │
        │  │       Event Handlers          │  │
        │  │  • ready.js                   │  │
        │  │  • interactionCreate.js       │  │
        │  └───────────────────────────────┘  │
        │  ┌───────────────────────────────┐  │
        │  │       Slash Commands          │  │
        │  │  • /add (with modal)          │  │
        │  │  • /links (with pagination)   │  │
        │  └───────────────────────────────┘  │
        │  ┌───────────────────────────────┐  │
        │  │       Notion Manager          │  │
        │  │  • getConfig()                │  │
        │  │  • addSocialLink()            │  │
        │  │  • getSocialLinks()           │  │
        │  └───────────────────────────────┘  │
        └─────────────┬───────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────────────┐
        │         Notion Workspace            │
        │  ┌───────────────────────────────┐  │
        │  │  Main Configuration Database  │  │
        │  │  • Discord Token              │  │
        │  │  • Discord Client ID          │  │
        │  │  • Social Links DB ID         │  │
        │  │  • Server Configs             │  │
        │  └───────────────────────────────┘  │
        │  ┌───────────────────────────────┐  │
        │  │   Social Links Database       │  │
        │  │  • Platform                   │  │
        │  │  • Account URL                │  │
        │  │  • Server ID                  │  │
        │  │  • Added By                   │  │
        │  │  • Added Date                 │  │
        │  └───────────────────────────────┘  │
        └─────────────────────────────────────┘
```

---

## Data Flow

### 1. User Adds a Link (`/add`)

```
User types /add
     │
     ▼
Discord shows platform dropdown
     │
     ▼
User selects platform (e.g., "X")
     │
     ▼
Bot shows modal popup
     │
     ▼
User enters URLs (one per line)
     │
     ▼
Bot receives modal submission
     │
     ▼
Bot splits URLs by newline
     │
     ▼
For each URL:
  ├─ Get Social Links DB ID from Notion
  ├─ Create new page in Notion
  ├─ Set Platform, URL, Server ID, User ID, Date
  └─ Save to Notion
     │
     ▼
Bot sends success message to user
```

### 2. User Views Links (`/links`)

```
User types /links [platform]
     │
     ▼
Bot defers reply (shows "thinking...")
     │
     ▼
Bot queries Notion:
  ├─ Filter by platform (if specified)
  ├─ Filter by server ID
  ├─ Sort by date (newest first)
  └─ Get page 0 (first 10 results)
     │
     ▼
Bot creates embed:
  ├─ Group links by platform
  ├─ Add platform emojis
  ├─ Format as clickable links
  └─ Add pagination buttons
     │
     ▼
Bot sends embed to Discord
     │
     ▼
User clicks "Next" or "Previous"
     │
     ▼
Bot updates embed with new page
```

### 3. Configuration Loading

```
Bot starts
     │
     ▼
Load environment variables (.env)
     │
     ▼
Initialize Notion client
     │
     ▼
Query Main Configuration Database
     │
     ▼
Parse configuration:
  ├─ Discord Token (from .env)
  ├─ Discord Client ID (from .env)
  ├─ Social Links DB ID (from Notion)
  └─ Server configs (from Notion)
     │
     ▼
Cache config for 5 minutes
     │
     ▼
Bot ready to handle commands
```

---

## Component Interactions

### index.js (Main Entry Point)
```
Responsibilities:
• Load environment variables
• Initialize Discord client
• Load commands from /commands folder
• Load events from /events folder
• Handle errors
• Login to Discord
```

### notionManager.js (Notion Integration)
```
Responsibilities:
• Connect to Notion API
• Fetch configuration (with caching)
• Add social links to database
• Query social links (with pagination)
• Handle Notion errors
```

### commands/add.js (Add Command)
```
Responsibilities:
• Define /add slash command
• Show platform dropdown
• Create and display modal
• (Actual submission handled by interactionCreate.js)
```

### commands/links.js (Links Command)
```
Responsibilities:
• Define /links slash command
• Fetch links from Notion
• Create paginated embed
• Add navigation buttons
```

### events/interactionCreate.js (Interaction Handler)
```
Responsibilities:
• Route slash commands to handlers
• Handle modal submissions
• Process button clicks (pagination)
• Add links to Notion
• Update embeds on pagination
```

### events/ready.js (Ready Event)
```
Responsibilities:
• Log bot startup
• Set bot status/presence
• Display server count
```

---

## Environment Variables Flow

```
.env file
   │
   ├─ NOTION_API_KEY ──────────┐
   ├─ NOTION_MAIN_DATABASE_ID ─┤
   ├─ DISCORD_BOT_TOKEN ────────┤
   └─ DISCORD_CLIENT_ID ────────┤
                                │
                                ▼
                         process.env
                                │
                                ├─ Used by index.js (Discord login)
                                ├─ Used by notionManager.js (Notion API)
                                └─ Used by deploy-commands.js (Command registration)
```

---

## Deployment Architecture

### Local Development
```
Your Computer
   │
   ├─ Node.js runtime
   ├─ .env file (local secrets)
   └─ Bot process
        │
        ├─ Connects to Discord API
        └─ Connects to Notion API
```

### Railway Production
```
Railway Platform
   │
   ├─ Environment Variables (Railway dashboard)
   ├─ Node.js runtime (auto-detected)
   └─ Bot process (always running)
        │
        ├─ Connects to Discord API
        └─ Connects to Notion API
        │
        └─ Auto-restart on failure
```

---

## Security Model

```
Sensitive Data:
   │
   ├─ Discord Bot Token ──────┐
   ├─ Discord Client ID ──────┤
   ├─ Notion API Key ─────────┤
   └─ Notion Database IDs ────┤
                              │
                              ▼
                    Environment Variables
                              │
                              ├─ .env file (local, gitignored)
                              └─ Railway variables (production)
                              │
                              ▼
                    Never committed to Git
                    Never exposed in code
                    Never sent to users
```

---

## Caching Strategy

```
First Request:
   User → Bot → Notion API → Database
                     │
                     ▼
                Cache result
                (5 minutes)

Subsequent Requests (within 5 min):
   User → Bot → Cache → Response
                (no Notion API call)

After 5 Minutes:
   Cache expires → Next request fetches fresh data
```

---

## Error Handling Flow

```
Error Occurs
   │
   ├─ Discord API Error
   │    └─ Log to console
   │    └─ Send user-friendly message
   │
   ├─ Notion API Error
   │    └─ Log to console
   │    └─ Send "Failed to fetch" message
   │
   └─ Unhandled Error
        └─ Log to console
        └─ Process exits (Railway restarts)
```

---

## Multi-Server Isolation

```
Server A (ID: 123)          Server B (ID: 456)
     │                           │
     ├─ /add command             ├─ /add command
     │   └─ Saves with           │   └─ Saves with
     │       Server ID: 123      │       Server ID: 456
     │                           │
     ├─ /links command           ├─ /links command
     │   └─ Filters by           │   └─ Filters by
     │       Server ID: 123      │       Server ID: 456
     │                           │
     ▼                           ▼
   Only sees                  Only sees
   Server A links             Server B links
```

---

This architecture ensures:
✅ Scalability (works on unlimited servers)
✅ Security (tokens in environment variables)
✅ Performance (5-minute caching)
✅ Reliability (auto-restart on Railway)
✅ Maintainability (clean separation of concerns)
