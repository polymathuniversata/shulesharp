# AGENTS — AI coding agent instructions

Purpose: short, actionable guidance for AI coding agents working in this repository.

- **Start here:** explore the repository and read [DESIGN.md](DESIGN.md) before making changes.
- **Discover first:** locate build/test scripts (`package.json`, `pyproject.toml`, `Makefile`, `README.md`) and run the project's test/build commands before edits.

Quick commands to try (only after verifying relevant files exist):

- Node/npm: `npm ci` then `npm test`
- Python: `pip install -r requirements.txt` then `pytest`
- .NET: `dotnet restore` then `dotnet test`
- Docker: `docker-compose up --build`

Agent rules and conventions:

- Keep edits minimal and focused; prefer small, reviewable commits.
- Link, don't embed: reference existing docs (e.g., [DESIGN.md](DESIGN.md)) instead of duplicating them.
- Use the workspace's `apply_patch` workflow for file edits and `manage_todo_list` for multi-step tasks.
- Ask a short clarifying question before making any large or cross-cutting changes.

If you think a specialized agent or skill would help (tests, frontend, infra), propose `/create-(agent|skill)` with scope and sample prompts.

Feedback: please tell me what to add or change in this file.
