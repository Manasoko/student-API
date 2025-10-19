# -----------------------------
# Makefile for Student REST API
# -----------------------------

# Variables
APP_NAME = student-api
ENV_FILE = .env
NODE_ENV ?= development
DOCKER_IMAGE = student-api.1.0.0
DOCKER_CONTAINER = student-api.1.0.0
DOCKER_USERNAME = manajay

# Colors for nice output
GREEN = \033[0;32m
BLUE = \033[0;34m
YELLOW = \033[1;33m
NC = \033[0m # No Color

# Help message (default target)
help:
	@echo ""
	@echo "$(BLUE)Available commands:$(NC)"
	@echo "  make install        - Install dependencies"
	@echo "  make run            - Run the API (development)"
	@echo "  make start          - Run the API (production)"
	@echo "  make migrate        - Run DB migrations"
	@echo "  make migrate-reset  - Drop & re-run DB migrations"
	@echo "  make test           - Run unit tests"
	@echo "  make lint           - Lint your code"
	@echo "  make format         - Format code using Prettier"
	@echo "  make clean          - Remove node_modules and build artifacts"
	@echo ""

# Install project dependencies
install:
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install

# Run DB migrations (Sequelize example)
migrate:
	@echo "$(GREEN)Running database migrations...$(NC)"
	npx sequelize-cli db:migrate

# Drop & recreate DB (use with caution)
migrate-reset:
	@echo "$(YELLOW)Resetting database...$(NC)"
	npx sequelize-cli db:migrate:undo:all
	npx sequelize-cli db:migrate

# Run the API (development mode)
run-dev:
	@echo "$(GREEN)Starting $(APP_NAME) in development mode...$(NC)"
	npm run dev

# Run the API (production)
start:
	@echo "$(GREEN)Starting $(APP_NAME) in production mode...$(NC)"
	NODE_ENV=production npm start

# Run tests
test:
	@echo "$(GREEN)Running tests...$(NC)"
	npm test

# Lint the code
lint:
	@echo "$(GREEN)Linting code...$(NC)"
	npx eslint src/**/*.ts

# Format code with Prettier
format:
	@echo "$(GREEN)Formatting code with Prettier...$(NC)"
	npx prettier --write .

build:
	@echo "$(GREEN)Building the project...$(NC)"
	npm run build

# Clean project (dangerous)
clean:
	@echo "$(YELLOW)Cleaning up project...$(NC)"
	rm -rf node_modules
	rm -rf dist
	rm -rf coverage

.PHONY: help install migrate migrate-reset run start test lint format clean

# Run Docker container
run:
	@echo "$(GREEN)Running Docker container...$(NC)"
	docker-compose up -d
# Stop Docker container
stop:
	@echo "$(YELLOW)Stopping Docker container...$(NC)"
	docker-compose down -v

# -----------------------------
# FOR DOCKER USAGE
# -----------------------------

# Build Docker image
docker-build:
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build -t $(DOCKER_IMAGE) .
# View Docker container logs
docker-logs:
	@echo "$(GREEN)Viewing Docker container logs...$(NC)"
	docker logs -f $(DOCKER_CONTAINER)
docker-push:
	@echo "$(GREEN)Viewing Docker container logs...$(NC)"
	docker push $(DOCKER_USERNAME)/$(DOCKER_CONTAINER)
# Remove Docker image
docker-clean:
	@echo "$(YELLOW)Removing Docker image...$(NC)"
	docker rmi $(DOCKER_IMAGE) || true
