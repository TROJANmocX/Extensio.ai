<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express-4-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-1.5_Flash-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Manifest-V3-FF6D00?logo=googlechrome&logoColor=white" alt="Manifest V3" />
  <img src="https://img.shields.io/github/license/TROJANmocX/Extensio.ai" alt="License" />
</p>

<h1 align="center">Extensio.ai</h1>

<p align="center">
  <strong>AI-powered Chrome Extension Generator</strong><br/>
  Describe what you want in plain English. Extensio builds it in seconds.
</p>

---

## Table of Contents

- [Overview](#overview)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Frontend Components](#frontend-components)
- [Backend Modules](#backend-modules)
- [Security and Validation](#security-and-validation)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [What Has Been Built](#what-has-been-built)
- [Planned Future Changes](#planned-future-changes)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Extensio.ai is a full-stack web platform that generates production-ready Google Chrome extensions from a single natural-language prompt. It uses Google's Gemini 1.5 Flash model to interpret the user's description, produce all required extension files (manifest, scripts, popup UI, styles), validate them against Manifest V3 security rules, and package them as a downloadable ZIP archive.

The platform is split into two independent services managed through npm workspaces:

| Service | Role | Port |
|---|---|---|
| **Frontend** | Next.js 16 application serving the landing page, prompt input, code workspace, and live extension simulator | `3000` |
| **Backend** | Express 4 API handling Gemini AI calls, file validation, modification requests, and ZIP compilation | `5000` |

When no Gemini API key is configured, the backend falls back to built-in mock templates so the full UI can be demonstrated without any external dependency.

---

## How It Works

The workflow follows four stages:

| Stage | Description |
|---|---|
| **1. Prompt** | The user types a natural-language description of the desired Chrome extension into the Hero section input field. |
| **2. Generate** | The frontend sends the prompt to `POST /api/generate`. The backend forwards it to Gemini 1.5 Flash with a strict system prompt enforcing Manifest V3 output. Gemini returns a JSON mapping of filenames to file contents. |
| **3. Review** | The generated files appear in the Developer Workspace. A tabbed code editor displays every file. A simulated Chrome browser preview renders the popup HTML live. Validation results (errors, warnings) are shown inline. |
| **4. Download** | The user clicks Download. The frontend sends the file map to `POST /api/download`. The backend writes the files to a temporary directory, compresses them with `archiver`, and streams the ZIP buffer back. The temp directory is cleaned up automatically. |

Users can also iteratively modify the generated extension by typing follow-up instructions. The backend sends the current file map plus the edit request back to Gemini, which returns updated files.

---

## Architecture

```
                          +-------------------+
                          |   Google Gemini   |
                          |   1.5 Flash API   |
                          +--------+----------+
                                   |
                                   | HTTPS (JSON)
                                   |
+------------------+       +-------v----------+
|   Next.js 16     |  HTTP |   Express 4      |
|   Frontend       +-------> Backend API      |
|   (React 19)     | :5000 |   (TypeScript)   |
|   port 3000      <-------+                  |
+------------------+  JSON +------------------+
        |                         |
        |  Renders:               |  Handles:
        |  - Landing page         |  - /api/generate
        |  - Code workspace       |  - /api/modify
        |  - Live simulator       |  - /api/download
        |  - Loading terminal     |  - /health
        |                         |
        v                         v
   User Browser             Temp ZIP files
                            (auto-cleaned)
```

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend Framework | Next.js (App Router) | 16.2.6 | Server and client rendering, routing |
| UI Library | React | 19.2.4 | Component-based user interface |
| Styling | TailwindCSS | 4.x | Utility-first CSS framework |
| Animations | Framer Motion | 12.x | Page transitions, micro-animations |
| Icons | Lucide React | 1.16.x | SVG icon components |
| Backend Framework | Express | 4.19.x | REST API server |
| AI Model | Google Gemini 1.5 Flash | v1beta | Extension code generation |
| ZIP Compilation | Archiver | 6.x | In-memory ZIP buffer creation |
| Language | TypeScript | 5.x | Type safety across both services |
| Dev Runner | tsx | 4.x | TypeScript execution without pre-compilation |
| Monorepo | npm Workspaces | native | Shared dependency management |
| Concurrency | concurrently | 8.x | Parallel dev server execution |
| Containerisation | Docker + Docker Compose | - | Production deployment |

---

## Project Structure

```
extensio.ai/
|
+-- package.json                 # Monorepo workspace root with dev scripts
+-- package-lock.json            # Lockfile for root dependencies
+-- docker-compose.yml           # Container orchestration for both services
+-- .gitignore                   # Git exclusion rules
+-- README.md                    # This file
+-- LICENSE                      # MIT License
+-- CONTRIBUTING.md              # Contribution guidelines
|
+-- frontend/                    # Next.js 16 application
|   +-- app/
|   |   +-- layout.tsx           # Root layout with metadata and fonts
|   |   +-- page.tsx             # Main page: state machine (landing / workspace)
|   |   +-- globals.css          # Global styles, grid backdrop, glassmorphism
|   |   +-- favicon.ico          # Site favicon
|   +-- components/
|   |   +-- Navbar.tsx           # Top navigation bar with branding and links
|   |   +-- Hero.tsx             # Landing hero section with prompt input
|   |   +-- Features.tsx         # Feature showcase cards
|   |   +-- Pricing.tsx          # Pricing tier cards
|   |   +-- Footer.tsx           # Site footer
|   |   +-- Workspace.tsx        # Tabbed code editor, validation panel, modify input
|   |   +-- Simulator.tsx        # Simulated Chrome browser rendering popup HTML
|   +-- public/                  # Static SVG assets
|   +-- Dockerfile               # Frontend container build
|   +-- package.json             # Frontend dependencies
|   +-- next.config.ts           # Next.js configuration
|   +-- tsconfig.json            # TypeScript configuration
|   +-- eslint.config.mjs        # ESLint configuration
|   +-- postcss.config.mjs       # PostCSS + TailwindCSS plugin
|
+-- backend/                     # Express API server
    +-- src/
    |   +-- index.ts             # Server entry point, CORS, health check, router mount
    |   +-- routes/
    |   |   +-- generate.ts      # Route handlers: generate, modify, download
    |   +-- services/
    |   |   +-- gemini.ts        # Gemini API integration, system prompt, fallback mocks
    |   +-- generators/
    |   |   +-- zipper.ts        # ZIP archive creation and temp directory management
    |   +-- utils/
    |       +-- validator.ts     # Manifest V3 validation and security scanning
    |       +-- sanitize.ts      # JSON extraction and cleanup from Gemini responses
    +-- .env.example             # Environment variable template
    +-- Dockerfile               # Backend container build
    +-- package.json             # Backend dependencies
    +-- tsconfig.json            # TypeScript configuration
```

---

## API Endpoints

All endpoints are prefixed with `/api` and mounted on port `5000`.

| Method | Path | Request Body | Response | Description |
|---|---|---|---|---|
| `POST` | `/api/generate` | `{ "prompt": string }` | `{ success, files, validation }` | Generates a complete Chrome extension from the prompt. Returns a file map and validation results. |
| `POST` | `/api/modify` | `{ "files": Record<string,string>, "editRequest": string }` | `{ success, files, validation }` | Modifies an existing file set based on follow-up instructions. |
| `POST` | `/api/download` | `{ "files": Record<string,string>, "name": string }` | Binary ZIP stream | Compiles files into a `.zip` archive and streams it for download. |
| `GET` | `/health` | - | `{ status, timestamp }` | Health check endpoint for monitoring. |

### Validation Response Shape

```json
{
  "isValid": true,
  "errors": [],
  "warnings": ["Extension requests powerful permission: 'webNavigation'. Verify need."]
}
```

---

## Frontend Components

| Component | File | Responsibility |
|---|---|---|
| **Navbar** | `components/Navbar.tsx` | Fixed top bar with Extensio branding, navigation links (Features, Pricing, Docs), GitHub link, and Dashboard toggle button. |
| **Hero** | `components/Hero.tsx` | Landing section with headline, subtext, animated gradient prompt input field, and generate button. Passes prompt upstream on submission. |
| **Features** | `components/Features.tsx` | Grid of feature cards describing platform capabilities (AI generation, live preview, validation, one-click download). |
| **Pricing** | `components/Pricing.tsx` | Three-tier pricing card layout (Free, Pro, Enterprise) with feature comparison lists. |
| **Footer** | `components/Footer.tsx` | Minimal footer with copyright and links. |
| **Workspace** | `components/Workspace.tsx` | Developer dashboard containing: file explorer sidebar, tabbed code viewer with syntax-highlighted file contents, inline validation error/warning display, modification prompt input for iterative edits, and download button. |
| **Simulator** | `components/Simulator.tsx` | High-fidelity Chrome browser frame that renders the generated `popup.html` and `styles.css` inside a sandboxed iframe using `srcdoc`, giving the user a live preview of their extension popup. |

### Page State Machine

The main `page.tsx` manages a two-state view:

| State | View | Trigger |
|---|---|---|
| `landing` | Hero, Features, Pricing, Footer | Default on load, or clicking "Back to Landing" |
| `workspace` | Workspace + Simulator side-by-side | After successful generation, or clicking Dashboard button |

A full-screen loading overlay with a simulated terminal log stream appears during generation and modification requests.

---

## Backend Modules

### Gemini Service (`services/gemini.ts`)

| Function | Parameters | Returns | Description |
|---|---|---|---|
| `generateExtensionFromPrompt` | `prompt: string` | `Record<string,string>` | Sends the prompt to Gemini with a system instruction enforcing Manifest V3 JSON output. Falls back to mock templates if no API key is set or on error. |
| `editExtensionFromPrompt` | `currentFiles, editRequest` | `Record<string,string>` | Sends current files plus the edit instruction to Gemini. Falls back to local string-replacement simulation on failure. |

The system prompt enforces:
- Manifest V3 only (`"manifest_version": 3`)
- Complete, working code with no placeholders
- Service workers for background scripts (no background pages)
- No external CDN scripts (Manifest V3 security requirement)
- Dark-themed, responsive popup UI

### Fallback Mock Templates

When no API key is available, the service provides two pre-built templates based on keyword matching:

| Keywords in Prompt | Mock Template |
|---|---|
| `youtube`, `comment` | YouTube Comment Shield -- hides YouTube comment sections with a toggle |
| `ad`, `block` | Extensio Ad Blocker -- simulated ad blocking toggle with counter display |
| Other | Generic extension with trigger button and basic popup |

### Validator (`utils/validator.ts`)

Runs automated security and compliance checks on generated files:

| Check | Severity | Rule |
|---|---|---|
| `manifest.json` missing | Error | File must exist |
| `manifest_version` not 3 | Error | Only Manifest V3 is accepted |
| `unsafe-eval` in CSP | Error | Dynamic code execution is banned |
| HTTP URLs in CSP | Error | Insecure protocols are blocked |
| `background.page` present | Error | Must use `service_worker` in V3 |
| `eval()` or `new Function()` in scripts | Error | Dynamic code execution is banned |
| Invasive permissions (`debugger`, `proxy`, `vpnProvider`, `webNavigation`) | Warning | Flagged for manual review |
| Dynamic script tag with external URL | Warning | May be blocked by V3 |

### Zipper (`generators/zipper.ts`)

| Function | Description |
|---|---|
| `zipExtensionFiles` | Writes file map to a unique temp directory, archives it with `archiver` at max compression (zlib level 9), returns the ZIP buffer. Path traversal is sanitised using `path.normalize`. |
| `cleanupTempDir` | Removes the temp directory after the response is sent (deferred by 2 seconds). |

### Sanitizer (`utils/sanitize.ts`)

Handles edge cases in Gemini's output:
- Strips markdown code block wrappers (` ```json ... ``` `)
- Falls back to brace extraction (`{...}`) if standard parsing fails
- Throws descriptive errors with the raw text for debugging

---

## Security and Validation

| Concern | Mitigation |
|---|---|
| Manifest V3 compliance | System prompt enforces V3; validator rejects non-V3 manifests |
| Dynamic code execution | `eval()` and `new Function()` are detected and rejected in all `.js`/`.ts` files |
| Content Security Policy | `unsafe-eval` and HTTP URLs in CSP directives are flagged as errors |
| External script injection | CDN/remote script loading is banned by the system prompt and flagged by the validator |
| Path traversal in ZIP | Filenames are normalised and `../` sequences are stripped before writing to disk |
| Temp file cleanup | Temporary directories are automatically deleted after ZIP compilation |
| CORS | Development mode allows all origins; production should be locked to the frontend origin |
| Request size limits | Body parser is capped at 15 MB to prevent abuse |

---

## Getting Started

### Prerequisites

| Requirement | Minimum Version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| Google Gemini API Key | Optional (mock fallback available) |

### Installation

```bash
# Clone the repository
git clone https://github.com/TROJANmocX/Extensio.ai.git
cd Extensio.ai

# Install all dependencies (both frontend and backend via workspaces)
npm install

# Configure the backend environment
cp backend/.env.example backend/.env
# Open backend/.env and set your GEMINI_API_KEY (or leave blank for offline mock mode)

# Start both development servers
npm run dev
```

The frontend is accessible at `http://localhost:3000` and the backend API at `http://localhost:5000`.

---

## Available Scripts

Run these from the project root directory.

| Command | Description |
|---|---|
| `npm run dev` | Starts both frontend and backend in parallel using `concurrently` |
| `npm run dev:frontend` | Starts only the Next.js frontend dev server |
| `npm run dev:backend` | Starts only the Express backend dev server with hot reload (`tsx watch`) |
| `npm run build` | Builds both frontend (`next build`) and backend (`tsc`) for production |
| `npm run build:frontend` | Builds only the frontend |
| `npm run build:backend` | Builds only the backend |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5000` | Port the Express server listens on |
| `GEMINI_API_KEY` | No | - | Google Gemini API key. When absent, the server uses built-in mock templates. Get a key at [Google AI Studio](https://aistudio.google.com/). |

### Frontend (via Docker Compose)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend API URL injected at build time for container deployments |

---

## Docker Deployment

A `docker-compose.yml` is provided for container-based deployment.

```bash
# Set your API key as an environment variable
export GEMINI_API_KEY=your_key_here

# Build and start both services
docker compose up --build
```

| Service | Container Name | Exposed Port |
|---|---|---|
| Backend | `extensio-backend` | `5000` |
| Frontend | `extensio-frontend` | `3000` |

The backend container mounts `./backend/temp` as a volume for temporary ZIP compilation files.

---

## What Has Been Built

This section documents all completed work as of the current version.

### Frontend

| Feature | Status | Details |
|---|---|---|
| Landing page | Complete | Hero section with animated gradient prompt input, feature cards, pricing tiers, footer |
| Dark glassmorphic UI | Complete | Custom CSS with glass panels, mesh grid backdrop, gradient accents, smooth transitions |
| Prompt-based generation | Complete | User types a description, hits generate, extension files are created via API |
| Developer Workspace | Complete | Tabbed code editor showing all generated files with file-type icons and syntax display |
| File explorer sidebar | Complete | Lists all generated files with appropriate icons (JSON, HTML, CSS, JS, TS) |
| Validation display | Complete | Inline error and warning badges with expandable details from the backend validator |
| Iterative modification | Complete | Text input for follow-up instructions; sends current files + edit request to the modify API |
| Live simulator | Complete | Chrome browser frame rendering popup.html in a sandboxed iframe with srcdoc |
| Loading terminal | Complete | Full-screen overlay with animated log stream simulating a build process |
| One-click download | Complete | Downloads the extension as a ZIP via the backend download endpoint |
| Responsive layout | Complete | Works across desktop and tablet viewports |
| Framer Motion animations | Complete | Page transitions, component mount animations, hover effects |

### Backend

| Feature | Status | Details |
|---|---|---|
| Gemini AI generation | Complete | Sends structured prompts to Gemini 1.5 Flash with Manifest V3 system instructions |
| Gemini AI modification | Complete | Sends current files + edit instructions for iterative updates |
| Mock fallback system | Complete | Two pre-built templates (YouTube Comment Shield, Ad Blocker) plus a generic fallback |
| Manifest V3 validation | Complete | Checks manifest structure, permissions, CSP, background script configuration |
| Script security scanning | Complete | Detects eval(), new Function(), and dynamic external script injection |
| ZIP compilation | Complete | Archives file maps into downloadable ZIP buffers with max compression |
| Temp directory management | Complete | Auto-cleanup of temporary files after download |
| JSON sanitisation | Complete | Strips markdown wrappers, handles malformed Gemini output with brace extraction |
| Health check endpoint | Complete | GET /health returns server status and timestamp |
| CORS configuration | Complete | Open in development; ready for production lockdown |
| Error handling | Complete | Global error middleware with structured JSON error responses |

### DevOps

| Feature | Status | Details |
|---|---|---|
| npm Workspaces | Complete | Monorepo with shared dependency management |
| Concurrent dev servers | Complete | Both services start with a single `npm run dev` command |
| Docker containers | Complete | Individual Dockerfiles for frontend and backend |
| Docker Compose | Complete | Single-command deployment with environment variable injection |
| Git repository | Complete | Hosted on GitHub with .gitignore, LICENSE, and CONTRIBUTING.md |

---

## Planned Future Changes

The following features and improvements are under consideration for future development.

### High Priority

| Change | Description | Impact |
|---|---|---|
| User authentication | Add sign-up/login with OAuth (Google, GitHub) to save generated extensions to user accounts | Enables persistent project history |
| Database integration | Add PostgreSQL or MongoDB to store generated extensions, user profiles, and generation history | Required for authentication and project persistence |
| Extension versioning | Track multiple versions of each generated extension with diff comparison | Lets users revert to previous generations |
| Rate limiting | Add express-rate-limit middleware to prevent API abuse | Protects Gemini API quota and server resources |
| Production CORS lockdown | Restrict CORS origin to the deployed frontend domain instead of wildcard `*` | Security hardening |

### Medium Priority

| Change | Description | Impact |
|---|---|---|
| Streaming generation | Use Gemini's streaming API to show file contents as they are generated in real time | Faster perceived performance |
| Syntax highlighting | Integrate a code editor like Monaco or CodeMirror for proper syntax highlighting in the Workspace | Better developer experience |
| Extension icon generation | Use an image generation model to create custom icons for each extension | More polished output |
| Template gallery | Pre-built extension templates (ad blocker, dark mode, productivity timer) users can start from | Faster onboarding |
| Multi-model support | Add support for alternative LLMs (Claude, GPT-4o) as generation backends | Flexibility and redundancy |

### Lower Priority

| Change | Description | Impact |
|---|---|---|
| Chrome Web Store publishing | Automate packaging and submission to the Chrome Web Store via the CWS API | End-to-end deployment pipeline |
| Extension testing framework | Generate and run automated tests for the produced extension code | Higher quality output |
| Collaborative editing | Real-time multi-user editing of generated extensions via WebSockets | Team workflows |
| Analytics dashboard | Track generation counts, popular prompt categories, error rates | Product insights |
| Internationalisation (i18n) | Multi-language support for the UI and generated extension content | Broader user base |
| CI/CD pipeline | GitHub Actions for automated testing, linting, and deployment | Development velocity |
| Mobile responsive workspace | Adapt the code editor and simulator for mobile viewports | Full mobile support |

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on reporting bugs, suggesting features, and submitting pull requests.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for the full text.

---

<p align="center">
  Built by <a href="https://github.com/TROJANmocX">TROJANmocX</a>
</p>