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
	@echo "Setting up project..."
	cp .env.example .env.local
	cp .dev.vars.example .dev.vars
	npm install
	npx playwright install
	./scripts/setup-hooks.sh
	@echo "✅ Setup complete! Edit .env.local and .dev.vars with your values"

# Install dependencies
install:
	npm ci
	npx playwright install

# Development
dev:
	@echo "Starting development servers..."
	@echo "Frontend: http://localhost:5173"
	@echo "Backend:  http://localhost:8787"
	npm run dev & wrangler dev

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
db-generate:
	npm run db:generate

db-push:
	npm run db:push

db-studio:
	npm run db:studio

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