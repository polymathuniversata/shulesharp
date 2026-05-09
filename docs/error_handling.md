Error Handling

Map Snippe errors to user-friendly responses and log details for debugging.

Principles:
- Validate inputs early (amount > 0, valid currency, student info present).
- Use structured logging; include local `payment_id` and Snippe reference id when logging provider errors.
- Return appropriate HTTP status codes (400 for bad request, 502 for provider errors, 500 for internal errors).

Common flow:
- If Snippe SDK raises an API error when creating a link, capture the error body and return a `502 Bad Gateway` with a short message to the caller and log full details for debugging.
- For webhook processing, if signature verification fails, return 400 and log the attempt.

See official Snippe error docs: https://docs.snippe.sh/docs/2026-01-25/error-handling
