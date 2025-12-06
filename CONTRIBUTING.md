# Contributing to AI Incident Support Copilot

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ai-incident-support-copilot.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit with clear messages: `git commit -m "Add: feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

See [docs/setup/GETTING_STARTED.md](docs/setup/GETTING_STARTED.md) for detailed setup instructions.

Quick start:
```bash
./start.sh  # Mac/Linux
start.bat   # Windows
```

## Code Style

### Frontend
- Use TypeScript for all new code
- Follow the existing component structure (atoms/molecules/organisms)
- Use Tailwind CSS for styling
- Run linter before committing: `npm run lint`
- Format code: `npm run format`

### Backend
- Follow PEP 8 style guide
- Use type hints for all functions
- Format with Black: `black .`
- Sort imports with isort: `isort .`

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

All tests must pass before submitting a PR.

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add: new feature or functionality`
- `Fix: bug fix`
- `Update: changes to existing functionality`
- `Refactor: code restructuring without behavior change`
- `Docs: documentation changes`
- `Test: adding or updating tests`
- `Style: formatting, missing semicolons, etc.`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update the README.md if needed
5. Request review from maintainers

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Questions?

Open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
