# Deployment Guide

This package contains sanitized examples. Replace placeholders with your own configuration.

## n8n
Run n8n behind HTTPS and configure:
```text
N8N_HOST=YOUR_N8N_DOMAIN
N8N_PROTOCOL=https
WEBHOOK_URL=https://YOUR_N8N_DOMAIN/
```

## Google Sheets
Create a course catalogue sheet, leads sheet, and chat-logs sheet. Import the workflow JSON files and select your own Google Sheets credential.

## Webhooks
```text
POST /webhook/course-finder
POST /webhook/save-lead
POST /webhook/log-message
```

Restrict CORS to the real website origin in production.

## Frontend
Update these constants in `widget/course-finder-widget.js`:
```text
WEBHOOK_URL
LEADS_WEBHOOK_URL
LOG_URL
CALENDAR_URL
WHATSAPP_NUMBER
```

The page must contain:
```text
#asi-bubble-btn
#asi-thread
#asi-controls
```

## Testing
Test valid searches, typo-heavy input, no-result behavior, backend failure behavior, lead submission, phone validation, chat-log ordering, and callback confirmation.
