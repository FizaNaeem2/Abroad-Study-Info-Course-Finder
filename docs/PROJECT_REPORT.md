# Project Report — Abroad Study Info Course Finder

**Status:** Completed production implementation  
**Date:** August 2026

## Executive summary
The project delivers a self-hosted course-finder chatbot embedded in AbroadStudyInfo.com. Students answer a short conversational questionnaire and receive up to five verified course suggestions from a database of 871 Italian university programmes.

The system captures callback leads, supports WhatsApp/calendar conversion paths, and records complete chatbot conversations for internal review. The matching engine is deterministic and typo-tolerant rather than generative.

## Delivered functionality

| Feature | Status |
|---|---|
| HTTPS integration | Complete |
| 871-course database search | Complete |
| Typo-tolerant fuzzy matching | Complete |
| Top-5 ranked results | Complete |
| Lead capture | Complete |
| Chat logging | Complete |
| International phone input | Complete |
| WhatsApp option | Complete |
| Calendar booking option | Complete |
| Live end-to-end testing | Complete |

## Architecture
The implementation separates:
- WordPress/Elementor/WPCode frontend;
- self-hosted n8n automation/backend;
- Google Sheets data layer.

## Matching
The final engine applies tokenization, stop-word removal, degree filtering, Levenshtein fuzzy matching, scoring, ranking, and top-5 selection.

## Limitations / future work
- Add proactive notifications for new leads.
- Restrict webhook CORS to the production website origin.
- Add rate limiting and stronger server-side validation.
- Add automated webhook/integration tests.
- Consider semantic/embedding search only if justified.
- Define explicit retention rules for personally identifiable lead/chat data.

## Scope
The chatbot is a course-discovery and lead-generation system, not an admissions, scholarship, visa, or eligibility decision system.
