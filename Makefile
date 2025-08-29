# Colors for beautiful terminal output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
MAGENTA := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[1;37m
RESET := \033[0m

# Formatting
BOLD := \033[1m
DIM := \033[2m

# Icons (Unicode)
CHECK := ✅
ROCKET := 🚀
PACKAGE := 📦
TEST := 🧪
BUILD := 🔨
CLEAN := 🧹
SYNC := 🔄
INFO := ℹ️
WARN := ⚠️
ERROR := ❌
COFFEE := ☕
SPARKLES := ✨

.PHONY: help install dev test build deploy clean setup db-sync

# Default target
help:
	@echo ""
	@echo "$(BOLD)$(CYAN)  Web App Starter Pack - Cloudflare Edition$(RESET)"
	@echo "$(DIM)  ═══════════════════════════════════════════$(RESET)"
	@echo ""
	@echo "$(BOLD)$(GREEN)Available Commands:$(RESET)"
	@echo ""
	@echo "  $(BOLD)$(YELLOW)make setup$(RESET)    $(DIM)→$(RESET) $(SPARKLES) Initial project setup"
	@echo "  $(BOLD)$(YELLOW)make install$(RESET)  $(DIM)→$(RESET) $(PACKAGE) Install dependencies"
	@echo "  $(BOLD)$(YELLOW)make dev$(RESET)      $(DIM)→$(RESET) $(COFFEE) Start development servers"
	@echo "  $(BOLD)$(YELLOW)make test$(RESET)     $(DIM)→$(RESET) $(TEST) Run all tests"
	@echo "  $(BOLD)$(YELLOW)make build$(RESET)    $(DIM)→$(RESET) $(BUILD) Build for production"
	@echo "  $(BOLD)$(YELLOW)make deploy$(RESET)   $(DIM)→$(RESET) $(ROCKET) Deploy to Cloudflare"
	@echo "  $(BOLD)$(YELLOW)make clean$(RESET)    $(DIM)→$(RESET) $(CLEAN) Clean build artifacts"
	@echo "  $(BOLD)$(YELLOW)make db-sync$(RESET)  $(DIM)→$(RESET) $(SYNC) Sync remote database to local"
	@echo ""
	@echo "$(DIM)  Type '$(BOLD)make <command>$(RESET)$(DIM)' to run a command$(RESET)"
	@echo ""

# Initial setup
setup:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(SPARKLES) Starting Interactive Setup...$(RESET)"
	@echo "$(DIM)════════════════════════════════$(RESET)"
	@./setup.sh
	@echo ""
	@echo "$(GREEN)$(CHECK) Setup complete!$(RESET)"

# Install dependencies
install:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(PACKAGE) Installing Dependencies...$(RESET)"
	@echo "$(DIM)════════════════════════════════$(RESET)"
	@echo "$(YELLOW)→$(RESET) Installing npm packages..."
	@npm ci
	@echo "$(YELLOW)→$(RESET) Installing Playwright browsers..."
	@npx playwright install
	@echo ""
	@echo "$(GREEN)$(CHECK) All dependencies installed!$(RESET)"
	@echo ""

# Development
dev:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(COFFEE) Starting Development Environment...$(RESET)"
	@echo "$(DIM)═══════════════════════════════════════$(RESET)"
	@./scripts/dev.sh

# Testing
test:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(TEST) Running Test Suite...$(RESET)"
	@echo "$(DIM)═══════════════════════$(RESET)"
	@if [ ! -d "node_modules" ] || [ ! -d "node_modules/msw" ]; then \
		echo "$(YELLOW)$(WARN) Dependencies missing. Installing...$(RESET)"; \
		$(MAKE) install; \
	fi
	@echo ""
	@echo "$(YELLOW)→$(RESET) Running type checks..."
	@npm run type-check
	@echo "$(GREEN)  ✓ Type check passed$(RESET)"
	@echo ""
	@echo "$(YELLOW)→$(RESET) Running linter..."
	@npm run lint
	@echo "$(GREEN)  ✓ Linting passed$(RESET)"
	@echo ""
	@echo "$(YELLOW)→$(RESET) Running unit tests..."
	@npm run test
	@echo "$(GREEN)  ✓ Unit tests passed$(RESET)"
	@echo ""
	@echo "$(YELLOW)→$(RESET) Running E2E tests..."
	@npm run test:e2e
	@echo "$(GREEN)  ✓ E2E tests passed$(RESET)"
	@echo ""
	@echo "$(BOLD)$(GREEN)$(CHECK) All tests passed successfully!$(RESET)"
	@echo ""

# Building
build:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(BUILD) Building for Production...$(RESET)"
	@echo "$(DIM)════════════════════════════$(RESET)"
	@echo "$(YELLOW)→$(RESET) Creating optimized build..."
	@npm run build
	@echo ""
	@echo "$(GREEN)$(CHECK) Build complete!$(RESET)"
	@echo "$(DIM)  Output: ./dist/$(RESET)"
	@echo ""

# Deployment
deploy:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(ROCKET) Deploying to Cloudflare Workers...$(RESET)"
	@echo "$(DIM)═══════════════════════════════════════$(RESET)"
	@echo ""
	@echo "$(YELLOW)→$(RESET) Building production bundle..."
	@npm run build:prod
	@echo "$(GREEN)  ✓ Production build complete$(RESET)"
	@echo ""
	@echo "$(YELLOW)→$(RESET) Deploying to Cloudflare..."
	@npx wrangler deploy
	@echo ""
	@echo "$(BOLD)$(GREEN)$(CHECK) Deployment successful!$(RESET)"
	@echo "$(DIM)  Your app is now live on Cloudflare Workers$(RESET)"
	@echo ""

# Database sync
db-sync:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(SYNC) Syncing Database...$(RESET)"
	@echo "$(DIM)═════════════════════$(RESET)"
	@./scripts/db-sync.sh
	@echo ""
	@echo "$(GREEN)$(CHECK) Database sync complete!$(RESET)"
	@echo ""

# Cleanup
clean:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(CLEAN) Cleaning Build Artifacts...$(RESET)"
	@echo "$(DIM)═════════════════════════════$(RESET)"
	@echo "$(YELLOW)→$(RESET) Removing dist directory..."
	@rm -rf dist
	@echo "$(YELLOW)→$(RESET) Removing build caches..."
	@rm -rf node_modules/.vite coverage playwright-report test-results .turbo
	@echo "$(YELLOW)→$(RESET) Removing log files..."
	@find . -name "*.log" -delete
	@echo ""
	@echo "$(GREEN)$(CHECK) Cleanup complete!$(RESET)"
	@echo ""

# Quick shortcuts
.PHONY: d t b

d: dev
t: test
b: build

# Development with specific modes
.PHONY: dev-frontend dev-backend dev-full

dev-frontend:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(COFFEE) Starting Frontend Only...$(RESET)"
	@echo "$(DIM)═══════════════════════════$(RESET)"
	@npm run dev:frontend

dev-backend:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(COFFEE) Starting Backend Only...$(RESET)"
	@echo "$(DIM)══════════════════════════$(RESET)"
	@npm run dev:backend

dev-full:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(COFFEE) Starting Full Stack Development...$(RESET)"
	@echo "$(DIM)═══════════════════════════════════════$(RESET)"
	@npm run dev

# Testing with specific modes
.PHONY: test-unit test-e2e test-watch

test-unit:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(TEST) Running Unit Tests...$(RESET)"
	@echo "$(DIM)══════════════════════$(RESET)"
	@npm run test:unit

test-e2e:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(TEST) Running E2E Tests...$(RESET)"
	@echo "$(DIM)═════════════════════$(RESET)"
	@npm run test:e2e

test-watch:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(TEST) Starting Test Watcher...$(RESET)"
	@echo "$(DIM)═════════════════════════$(RESET)"
	@npm run test:watch

# Utility commands
.PHONY: check format lint type-check

check: lint type-check
	@echo ""
	@echo "$(GREEN)$(CHECK) All checks passed!$(RESET)"
	@echo ""

format:
	@echo ""
	@echo "$(BOLD)$(CYAN)$(SPARKLES) Formatting Code...$(RESET)"
	@echo "$(DIM)════════════════════$(RESET)"
	@npm run format
	@echo "$(GREEN)$(CHECK) Code formatted!$(RESET)"
	@echo ""

lint:
	@echo ""
	@echo "$(BOLD)$(CYAN)🔍 Running Linter...$(RESET)"
	@echo "$(DIM)════════════════════$(RESET)"
	@npm run lint
	@echo "$(GREEN)$(CHECK) Linting passed!$(RESET)"
	@echo ""

type-check:
	@echo ""
	@echo "$(BOLD)$(CYAN)🔍 Running Type Check...$(RESET)"
	@echo "$(DIM)═════════════════════════$(RESET)"
	@npm run type-check
	@echo "$(GREEN)$(CHECK) Type check passed!$(RESET)"
	@echo ""