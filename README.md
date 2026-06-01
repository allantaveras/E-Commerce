#[Project In Progress]
# Unified Test Automation & AI Quality Engineering Framework

[![Build Status](https://github.com/allantaveras/E-Commerce/actions/workflows/regression-nightly.yml/badge.svg)](https://github.com/allantaveras/E-Commerce/actions)
[![Playwright Version](https://img.shields.io/badge/playwright-v1.42.1-blue.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Zod Validation](https://img.shields.io/badge/schema--validation-zod-purple.svg)](https://zod.dev/)
[![AI-Integration](https://img.shields.io/badge/AI--Engine-Claude%203.5-orange.svg)](https://www.anthropic.com/)

A unified, production-grade test automation and AI quality engineering repository. This framework implements six distinct quality assurance phases, scaling from Page Object Model (POM) UI automation and Zod-enforced API contract validation to containerized CI/CD pipelines, AI-driven test stub generation, self-healing element locators, and LLM output quality assurance.

---

## Framework Architecture & CI/CD Flow

```mermaid
graph TD
    A[Code Push / Pull Request] --> B{Trigger CI/CD Pipeline}
    B -- Pull Request --> C[Smoke Tests: Login & Auth UI]
    B -- Push to Main --> D[API Integration Tests: JSONPlaceholder]
    B -- Nightly Cron --> E[Full Regression Suite: UI + API + LLM]
    E --> F[Generate Allure Reports]
    F --> G[Deploy to GitHub Pages]
    C --> H[Check Run Status]
    D --> H
    G --> H
```

---

## Project Modules Catalog

### Phase 1: Foundation — E-Commerce UI POM Framework

The UI automation layer targets the [SauceDemo](https://www.saucedemo.com) store using the Page Object Model (POM) pattern to isolate element selections from assertion assertions.

#### Page Object Models ([ui/pages/](file:///c:/Users/ricar/Desktop/ECommerce/ui/pages/))
*   **[LoginPage](file:///c:/Users/ricar/Desktop/ECommerce/ui/pages/LoginPage.ts)**:
    *   Locators: username, password, login button, and error warning containers.
    *   Methods: `navigate()`, `login(user, pass)`, `getErrorMessage()`, `isErrorVisible()`.
*   **[InventoryPage](file:///c:/Users/ricar/Desktop/ECommerce/ui/pages/InventoryPage.ts)**:
    *   Locators: product items container, sorting drop-down, and active options.
    *   Methods: `addToCart(itemName)`, `removeFromCart(itemName)`, `sortProducts(type)`, `getProductNames()`, `getProductPrices()`, `clickProduct(itemName)`.
*   **[ProductDetailPage](file:///c:/Users/ricar/Desktop/ECommerce/ui/pages/ProductDetailPage.ts)**:
    *   Locators: product name label, description text, price, add-to-cart, remove, and back-to-store buttons.
    *   Methods: `getProductName()`, `getProductDescription()`, `getProductPrice()`, `addToCart()`, `removeFromCart()`, `clickBackToProducts()`.
*   **[CartPage](file:///c:/Users/ricar/Desktop/ECommerce/ui/pages/CartPage.ts)**:
    *   Locators: list of cart item rows, checkout buttons, and continue shopping controls.
    *   Methods: `removeItem(itemName)`, `clickCheckout()`, `clickContinueShopping()`, `getCartItemNames()`, `getCartItemCount()`.
*   **[CheckoutInfoPage](file:///c:/Users/ricar/Desktop/ECommerce/ui/pages/CheckoutInfoPage.ts)**:
    *   Locators: first name, last name, zip code inputs, continue, and cancel buttons.
    *   Methods: `fillInformation(first, last, zip)`, `clickContinue()`, `clickCancel()`, `getErrorMessage()`.
*   **[CheckoutOverviewPage](file:///c:/Users/ricar/Desktop/ECommerce/ui/pages/CheckoutOverviewPage.ts)**:
    *   Locators: item details list, payment subtotal, tax labels, final total, and order finish trigger.
    *   Methods: `clickFinish()`, `clickCancel()`, `getSubtotal()`, `getTax()`, `getTotal()`.
*   **[CheckoutCompletePage](file:///c:/Users/ricar/Desktop/ECommerce/ui/pages/CheckoutCompletePage.ts)**:
    *   Locators: success headers, details text, and back home controls.
    *   Methods: `getSuccessHeader()`, `getSuccessText()`, `clickBackHome()`.
*   **[HeaderComponent](file:///c:/Users/ricar/Desktop/ECommerce/ui/components/HeaderComponent.ts)**:
    *   Locators: cart link icon, badge counter, side menu burger, logout link, and reset application state buttons.
    *   Methods: `getCartCount()`, `clickCart()`, `openMenu()`, `logout()`, `resetAppState()`.

#### Base Test Fixtures & Factories
*   **[base-test.ts](file:///c:/Users/ricar/Desktop/ECommerce/ui/fixtures/base-test.ts)**: Playwright extension custom fixture that instantiates all page POMs automatically, exposing pages (`loginPage`, `inventoryPage`, `cartPage`, `checkoutInfoPage`, `checkoutOverviewPage`, `checkoutCompletePage`, `productDetailPage`) directly to test arguments.
*   **[test-data-factory.ts](file:///c:/Users/ricar/Desktop/ECommerce/utils/test-data-factory.ts)**: Dynamically constructs customer data configurations (`firstName`, `lastName`, `postalCode`) using `@faker-js/faker`. Handles missing field profiles for boundary checks.

#### UI Test Suites ([ui/tests/](file:///c:/Users/ricar/Desktop/ECommerce/ui/tests/))
*   **[login.spec.ts](file:///c:/Users/ricar/Desktop/ECommerce/ui/tests/login.spec.ts)** (9 cases): Validates standard, locked-out, error, performance glitch, and visual user logins. Verifies error states for invalid passwords, missing usernames, and missing passwords.
*   **[inventory.spec.ts](file:///c:/Users/ricar/Desktop/ECommerce/ui/tests/inventory.spec.ts)** (13 cases): Verifies sorting algorithms (Alphabetical A-Z, Z-A, and Prices low-high, high-low). Validates cart badge increments, toggle states of inventory actions, details page navigations, and back-to-inventory navigations.
*   **[cart.spec.ts](file:///c:/Users/ricar/Desktop/ECommerce/ui/tests/cart.spec.ts)** (8 cases): Tests initial empty states, multi-item additions, item deletions, continue-shopping redirections, reload persistence, and resetting app states via sidebar menu.
*   **[checkout.spec.ts](file:///c:/Users/ricar/Desktop/ECommerce/ui/tests/checkout.spec.ts)** (12 cases): Exercises full end-to-end purchasing pipelines for single and multiple items. Confirms step validations for missing fields, subtotal pricing math, tax addition math, cancel buttons, and empty-cart checkout limits.

---

### Phase 2: API Automation Extension

The API automation layer targets the [JSONPlaceholder](https://jsonplaceholder.typicode.com) endpoints. It incorporates contract verification checks and offline authentication mocking.

*   **[user-schema.ts](file:///c:/Users/ricar/Desktop/ECommerce/api/schemas/user-schema.ts)**: Zod contract definitions including `UserSchema` (nested company, address, geo structure), `PostSchema`, `LoginSuccessSchema`, `RegisterSuccessSchema`, and `ErrorResponseSchema`.
*   **[placeholder-client.ts](file:///c:/Users/ricar/Desktop/ECommerce/api/clients/placeholder-client.ts)**: Exposes API handlers for REST operations (`getUsers()`, `getUser(id)`, `createPost(title, body, userId)`, `updatePost(id, title, body, userId)`, `deletePost(id)`). Implements a `MockAPIResponse` class to test authorization loops (`/api/login`, `/api/register`) locally and offline.
*   **[placeholder.spec.ts](file:///c:/Users/ricar/Desktop/ECommerce/api/tests/placeholder.spec.ts)** (11 cases): Verifies schema structure on list requests, single resource fetches, 404 response codes, CRUD operations, registration validation errors, and login token exchanges.

---

### Phase 3: DevOps CI/CD & Containers

*   **GitHub Action Workflows ([.github/workflows/](file:///c:/Users/ricar/Desktop/ECommerce/.github/workflows/))**:
    *   **[smoke-pr.yml](file:///c:/Users/ricar/Desktop/ECommerce/.github/workflows/smoke-pr.yml)**: Fires on pull requests. Runs UI smoke tests (`@login` tagged suites) on a headless Chromium runner.
    *   **[api-on-merge.yml](file:///c:/Users/ricar/Desktop/ECommerce/.github/workflows/api-on-merge.yml)**: Fires on merge pushes to main. Automatically runs the backend schema validations suite.
    *   **[regression-nightly.yml](file:///c:/Users/ricar/Desktop/ECommerce/.github/workflows/regression-nightly.yml)**: Nightly schedule run. Executes the complete suite, compiles Allure HTML reports, and publishes test logs to your `gh-pages` branch.
*   **Containerization**:
    *   **[Dockerfile](file:///c:/Users/ricar/Desktop/ECommerce/Dockerfile)**: Production-ready Node base container featuring dependency installation and playwright runners.
    *   **[.dockerignore](file:///c:/Users/ricar/Desktop/ECommerce/.dockerignore)**: Excludes local reports, caches, and `.env` credentials from container builds.

---

### Phase 4: AI-Powered Test Case Generator

An AI automation tool that converts plain-text feature requirements into structured test cases and executable Playwright POM test stubs.

*   **[generator-cli.ts](file:///c:/Users/ricar/Desktop/ECommerce/ai-generator/generator-cli.ts)**: Command line entry point collecting user prompts and target output paths.
*   **[generator.ts](file:///c:/Users/ricar/Desktop/ECommerce/ai-generator/src/generator.ts)**: Communicates with Claude 3.5 Sonnet using the `@anthropic-ai/sdk` client. Prompts the AI model for structured JSON test steps, falling back to a deterministic offline generation mock when keys are missing.
*   **[template.ts](file:///c:/Users/ricar/Desktop/ECommerce/ai-generator/src/template.ts)**: Takes JSON test cases and compiles them into valid, compilable TypeScript code referencing our base POM fixtures.
*   **Generated Spec**: Running the CLI generates files like **[user-profile.spec.ts](file:///c:/Users/ricar/Desktop/ECommerce/ui/tests/generated/user-profile.spec.ts)** inside your test suite.

---

### Phase 5: Self-Healing Automation

A selector resilience setup designed to recover tests automatically when developers change frontend element properties.

*   **[registry.ts](file:///c:/Users/ricar/Desktop/ECommerce/self-healing/locators/registry.ts)**: Defines locator maps binding unique element keys to prioritizations of fallback selectors (CSS, XPath, Text match, ID).
*   **[self-healing-fixture.ts](file:///c:/Users/ricar/Desktop/ECommerce/self-healing/fixtures/self-healing-fixture.ts)**: Exposes a custom `HealingPage` locator resolver. If a primary selector fails (such as our intentionally broken `[data-test="checkout-broken-non-existent"]` button selector), it intercepts the timeout, cycles through fallbacks, locates the element, prints a detailed warning log, and resumes the test. It includes an AI fallback loop to query Claude for DOM repair suggestions.
*   **[self-healing.spec.ts](file:///c:/Users/ricar/Desktop/ECommerce/self-healing/tests/self-healing.spec.ts)** (1 case): Log validation test that walks through a checkout flow with broken elements to demonstrate self-healing in real-time.

---

### Phase 6: LLM Quality & Security Testing

A dedicated LLM quality assurance testing module targeting AI characteristics.

*   **[llm-client.ts](file:///c:/Users/ricar/Desktop/ECommerce/llm-testing/clients/llm-client.ts)**: Wrapper client querying Claude models, containing fallback hashing for offline testing.
*   **[llm.spec.ts](file:///c:/Users/ricar/Desktop/ECommerce/llm-testing/tests/llm.spec.ts)** (5 cases):
    1.  *Output Schema Compliance*: Queries Claude for data and validates output schema structures against Zod definitions.
    2.  *Hallucination Detection*: Probes with false premise questions and asserts the model rejects the history rather than inventing facts.
    3.  *Prompt Injection Defense*: Appends system rule override instructions and verifies that model safety guidelines are not bypassed.
    4.  *Response Consistency*: Verifies low temperature queries generate identical strings.
    5.  *Response Variation*: Verifies high temperature queries return varied, colorful phrasings.

---

## Installation and Configuration

### 1. Prerequisites
Ensure you have Node.js (version 18 or 20) installed.

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/allantaveras/E-Commerce.git
cd E-Commerce

# Install dependencies
npm install

# Install Playwright browser dependencies
npx playwright install chromium

# Copy the environment file template
cp .env.example .env
```

### 3. Environment Variables (.env)
Create a `.env` file in the root directory:
```ini
BASE_URL=https://www.saucedemo.com
API_BASE_URL=https://jsonplaceholder.typicode.com
ANTHROPIC_API_KEY=your_anthropic_key_here
```

---

## Execution Guide

### Run full regression suite:
```bash
npm run test
```

### Run specific suites:
*   **UI Suite**: `npm run test:ui`
*   **API Suite**: `npm run test:api`
*   **Self-Healing Showcase**: `npm run test:self-healing`
*   **LLM Suite**: `npm run test:llm`

### Run AI Test Generator:
```bash
npm run generate-tests -- --prompt "Add user profile updates" --output "ui/tests/generated/user-profile.spec.ts"
```

### Generate and open Allure report:
```bash
npm run allure:generate
npm run allure:open
```
