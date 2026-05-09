Agent Skill Notes

If you want to add automations or agent skills (e.g., auto-notify school staff on successful payment), refer to Snippe's agent-skill docs: https://docs.snippe.sh/docs/2026-01-25/agent-skill

Ideas:
- Auto-send payment confirmation email to parent when `payment.succeeded` webhook arrives.
- Auto-create receipt record in school management system via a background worker.

Keep the agent/automation separate from core webhook processing: accept webhook, verify signature, enqueue job for downstream processing to avoid blocking.
