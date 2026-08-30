# Technical Documentation

## System overview
Three layers communicate over HTTPS:
1. WordPress + Elementor + WPCode frontend
2. Self-hosted n8n automation/backend
3. Google Sheets for course catalogue, leads, and chat logs

## n8n workflows

### Course Finder
`Webhook (POST) → Google Sheets → JavaScript fuzzy ranking → top 5`

Critical settings:
- Respond when the last node finishes
- Return all entries
- Use a production CORS policy restricted to the real website origin

The JavaScript performs normalization, stop-word removal, degree filtering, token comparison, Levenshtein typo matching, scoring, sorting, and top-5 selection.

### Save Lead
`Webhook (POST) → Google Sheets append`

Stores name, email, phone/WhatsApp, degree, subject/course, academic background, and intake.

### Log Chat Message
`Webhook (POST) → Google Sheets append`

Stores session ID, timestamp, sender, and message.

The frontend serializes log requests through a Promise queue to reduce dropped concurrent writes.

## Frontend design
- Elementor owns the visible HTML shell.
- WPCode owns the JavaScript behavior.
- JavaScript waits for page load before binding to DOM elements.
- Conversation state is held in an `answers` object.
- Separate webhook calls handle search, lead capture, and logging.
- Callback input is validated.
- WhatsApp and booking paths are offered as next-step actions.

## Major engineering issues resolved

| Issue | Root cause | Resolution |
|---|---|---|
| Lead webhook returned 404 | Production workflow not active | Republished/activated before testing |
| DNS changes had no effect | DNS edited at a non-authoritative provider | Updated authoritative DNS provider |
| Chat UI appeared empty | Duplicate DOM IDs | Kept one HTML shell in Elementor |
| DOM binding returned null | Script ran too early | Wrapped logic in `window.load` |
| CORS/preflight errors | Browser origin blocked | Configured webhook origin policy |
| Search returned empty response | Webhook replied too early | Respond after final node |
| Only one result returned | Response set to first entry | Return all entries |
| Real-world queries failed | Exact substring matching | Added tokenization + Levenshtein fuzzy match |
| Log rows were missing | Concurrent append requests | Serialized log writes |
| Weak phone validation | Free-text phone input | Added country code + digit validation |

## Production hardening recommendations
- Restrict CORS to the actual website origin.
- Add rate limiting at Nginx/gateway.
- Validate request bodies inside n8n.
- Use least-privilege Google permissions.
- Never commit credential exports.
- Define retention rules for leads/chat logs.
- Keep n8n and the host patched.
