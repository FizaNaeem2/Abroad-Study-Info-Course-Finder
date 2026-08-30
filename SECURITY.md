# Security and Privacy

This public-ready package excludes OAuth tokens, Google credential IDs, spreadsheet IDs/URLs, n8n workflow/instance IDs, VPS IPs, production booking links, production phone numbers, and real lead/chat data.

Production recommendations:
- HTTPS only
- Restrict CORS
- Rate-limit public webhooks
- Validate payloads
- Least-privilege Google access
- Protect the n8n editor
- Define PII retention/deletion rules
- Never commit `.env`, credential exports, or secrets

If a credential is ever committed, rotate/revoke it rather than relying only on repository cleanup.
