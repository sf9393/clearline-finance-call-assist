.DEFAULT_GOAL := help

.PHONY: help install dev test build preview check worker-dev worker-deploy

help:
	@echo "Clearline Finance Call Assist (commands activate after implementation)"
	@echo "  make install  Install dependencies"
	@echo "  make dev      Start local development server"
	@echo "  make test     Run tests"
	@echo "  make build    Build static GitHub Pages artifact"
	@echo "  make preview  Preview production build"
	@echo "  make check    Run tests and build"
	@echo "  make worker-dev     Run the Cloudflare Worker locally"
	@echo "  make worker-deploy  Deploy the Cloudflare Worker"

install:
	@test -f package.json || (echo "Implementation pending PRD approval." && exit 1)
	npm install

dev:
	@test -f package.json || (echo "Implementation pending PRD approval." && exit 1)
	npm run dev

test:
	@test -f package.json || (echo "Implementation pending PRD approval." && exit 1)
	npm run test

build:
	@test -f package.json || (echo "Implementation pending PRD approval." && exit 1)
	npm run build

preview:
	@test -f package.json || (echo "Implementation pending PRD approval." && exit 1)
	npm run preview

check: test build

worker-dev:
	npm run worker:dev

worker-deploy:
	npm run worker:deploy
