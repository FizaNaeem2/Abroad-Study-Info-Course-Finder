# Application Source

The public-safe frontend code for the Abroad Study Info Course Finder is stored here.

## `course-finder-widget.js`

This file contains the chatbot conversation flow used on the WordPress site. It handles:

- degree selection;
- subject input;
- academic-background and intake questions;
- email capture;
- course-search requests to the n8n backend;
- result rendering;
- callback requests;
- WhatsApp and booking actions;
- chat logging with a per-session identifier.

Production webhook URLs, booking links, and phone numbers have been replaced with placeholders.

The course-ranking algorithm itself lives in `workflows/course-finder.json`, because that JavaScript runs inside the n8n Code node rather than in the browser.

## Page requirements

The widget expects these elements to exist in the WordPress/Elementor page:

```text
#asi-bubble-btn
#asi-thread
#asi-controls
```

The original site used Elementor for the visible chat shell and WPCode for the JavaScript behavior.
