# Abroad Study Info — Course Finder Chatbot

A self-hosted course-matching and lead-generation chatbot built for **AbroadStudyInfo.com**.

The system helps prospective students discover relevant university programmes in Italy, captures qualified enquiries, and logs conversations for internal review. It combines a custom WordPress chat widget with self-hosted **n8n**, **Google Sheets**, fuzzy string matching, HTTPS webhooks, and a VPS deployment.

> The matching engine is deterministic and typo-tolerant. It does not use an LLM or generative AI; course suggestions are returned only from the verified course database.

## What the system does

A visitor:
1. selects a degree level;
2. enters a subject in free text;
3. provides academic background and intended intake;
4. provides an email address;
5. receives up to **5 ranked course matches** from a database of **871 Italian university programmes**;
6. can request a callback, open WhatsApp, book a Q&A session, or continue independently.

The backend also logs bot/student messages with a session ID and stores callback leads in Google Sheets.

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
The visible chat interface is rendered in **Elementor**. The conversation logic is deployed site-wide through **WPCode** using [`src/course-finder-widget.js`](src/course-finder-widget.js).

### Backend
Three sanitized n8n workflows are included in [`workflows/`](workflows/):

| Workflow | Purpose |
|---|---|
| [`course-finder.json`](workflows/course-finder.json) | Reads the course database, applies degree filtering and fuzzy ranking, and returns the top 5 matches |
| [`save-lead.json`](workflows/save-lead.json) | Saves callback details and search context |
| [`log-message.json`](workflows/log-message.json) | Stores conversation messages grouped by session |

### Infrastructure
Production stack: Ubuntu VPS, Docker, n8n, Nginx, Let's Encrypt/Certbot, WordPress, Elementor, WPCode, Google Sheets, and JavaScript.

Deployment-specific IDs, credentials, spreadsheet identifiers, phone numbers, calendar URLs, workflow IDs, server IPs, and instance metadata have been removed from the public repository.

## Screenshots

The complete visual walkthrough is in [`docs/screenshots/`](docs/screenshots/).

### Live chatbot
![Chatbot interface](docs/screenshots/chatbot-interface.png)

### Course-matching results
![Course recommendations](docs/screenshots/chatbot-results.png)

### Callback confirmation
![Callback confirmation](docs/screenshots/callback-confirmation.png)

### n8n course finder
![Course finder workflow](docs/screenshots/n8n-course-finder.png)

### n8n lead generation
![Lead generation workflow](docs/screenshots/n8n-lead-generation.png)

### n8n chat logging
![Chat logging workflow](docs/screenshots/n8n-chat-logging.png)

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
├── src/
│   ├── README.md
│   └── course-finder-widget.js
├── workflows/
│   ├── README.md
│   ├── course-finder.json
│   ├── save-lead.json
│   └── log-message.json
├── data/
│   └── README.md
├── deployment/
│   └── README.md
└── docs/
    ├── PROJECT_REPORT.md
    ├── TECHNICAL_DOCUMENTATION.md
    └── screenshots/
        ├── README.md
        ├── chatbot-interface.png
        ├── chatbot-results.png
        ├── callback-confirmation.png
        ├── n8n-course-finder.png
        ├── n8n-lead-generation.png
        └── n8n-chat-logging.png
```

## Reproducing the project

1. Create a Google Sheet containing the course database.
2. Import the three workflows from `workflows/`.
3. Configure your own Google Sheets OAuth credential in n8n.
4. Replace the placeholder spreadsheet and sheet values in the imported workflows.
5. Configure the public webhook endpoints.
6. Update the configuration constants in `src/course-finder-widget.js`.
7. Add the chatbot HTML shell in Elementor.
8. Deploy the JavaScript through WPCode or an equivalent site-wide script mechanism.

See [`deployment/README.md`](deployment/README.md) and [`docs/TECHNICAL_DOCUMENTATION.md`](docs/TECHNICAL_DOCUMENTATION.md) for more detail.

## Privacy and security

The public repository excludes real lead data, chat transcripts, OAuth tokens, Google Sheet IDs, VPS IP addresses, n8n instance/workflow identifiers, private phone numbers, and booking links. See [`SECURITY.md`](SECURITY.md).

## Current limitations

- Matching is fuzzy/keyword-based rather than semantic.
- Lead notifications are not part of the documented core implementation.
- The original project was tested manually; automated integration tests are a future improvement.
- Eligibility, scholarship, visa, and admission decisions are intentionally outside scope.

## Project status

The production implementation was completed and tested end-to-end for course search, chat logging, lead capture, HTTPS integration, and callback flow.

## Author

**Fiza Naeem**

Project developed for Abroad Study Info, August 2026.
