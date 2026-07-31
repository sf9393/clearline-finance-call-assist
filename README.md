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

## Optional Cloudflare Worker AI gateway

The app works fully with local, deterministic retrieval. To activate **Generate with OpenAI** for any entered question, deploy the included Worker. The API key stays only in Cloudflare; do not put it in GitHub, a Vite variable, or browser code.

1. Install dependencies with `make install`, then authenticate with `npx wrangler login`.
2. Deploy the Worker: `make worker-deploy`.
3. Set a newly rotated key as a Cloudflare Worker secret: `npx wrangler secret put OPENAI_API_KEY --config worker/wrangler.jsonc`.
4. In the GitHub repository, create an **Actions variable** named `CALL_ASSIST_API_URL` whose value is the Worker URL (for example, `https://clearline-finance-call-assist-api.<your-subdomain>.workers.dev`). This is an endpoint URL, not a secret.
5. Re-run the GitHub Pages workflow to rebuild the site with that endpoint.

The Worker defaults to the explicitly configured `o3-mini` model; change `OPENAI_MODEL` in `worker/wrangler.jsonc` if you want a current model. The OpenAI key must be freshly rotated and must never be pasted into source control or chat.

### Deploy from GitHub Actions

If you do not deploy from your terminal, add these **repository secrets** in GitHub under **Settings → Secrets and variables → Actions**:

- `CLOUDFLARE_API_TOKEN`: a restricted Cloudflare API token that can deploy Workers to your account.
- `OPENAI_API_KEY`: a newly rotated OpenAI API key.

Then run the **Deploy Cloudflare Worker** workflow from the repository’s Actions tab. The workflow sends the OpenAI key directly to Cloudflare as the Worker’s encrypted secret; it is never included in the generated Pages site or repository files.

## Safety note

This is a local-only, deterministic RAG demonstration: it does not use a live model or call external services. It retrieves from bundled synthetic policy chunks and never processes actual customer information.
