# Contributing to Extensio.ai

Thank you for your interest in contributing! 🎉

## How to Contribute

### Reporting Bugs

- Use the [GitHub Issues](https://github.com/TROJANmocX/Extensio.ai/issues) page
- Include steps to reproduce, expected vs actual behaviour, and screenshots if relevant
- Tag the issue with `bug`

### Suggesting Features

- Open an issue tagged with `enhancement`
- Describe the use case and the expected behaviour

### Submitting Code

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Make your changes** — keep commits small and focused
6. **Test locally**:
   ```bash
   npm run dev
   ```
7. **Push** your branch and open a **Pull Request** against `main`

## Code Style

- **TypeScript** for all source files (frontend and backend)
- Use **ESLint** — run `npm run lint` in `frontend/` before submitting
- Prefer functional React components with hooks
- Use meaningful component and variable names

## Project Structure

| Directory | Purpose |
|---|---|
| `frontend/` | Next.js 16 app (React 19 + TailwindCSS) |
| `backend/` | Express API with Gemini AI integration |
| Root `package.json` | npm workspace orchestration |

## Need Help?

Open an issue or start a [Discussion](https://github.com/TROJANmocX/Extensio.ai/discussions) — we're happy to help!
