.PHONY: help install dev test build deploy clean setup

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup    - Initial project setup"
	@echo "  make install  - Install dependencies"
	@echo "  make dev      - Start development servers"
	@echo "  make test     - Run all tests"
	@echo "  make build    - Build for production"
	@echo "  make deploy   - Deploy to production"
	@echo "  make clean    - Clean build artifacts"

# Initial setup
setup:
	@echo "Starting interactive setup..."
	@./setup.sh

# Quick setup (non-interactive)
setup-quick:
	@./scripts/quick-setup.sh

# CI setup (for automated environments)
setup-ci:
	@./scripts/setup-ci.sh

# Install dependencies
install:
	npm ci
	npx playwright install

# Development
dev:
	@./scripts/dev.sh

# Testing
test:
	npm run type-check
	npm run lint
	npm run test
	npm run test:e2e

test-unit:
	npm run test

test-e2e:
	npm run test:e2e

test-watch:
	npm run test:watch

# Building
build:
	npm run build

build-analyze:
	npm run build
	@echo "Bundle size analysis:"
	@du -sh dist/

# Deployment
deploy-staging:
	npm run build
	wrangler deploy --env staging

deploy-production:
	npm run build
	wrangler deploy --env production

# Database
db-init:
	npm run db:init

db-seed:
	npm run db:seed

# Docker
docker-up:
	docker-compose up

docker-down:
	docker-compose down

docker-build:
	docker-compose build

# Cleanup
clean:
	rm -rf dist node_modules/.vite coverage playwright-report test-results .turbo
	find . -name "*.log" -delete

clean-all: clean
	rm -rf node_modules