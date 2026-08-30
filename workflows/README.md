# n8n Workflows

This directory contains sanitized, exportable versions of the n8n workflows used by the Abroad Study Info Course Finder.

## Production workflows

1. **Course search workflow** — receives chatbot requests through a webhook, reads the programme catalogue from Google Sheets, and applies the JavaScript matching/ranking logic.
2. **Lead generation workflow** — receives callback/lead details and appends them to the leads sheet.
3. **Chat logging workflow** — records chatbot interactions for internal review.

## Security

Production workflow exports may contain credential references, webhook identifiers, spreadsheet IDs, hostnames, or other environment-specific configuration. Do not commit raw production exports until those values have been reviewed and sanitized.

The screenshots in `docs/screenshots/` document the workflow architecture without exposing credentials.
