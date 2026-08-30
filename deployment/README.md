# Deployment Guide

This repository contains sanitized public examples. Replace the placeholders with your own deployment configuration before running the system.

## n8n

Run n8n behind HTTPS and configure your public host, protocol, and webhook base URL for your environment.

## Google Sheets

Create three sheets/data stores for:

- the course catalogue;
- callback leads;
- chat logs.

Import the JSON files from `workflows/` and connect them to your own Google Sheets credential and spreadsheet/sheet identifiers.

## Webhooks

The frontend expects three POST endpoints:

```text
/webhook/course-finder
/webhook/save-lead
/webhook/log-message
```

Restrict allowed browser origins to the real website domain in production.

## Frontend

Update the configuration constants near the top of `src/course-finder-widget.js`:

```text
WEBHOOK_URL
LEADS_WEBHOOK_URL
LOG_URL
CALENDAR_URL
WHATSAPP_NUMBER
```

The script expects these elements to exist on the page:

```text
#asi-bubble-btn
#asi-thread
#asi-controls
```

## Testing

Before deployment, test:

- Bachelor's, Master's, and Single Cycle Degree searches;
- typo-heavy subject queries;
- no-result behavior;
- backend/network failure behavior;
- lead submission;
- phone validation;
- chat-log ordering;
- callback confirmation;
- CORS from the production website domain.
