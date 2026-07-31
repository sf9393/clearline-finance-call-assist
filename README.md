# Clearline Finance Call Assist

**Status: implemented portfolio demo — all content is synthetic.**

A GitHub Pages-ready portfolio project for a fictional, policy-aware finance call-center RAG copilot. Every policy, customer, scenario, and example in this project will be clearly marked **synthetic**.

## What it will demonstrate

- Retrieval of relevant synthetic finance-service policy guidance.
- Grounded, concise agent language with required actions and escalation warnings.
- Prominent identity-verification and disclosure safeguards.
- A call-center layout with issue input, suggested response, sources/confidence, and a persistent guardrail.

Read the product scope and architecture in [PRD.md](PRD.md). The source policies are in [policies/](policies/).

## Stack

- React, TypeScript, Vite
- Local synthetic policy data and deterministic retrieval
- Vitest and Testing Library
- GitHub Actions deployment to GitHub Pages

## Local setup

Prerequisites: Node.js 20+ and npm 10+.

```sh
make install
make dev
```

Then open the local URL printed by Vite.

## Commands

```sh
make install  # install dependencies
make dev      # run the local development server
make test     # run the test suite
make build    # produce the deployable static site in dist/
make preview  # preview the production build locally
make check    # run tests and build
```

## GitHub Pages deployment

1. Create the GitHub repository and push the `main` branch.
2. In **Settings → Pages**, set Source to **GitHub Actions**.
3. The included workflow will test, build, and publish the static Vite output on pushes to `main`.
4. Confirm the repository name is supplied as Vite’s base path so assets load from `https://<owner>.github.io/<repository>/`.

No customer data, API keys, or production finance content will be required or accepted by the demo.

## Safety note

This is a local-only, deterministic RAG demonstration: it does not use a live model or call external services. It retrieves from bundled synthetic policy chunks and never processes actual customer information.
