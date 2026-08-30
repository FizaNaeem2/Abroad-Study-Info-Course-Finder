# Project Screenshots

This folder contains screenshots of the deployed Abroad Study Info Course Finder and its supporting n8n workflows.

## Chatbot Interface

### Course Finder Interface
![Course Finder Interface](chatbot-interface.png)

Initial chatbot interface where students begin the course-matching process by selecting their desired degree level.

### Course Matching Results
![Course Matching Results](chatbot-results.png)

Example recommendations returned by the chatbot after processing the student's study preferences and academic background.

### Callback Request
![Callback Confirmation](callback-confirmation.png)

Final callback flow confirming that the prospective student's contact information has been submitted for follow-up.

## Backend Workflows

### Course Finder Workflow
![Course Finder Workflow](n8n-course-finder.png)

Main n8n workflow responsible for receiving course-search requests, retrieving programme information from Google Sheets, and applying the JavaScript matching logic.

### Lead Generation Workflow
![Lead Generation Workflow](n8n-lead-generation.png)

n8n workflow responsible for receiving prospective-student lead information and storing it in the dedicated Google Sheets lead database.

### Chat Logging Workflow
![Chat Logging Workflow](n8n-chat-logging.png)

Supporting n8n workflow used to record chatbot interactions in Google Sheets for internal tracking and analysis.
