module.exports = {
  env: {
    browser: true,
    es2021: true,
    qunit: true
  },
  extends: [
    "eslint:recommended",
    "prettier"
  ],
  plugins: [
    "ui5"
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module"
  },
  globals: {
    sap: "readonly",
    jQuery: "readonly"
  },
  rules: {
    // UI5 specific rules (commented out until we verify available rules)
    // "ui5/no-deprecated-api": "error",
    // "ui5/no-global-jquery": "warn",
    // "ui5/no-legacy-jquery": "warn",
    // "ui5/no-sync-calls": "error",
    
    // General JavaScript best practices
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "warn",
    "arrow-spacing": "error",
    
    // Code style (handled by Prettier)
    // Most formatting rules are disabled in favor of Prettier
    
    // Best practices for UI5
    "no-implicit-globals": "error",
    "strict": ["error", "function"],
    "consistent-return": "error",
    "curly": "error",
    "eqeqeq": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-script-url": "error",
    "no-self-compare": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-unmodified-loop-condition": "error",
    "no-unused-expressions": "error",
    "no-useless-call": "error",
    "no-useless-concat": "error",
    "radix": "error",
    "wrap-iife": "error",
    "yoda": "error"
  },
  overrides: [
    {
      // Specific rules for test files
      files: ["**/test/**/*.js", "**/*.test.js", "**/*.spec.js"],
      env: {
        qunit: true
      },
      globals: {
        sinon: "readonly",
        QUnit: "readonly"
      },
      rules: {
        "no-console": "off",
        "strict": "off",
        "prefer-arrow-callback": "off",
        "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
      }
    },
    {
      // Specific rules for configuration files
      files: [".eslintrc.js", "karma.conf.js", "wdio.conf.js"],
      env: {
        node: true
      },
      rules: {
        "no-console": "off"
      }
    }
  ]
};