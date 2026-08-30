# n8n Workflows

This folder contains the sanitized n8n workflows used by the Abroad Study Info Course Finder.

## Course Finder

`course-finder.json`

Receives a course-search request through a POST webhook, reads the university programme catalogue from Google Sheets, filters by degree level, applies typo-tolerant JavaScript matching with Levenshtein distance, ranks the results, and returns the top five matches.

## Save Lead

`save-lead.json`

Receives callback details submitted through the chatbot and appends the user's name, email, WhatsApp number, degree level, subject, academic background, and intended intake to the leads sheet.

## Log Chat Message

`log-message.json`

Records chatbot messages in Google Sheets using a session ID, timestamp, sender, and message text.

## Before importing

The public files use placeholders instead of production identifiers:

- `YOUR_GOOGLE_SHEET_ID`
- `YOUR_GOOGLE_SHEETS_CREDENTIAL`
- `YOUR_COURSE_DATABASE_SHEET`

After importing a workflow into n8n, connect your own Google Sheets credential and select the appropriate spreadsheet/sheet.

The workflows are intentionally stored as inactive in the repository so importing them does not immediately expose a live webhook.
