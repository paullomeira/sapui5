# Development Guide

## Code Quality Tools

This project uses ESLint and Prettier to maintain code quality and consistent formatting.

### ESLint Configuration

ESLint is configured with UI5-specific rules and best practices:

- **Configuration file**: `.eslintrc.js`
- **Rules**: Includes UI5 best practices, JavaScript best practices, and code style rules
- **Integration**: Works seamlessly with Prettier to avoid conflicts

### Prettier Configuration

Prettier handles automatic code formatting:

- **Configuration file**: `.prettierrc`
- **Ignore file**: `.prettierignore`
- **Settings**: 2-space indentation, double quotes, semicolons, no trailing commas

## Available Scripts

### Linting
```bash
# Run ESLint to check for code issues
npm run lint

# Run ESLint and automatically fix issues
npm run lint:fix
```

### Formatting
```bash
# Format all JavaScript and JSON files
npm run format

# Check if files are properly formatted
npm run format:check
```

### Combined
```bash
# Format code and then run linting
npm run lint:format

# Pre-commit check (format + lint)
npm run precommit
```

## IDE Integration

### VS Code

Install the following extensions for the best development experience:

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier - Code formatter** (`esbenp.prettier-vscode`)

#### VS Code Settings

Add these settings to your VS Code workspace or user settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript"],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Other IDEs

Most modern IDEs support ESLint and Prettier plugins. Check your IDE's extension marketplace for:
- ESLint integration
- Prettier integration
- Format on save functionality

## Pre-commit Workflow

Before committing code, run:

```bash
npm run precommit
```

This will:
1. Format all code with Prettier
2. Run ESLint to check for issues
3. Ensure code quality standards are met

## Troubleshooting

### ESLint Errors

If you encounter ESLint errors:

1. Try running `npm run lint:fix` to automatically fix issues
2. For remaining issues, fix them manually following the error messages
3. If you need to disable a rule for a specific line, use:
   ```javascript
   // eslint-disable-next-line rule-name
   ```

### Prettier Conflicts

If Prettier and ESLint seem to conflict:

1. Make sure you have the latest versions installed
2. The configuration is set up to avoid conflicts
3. Run `npm run format` first, then `npm run lint`

### Performance

For better performance during development:

1. Configure your IDE to run ESLint and Prettier only on save
2. Use `npm run format:check` to verify formatting without changing files
3. Consider using ESLint and Prettier IDE extensions for real-time feedback

## Configuration Details

### ESLint Rules

Key rules enforced:
- No deprecated UI5 APIs
- Consistent variable declarations (`const`/`let` over `var`)
- Proper error handling
- No unused variables
- Consistent function declarations

### Prettier Settings

Key formatting rules:
- 2-space indentation
- Double quotes for strings
- Semicolons required
- No trailing commas
- Line width: 120 characters
- LF line endings

## Contributing

When contributing to this project:

1. Ensure your code passes all linting checks
2. Format your code with Prettier
3. Run `npm run precommit` before submitting
4. Follow the existing code style and patterns