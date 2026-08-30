# Application Source

This directory is reserved for the public-safe source used by the website chatbot.

The production implementation consists of two main pieces:

- **Frontend chat widget** — embedded in the WordPress site and responsible for the conversation UI, user input, result rendering, and callback flow.
- **Matching logic** — JavaScript executed inside the n8n course-search workflow to filter and rank programme records returned from Google Sheets.

Before production source is committed here, environment-specific URLs, webhook endpoints, IDs, tokens, credentials, and private configuration must be removed or replaced with documented placeholders.

Suggested final layout:

```text
src/
├── widget/
│   ├── chatbot.html
│   ├── chatbot.css
│   └── chatbot.js
└── matching/
    └── course-matcher.js
```
