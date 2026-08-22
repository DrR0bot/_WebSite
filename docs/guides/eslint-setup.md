# ESLint & Code Quality Setup

## Overview

This project uses a comprehensive ESLint configuration with Prettier for code quality, consistency, and formatting. The setup includes:

- **ESLint 9** with flat config format
- **TypeScript support** with strict rules
- **React and React Hooks** validation
- **Accessibility (a11y)** checks
- **Import/Export** organization
- **Prettier integration** for consistent formatting
- **Git hooks** for automated quality checks

## Installation

All dependencies are already installed. If you need to reinstall:

```bash
npm install --save-dev \
  eslint \
  prettier \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import \
  eslint-plugin-prettier \
  eslint-config-prettier \
  eslint-import-resolver-typescript \
  lint-staged \
  husky
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run lint` | Check for linting errors and warnings |
| `npm run lint:fix` | Fix auto-fixable linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is properly formatted |
| `npm run type-check` | Run TypeScript type checking |

## Configuration Files

### ESLint Config (`eslint.config.js`)

- **React Rules**: Validates JSX, props, and component structure
- **TypeScript Rules**: Type safety and best practices
- **Accessibility Rules**: WCAG compliance checks
- **Import Rules**: Organized imports with proper grouping
- **Custom Rules**: Project-specific patterns

### Prettier Config (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## Key Rules

### TypeScript
- ✅ `@typescript-eslint/no-unused-vars` - Remove unused variables
- ⚠️ `@typescript-eslint/no-explicit-any` - Avoid `any` types
- ✅ `@typescript-eslint/no-var-requires` - Use ES6 imports

### React
- ✅ `react/jsx-key` - Keys in lists required
- ⚠️ `react/display-name` - Components should have display names
- ⚠️ `react/no-unescaped-entities` - Escape HTML entities

### Accessibility
- ✅ `jsx-a11y/alt-text` - Images must have alt text
- ⚠️ `jsx-a11y/click-events-have-key-events` - Keyboard accessibility

### Imports
- ✅ `import/order` - Organized import statements
- ✅ `import/no-duplicates` - No duplicate imports
- ✅ `no-restricted-imports` - Use absolute imports with `@/`

### General
- ✅ `prefer-const` - Use const when possible
- ⚠️ `no-console` - Avoid console statements in production
- ✅ `no-debugger` - No debugger statements

## Git Hooks

### Pre-commit
- Runs `lint-staged` to check only staged files
- Applies ESLint fixes and Prettier formatting
- Prevents commits with linting errors

### Pre-push
- Runs full TypeScript type checking
- Runs full linting on all files
- Prevents pushes with type errors or linting issues

## VS Code Integration

### Recommended Extensions
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- Error Lens (`usernamehw.errorlens`)

### Settings
- Format on save enabled
- Auto-fix ESLint issues on save
- Organize imports on save
- 100-character ruler for line length

## Customization

### Adding New Rules

1. Edit `eslint.config.js`
2. Add rules to the appropriate section
3. Test with `npm run lint`

### Excluding Files

Add patterns to the `ignores` array in `eslint.config.js`:

```javascript
{
  ignores: ['dist/**', 'build/**', 'generated/**']
}
```

### Project-Specific Rules

The configuration includes custom rules for this project:

```javascript
'no-restricted-imports': [
  'error',
  {
    patterns: [
      {
        group: ['../**/components'],
        message: 'Use absolute imports with @/ for components',
      },
    ],
  },
],
```

## Troubleshooting

### Common Issues

1. **Import order errors**: Run `npm run lint:fix` to auto-organize
2. **Prettier conflicts**: ESLint config extends `prettier` to avoid conflicts
3. **TypeScript errors**: Run `npm run type-check` for detailed type errors
4. **Git hooks not working**: Ensure Husky is properly installed

### Disabling Rules

For specific lines:
```typescript
// eslint-disable-next-line rule-name
const something = any;
```

For entire files:
```typescript
/* eslint-disable rule-name */
```

### Performance

If linting is slow:
- Use `--cache` flag: `eslint --cache .`
- Run on specific directories: `eslint src/components/`
- Use VS Code's ESLint extension for real-time feedback

## Hyve-Specific Patterns

### Component Structure
- Use TypeScript interfaces for props
- Export components as named exports
- Use absolute imports with `@/` prefix

### File Organization
```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── layout/      # Layout components
│   └── sections/    # Page sections
├── lib/             # Utilities
└── types/           # Type definitions
```

### Code Style
- Single quotes for strings
- No semicolons
- 2-space indentation
- 100-character line limit
- Trailing commas in ES5 locations

## Contributing

1. All code must pass linting checks
2. Use `npm run format` before committing
3. Fix all TypeScript errors
4. Follow the established import patterns
5. Add accessibility attributes where needed

This setup ensures consistent, high-quality code across the entire Hyve Dynamics project. 