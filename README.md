# Abroad Study Info — Course Finder Chatbot

A self-hosted course-matching and lead-generation chatbot built for **AbroadStudyInfo.com**.

The system helps prospective students discover relevant university programmes in Italy, captures qualified enquiries, and logs conversations for internal review. It combines a custom WordPress chat widget with self-hosted **n8n**, **Google Sheets**, fuzzy string matching, HTTPS webhooks, and a low-cost VPS deployment.

> **Important:** The current matching engine is deterministic and typo-tolerant; it does **not** use an LLM or generative AI. Course suggestions are returned only from the verified course database.

## What the system does

A visitor:
1. selects a degree level;
2. enters a subject in free text;
3. provides academic background and intended intake;
4. provides an email address;
5. receives up to **5 ranked course matches** from a database of **871 Italian university programmes**;
6. can request a callback, open WhatsApp, book a Q&A session, or continue independently.

The backend also logs every bot/student message with a session ID and saves callback leads to a dedicated Google Sheet.

## Architecture

```text
WordPress / Elementor / WPCode
            |
            | HTTPS fetch()
            v
      Self-hosted n8n
    /        |         \
course    save-lead   log-message
finder       |            |
   |         |            |
   +------ Google Sheets -+
            |
      verified course DB
```

### Frontend
The visible chat interface is rendered in **Elementor**. Conversational logic is injected site-wide through **WPCode** using `widget/course-finder-widget.js`.

### Backend
Three sanitized n8n workflows are included:

| Workflow | Purpose |
|---|---|
| `course-finder.json` | Reads the course database, applies degree filtering + fuzzy ranking, returns the top 5 matches |
| `save-lead.json` | Saves callback details and search context |
| `log-message.json` | Stores conversation messages grouped by session |

### Infrastructure
Production stack: Ubuntu VPS, Docker, n8n, Nginx, Let's Encrypt/Certbot, WordPress, Elementor, WPCode, Google Sheets, JavaScript.

Deployment-specific IDs, credentials, spreadsheet identifiers, phone numbers, calendar URLs, workflow IDs, server IPs, and instance metadata have been removed from this public-ready package.

## Screenshots

### Live chatbot
![Chatbot interface](docs/images/chatbot-interface.png)

### Real course-matching result
![Course recommendations](docs/images/chatbot-results.png)

### Callback flow completed
![Callback confirmation](docs/images/callback-confirmation.png)

### n8n — course finder
![Course finder workflow](docs/images/n8n-course-finder.png)

### n8n — lead generation
![Lead generation workflow](docs/images/n8n-lead-generation.png)

### n8n — conversation logging
![Chat logging workflow](docs/images/n8n-chat-logging.png)

## Matching logic

The search workflow:
1. normalizes the requested degree;
2. splits the subject query into meaningful words;
3. removes filler words;
4. compares query words with course-name and department words;
5. uses **Levenshtein distance** for typo tolerance;
6. scores candidates by matched words;
7. returns the top 5 results.

The result set is always sourced from the verified course spreadsheet.

## Repository structure

```text
.
├── README.md
├── SECURITY.md
├── .gitignore
├── widget/
│   └── course-finder-widget.js
├── n8n-workflows/
│   ├── course-finder.json
│   ├── save-lead.json
│   └── log-message.json
├── deployment/
│   └── README.md
└── docs/
    ├── PROJECT_REPORT.md
    ├── TECHNICAL_DOCUMENTATION.md
    └── images/
```

## Reproducing the project

1. Create a Google Sheet containing the course database.
2. Import the three workflows from `n8n-workflows/`.
3. Configure your own Google Sheets OAuth credential in n8n.
4. Replace placeholder spreadsheet/sheet IDs.
5. Configure public webhook endpoints.
6. Update the constants at the top of `widget/course-finder-widget.js`.
7. Add the chatbot HTML shell in Elementor.
8. Deploy the JavaScript through WPCode or equivalent.

See `deployment/README.md` and `docs/TECHNICAL_DOCUMENTATION.md`.

## Privacy and security

The public package excludes real lead data, chat transcripts, OAuth tokens, Google Sheet IDs, VPS IP address, n8n instance/workflow identifiers, private phone numbers, and booking links. See `SECURITY.md`.

## Current limitations

- Matching is fuzzy/keyword-based rather than semantic.
- Lead notifications are not part of the documented core implementation.
- The original project was tested manually; automated integration tests are a future enhancement.
- Eligibility, scholarship, visa, and admission decisions are intentionally outside scope.

## Project status

The production implementation was completed and tested end-to-end for course search, chat logging, lead capture, HTTPS integration, and callback flow.

## Author

**Fiza Naeem**

Project developed for Abroad Study Info, August 2026.
