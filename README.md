# E-Commerce Test Automation & AI Testing Framework

A unified, production-grade test automation and AI validation repository built from scratch. This framework scales from modular UI page objects and API contract testing to containerized CI/CD, AI-driven test stub generation, self-healing element locators, and LLM output quality assurance.

## 🏗️ Framework Architecture (6-Phase Roadmap)

### [Phase 1: Foundation — E-Commerce UI POM Framework](file:///c:/Users/ricar/Desktop/ECommerce/ui)
*   **Target Site**: [SauceDemo](https://www.saucedemo.com)
*   **Design Pattern**: Page Object Model (POM) separating locator selectors from script steps. Exposes a clean navigation header component and modular page classes.
*   **Test Data**: Dynamic customer generation using `@faker-js/faker` wrapped in a centralized [test-data-factory.ts](file:///c:/Users/ricar/Desktop/ECommerce/utils/test-data-factory.ts).
*   **Fixtures**: Extended base Playwright fixture instantiating all pages automatically to eliminate boilerplate.

### [Phase 2: API Automation Extension](file:///c:/Users/ricar/Desktop/ECommerce/api)
*   **Target Site**: [JSONPlaceholder API](https://jsonplaceholder.typicode.com)
*   **Validation**: Uses `zod` schema definitions to validate nested JSON fields and enforce API contracts.
*   **Authentication Mocks**: Intercepts authentication and registration requests offline inside [placeholder-client.ts](file:///c:/Users/ricar/Desktop/ECommerce/api/clients/placeholder-client.ts) to verify auth workflows without external key dependencies.

### [Phase 3: DevOps CI/CD & Containers](file:///c:/Users/ricar/Desktop/ECommerce/.github/workflows)
*   **GitHub Actions**: 
    *   PR triggers: Run smoke authentication suites.
    *   On-merge to main: Run backend integration API suites.
    *   Nightly schedule: Run full regressions and auto-deploy Allure Reports to GitHub Pages.
*   **Dockerization**: [Dockerfile](file:///c:/Users/ricar/Desktop/ECommerce/Dockerfile) defined using official Playwright Ubuntu base image to guarantee reproducible runs anywhere.

### [Phase 4: AI-Powered Test Case Generator](file:///c:/Users/ricar/Desktop/ECommerce/ai-generator)
*   **CLI Interface**: Feed a prompt explaining a feature to generate structured JSON scenarios via Claude 3.5 Sonnet, which are then compiled into compilable Playwright POM test stubs.
*   **Command**: `npm run generate-tests -- --prompt "Add user profile updates" --output "ui/tests/generated/user-profile.spec.ts"`

### [Phase 5: Advanced — Self-Healing Automation](file:///c:/Users/ricar/Desktop/ECommerce/self-healing)
*   **Concept**: Locator registry mapping element IDs to lists of alternative selectors. If a primary selector breaks, the custom fixture intercepts the timeout, attempts fallbacks in order, logs warnings to the console, and continues.
*   **AI Healing**: Falls back to Anthropic's Claude to analyze page source and suggest active selectors in real-time if all static fallbacks fail.

### [Phase 6: Cutting Edge — LLM Quality & Security Testing](file:///c:/Users/ricar/Desktop/ECommerce/llm-testing)
*   **Coverage**: A dedicated test suite evaluating LLM API characteristics:
    *   *Schema compliance* checking output format using Zod.
    *   *Hallucination detection* checking rejection of false facts.
    *   *Prompt injection defense* validating resistance to system overrides.
    *   *Consistency* asserting determinism at low temperature vs variety at high temperature.

---

## 🛠️ Installation & Setup

1. **Clone the Repository** and navigate to workspace:
    ```bash
    git clone <your-repo-url>
    cd ECommerce
    ```
2. **Install Node dependencies**:
    ```bash
    npm install
    ```
3. **Install Chromium browser binary**:
    ```bash
    npx playwright install chromium
    ```
4. **Setup Environment Configurations**:
    Copy `.env.example` to `.env` and fill in parameters:
    ```bash
    cp .env.example .env
    ```

---

## 🚀 Running Tests

### Execute the complete suite:
```bash
npm run test
```

### Run specific suites by tag:
*   **UI Test Suite only**:
    ```bash
    npm run test:ui
    ```
*   **API Test Suite only**:
    ```bash
    npm run test:api
    ```
*   **Self-Healing Showcase**:
    ```bash
    npm run test:self-healing
    ```
*   **LLM Testing Suite**:
    ```bash
    npm run test:llm
    ```

---

## 📊 Generating Reports

We use **Allure Report** to compile test runs into HTML dashboards.

1. **Generate Allure HTML report**:
    ```bash
    npm run allure:generate
    ```
2. **Launch report locally**:
    ```bash
    npm run allure:open
    ```

---

## 🔒 Pull Request Smoke Verification

Every pull request targeting the `main` branch automatically triggers the smoke test pipeline defined in `.github/workflows/smoke-pr.yml` to verify authentication security and core UI flows prior to merge.

