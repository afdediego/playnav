# Contributing to PlayNav

Thank you for your interest in contributing to PlayNav! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/playnav.git
   cd playnav
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 💻 Development Workflow

### Running the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Code Quality

Before submitting a pull request, ensure your code passes all checks:

```bash
# Lint your code
npm run lint

# Format your code
npm run format

# Run tests
npm test

# Type checking
npm run type-check
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting
- Place tests in `__tests__/` directory
- Use descriptive test names

Example:
```typescript
describe('Feature Name', () => {
  it('should do something specific', () => {
    // Test implementation
  });
});
```

## 📝 Commit Guidelines

We follow conventional commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```bash
git commit -m "feat: add power-up system"
git commit -m "fix: resolve collision detection bug"
git commit -m "docs: update README with new controls"
```

## 🎯 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all checks pass**:
   - Linting
   - Tests
   - Type checking
   - Build succeeds
4. **Write a clear PR description**:
   - What changes were made
   - Why the changes were made
   - How to test the changes
5. **Link related issues** if applicable
6. **Request review** from maintainers

### PR Title Format

Use conventional commit format for PR titles:
```
feat: add power-up system
fix: resolve enemy collision bug
docs: improve installation instructions
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - Browser and version
   - Operating system
   - Device (if mobile)
6. **Screenshots**: If applicable
7. **Console Errors**: Any error messages

## 💡 Feature Requests

When suggesting features:

1. **Use Case**: Explain why this feature would be useful
2. **Description**: Describe the feature in detail
3. **Mockups**: Include mockups/wireframes if possible
4. **Alternatives**: Mention alternative solutions you've considered

## 🎨 Code Style

- Use **TypeScript** for all new code
- Follow the existing code style
- Use **meaningful variable names**
- Add **JSDoc comments** for public APIs
- Keep functions **small and focused**
- Avoid **magic numbers** (use constants)

### Example:
```typescript
/**
 * Calculate the distance between two points
 * @param a First point
 * @param b Second point
 * @returns Distance in pixels
 */
export function distance(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
```

## 📁 Project Structure

Please maintain the existing project structure:

```
playnav/
├── app/              # Next.js pages
├── components/       # React components
├── game/            # Game logic
│   ├── engine/      # Core engine
│   ├── entities/    # Game entities
│   └── state/       # State management
├── hooks/           # Custom hooks
└── __tests__/       # Test files
```

## 🔍 Areas for Contribution

We welcome contributions in these areas:

### High Priority
- 🐛 Bug fixes
- 📱 Mobile optimization
- ♿ Accessibility improvements
- 🧪 Test coverage

### Medium Priority
- 🎨 Visual enhancements
- 🔊 Additional sound effects
- 🎮 New game features
- 📚 Documentation improvements

### Nice to Have
- 🌐 Internationalization (i18n)
- 🏆 Leaderboard system
- 🎯 Achievements system
- 🎨 Theme customization

## ❓ Questions?

Feel free to:
- Open an issue for questions
- Join discussions in existing issues
- Reach out to maintainers

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to PlayNav! 🚀


