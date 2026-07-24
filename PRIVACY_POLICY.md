# DabbleBot Privacy Policy

**Last updated: July 2026**

This Privacy Policy describes how DabbleBot ("the bot", "we", "us") collects, uses, stores, and processes data when added to a Discord server. By adding DabbleBot to your server, you acknowledge and consent to the practices described below.

---

## 1. Data We Collect

### 1.1 Server Members Intent Data
When a member joins, leaves, or is updated in a server where DabbleBot is present, the bot may read:
- Discord user ID
- Display name and username
- Account creation date
- Avatar URL
- Current roles
- Nickname changes
- Voice channel movements

This data powers automated verification (CAPTCHA), welcome/leave messages, alt account detection, automatic role assignment, time-based roles, server statistics, moderation logging, and server backup features.

### 1.2 Presence Intent Data
DabbleBot may read member presence states (online, idle, DND, offline) and activities (including streaming status) for:
- Server statistics displays (online/offline breakdowns)
- User info commands (on-demand display of a user's current status and activities)
- Role assignment commands that target online members only

Presence data is read transiently and is **not stored** off-platform.

### 1.3 Message Content Intent Data
DabbleBot may read message content for the following purposes:
- **Content Moderation (Scanner):** Message text and images are sent to the Sightengine API for automated NSFW/profanity detection. No data is stored locally.
- **Anti-Spam (Defender):** Message content is cached in RAM (maximum 3,000 messages or 48 hours) for spam pattern detection. No message content is written to disk.
- **Moderation Logging:** When messages are edited or deleted, before/after content is posted to designated moderation log channels on Discord.
- **Warning System Automod:** Message content is read transiently in memory for anti-spam detection and regex-based content rules. Not persisted to disk.
- **Anti-Scam (StopNitroScams):** Messages are scanned for known scam patterns using a transient in-memory heuristic. No message content is stored.
- **XP/Leveling:** The bot reads only the author ID and guild ID to award XP. Message content is **not** read or stored for this feature.
- **Reminders, Suggestions, and Reports:** User-initiated text content (reminder text, suggestion text, report text) is stored until the reminder fires, the suggestion is resolved, or the report is manually deleted by an admin.
- **Command Statistics:** Only command names are counted. Message content is not stored.
- **Quote Game:** Single-word answers from players are recorded and the original message is deleted.
- **Ticket Transcripts:** When a ticket is closed, the bot can optionally export a transcript to a Discord channel (on-platform).

### 1.4 Other Data Collected
- **Economy and Game Data:** User IDs, currency balances, game statistics (wins, losses, cooldowns), inventories, XP, and levels are stored for economy and game features.
- **Warning Records:** User IDs, warning levels, reasons, issuing moderator IDs, timestamps, and durations are stored for the warning system.
- **Timezone:** Per-user IANA timezone strings for timezone-related features.
- **Sticky Roles:** Per-member role ID lists for role persistence across join/leave cycles.
- **Server Configuration:** Per-guild settings including channel IDs, role IDs, toggle states, and feature configurations.

---

## 2. How Data Is Stored

All data is stored on the server hosting DabbleBot (a dedicated Virtual Private Server). Data is persisted as JSON files under a restricted data directory. Some features additionally use SQLite databases for larger datasets.

**Encryption:** All user data is encrypted at rest using filesystem-level encryption (fscrypt with AES-256-XTS). The encryption keys are managed by the operating system kernel's keystore.

---

## 3. Data Retention

| Data Type | Retention Period |
|-----------|-----------------|
| Server configuration | Until manually changed by server admin |
| Warning records | Until manually deleted by admin or via data deletion request |
| Economy balances and game stats | Until manually reset or via data deletion request |
| XP/leveling data | Until manually reset or via data deletion request |
| Reminder content | Until reminder fires (then deleted) |
| Suggestion text | Until suggestion is resolved or removed by admin |
| Report text | Until manually deleted by admin or via data deletion request |
| Sticky role assignments | Until manually cleared or via data deletion request |
| CAPTCHA verification state | In-memory only, cleared on completion/timeout |
| Anti-spam message cache | In-memory only, maximum 48 hours or 3,000 messages |

| Game session state (games in progress) | In-memory only, lost on bot restart |
| Presence/activity data | Not stored — read transiently only |

---

## 4. Third-Party Data Sharing

DabbleBot sends data to the following third-party services:

| Service | Data Sent | Purpose |
|---------|-----------|---------|
| Sightengine API | Message text and images | Automated content moderation (NSFW/profanity detection) |
| Sentry.io | Error metadata and command tracebacks (no message content) | Error tracking and debugging |
| Open Trivia Database | No user data sent (IP address visible to API) | Trivia question sourcing |
| Mojang API | Minecraft playername (user-provided, not Discord data) | Minecraft rank lookup |

**No user data is sold, shared with advertisers, or used for commercial purposes.**

---

## 5. Machine Learning and AI Training

DabbleBot does **not** train any machine learning or AI models on user data. Third-party content moderation APIs (Sightengine) are used for inference only — analyzing messages for safety purposes. Message content sent to these services is not used to train models owned or operated by DabbleBot.

---

## 6. User Rights and Data Deletion

### 6.1 Requesting Your Data
Users may request a copy of all data DabbleBot stores about them by contacting the bot owner. The bot supports data export for features that implement the data retrieval interface.

### 6.2 Deleting Your Data
Users may request deletion of their data by:
1. Using the `d/mydata` command to initiate the bot's automated data deletion process
2. Using Discord's "Data deletion request" workflow, which triggers the bot's automated data deletion process
3. Contacting the bot administrators directly using the `d/contact` command or through the support channels provided in the bot's help command

The bot's data deletion process removes user data from most features, including: warning records, economy balances, game statistics, casino stats, heist data, reminders, timezone preferences, server statistics entries, leveling XP/bio/cosmetics (Leveler), captcha verification records (CaptchaGate), Minecraft rank data (NBZHCRank), and quote game data (QuoteGame).

**Known limitations:** Some features do not fully implement automated data deletion. If you request data deletion, the following data may require manual removal by the bot owner:
- Sticky role assignments
- Time-based role state entries
- Loot drop statistics

If you request data deletion, please mention these specific areas if you want them purged.

### 6.3 Opt-Out
Users cannot individually opt out of data collection features. Server administrators can disable any cog to stop all data collection for that feature. Users may leave the server to stop all data collection by DabbleBot.

---

## 7. Server Administrator Responsibilities

Server administrators who add DabbleBot to their server are responsible for:
- Informing their server members that DabbleBot is present and what data it collects
- Configuring which features are enabled (disabling cogs that are not needed)
- Ensuring compliance with any applicable local privacy regulations (e.g., GDPR, CCPA)
- Removing the bot from the server if data collection practices are no longer acceptable

---

## 8. Data Security

DabbleBot is hosted on a VPS with:
- SSH key-only authentication (no password access)
- Restrictive filesystem permissions on all data directories
- Regular security updates applied to the host operating system
- Anti-DDoS protection on all network traffic
- Firewall configured to block all unnecessary ports
- Regular security audits conducted by Lynis on the system
- File Integrity Monitoring on all critical files
- Fail2Ban to prevent brute-force attacks

All user data is encrypted at rest using filesystem-level encryption as detailed in Section 2.

---

## 9. Changes to This Policy

We may update this Privacy Policy as features are added, modified, or removed. Server administrators will be notified of material changes through the bot's update notification system.

---

## 10. Contact

For data requests, privacy concerns, or questions about this policy, please contact the bot owner through the support channels provided in the bot's help command or server.

---

*DabbleBot is not affiliated with, endorsed by, or sponsored by Discord. Discord is a trademark of Discord Inc.*