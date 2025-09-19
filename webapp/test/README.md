# Testing Guide

This directory contains unit and integration tests for the SapUI5 Template application.

## Test Structure

```
test/
├── unit/                          # Unit tests
│   ├── controller/               # Controller tests
│   │   ├── BaseController.js     # BaseController unit tests
│   │   ├── EmployeeList.controller.js  # EmployeeList controller tests
│   │   └── EmployeeDetail.controller.js # EmployeeDetail controller tests
│   ├── model/                    # Model tests
│   │   └── formatter.js          # Formatter function tests
│   ├── AllTests.js               # Test suite loader
│   ├── testsuite.qunit.js        # QUnit test suite configuration
│   ├── unitTests.qunit.html      # HTML test runner
│   └── runTests.js               # Programmatic test runner
├── integration/                  # Integration tests (OPA5)
└── README.md                     # This file
```

## Running Unit Tests

### Option 1: Browser-based Testing (Recommended)

1. Start the development server:
   ```bash
   npm start
   ```

2. Open the test runner in your browser:
   ```
   http://localhost:8080/test/unit/unitTests.qunit.html
   ```

3. The tests will run automatically and display results in the browser.

### Option 2: Command Line Testing

The project is configured with Karma for automated testing, but requires Chrome to be installed:

```bash
npm run test:unit
```

If Chrome is not available, use the browser-based approach above.

## Test Framework

- **QUnit**: JavaScript unit testing framework
- **Sinon**: Mocking and stubbing library for JavaScript
- **Karma**: Test runner for automated testing (optional)

## Writing Tests

### Controller Tests

Controller tests should:
- Mock all dependencies (views, models, components)
- Test public methods and their behavior
- Verify correct interaction with UI5 framework components
- Use Sinon for mocking and stubbing

Example:
```javascript
QUnit.test("method should do something", function (assert) {
  // Arrange
  const oMockModel = new JSONModel();
  sinon.stub(this.oController, "getModel").returns(oMockModel);

  // Act
  this.oController.someMethod();

  // Assert
  assert.ok(this.oController.getModel.called, "getModel was called");
});
```

### Model Tests

Model tests should:
- Test formatter functions with various inputs
- Verify data transformation logic
- Test edge cases and error conditions

### Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Mock external dependencies to focus on the unit being tested
3. **Coverage**: Test both happy path and error scenarios
4. **Cleanup**: Always clean up mocks and stubs in afterEach hooks
5. **Descriptive Names**: Use clear, descriptive test names that explain what is being tested

## Test Coverage

The tests cover:
- ✅ BaseController utility methods
- ✅ EmployeeList controller functionality
- ✅ EmployeeDetail controller functionality
- ✅ Formatter functions
- ⏳ EmployeeForm controller (to be implemented)
- ⏳ Custom controls (to be implemented)

## Continuous Integration

For CI/CD environments, ensure:
1. Chrome or Chromium is available for Karma tests
2. Set `CHROME_BIN` environment variable if needed
3. Use headless mode for automated testing

## Troubleshooting

### Common Issues

1. **Chrome not found**: Install Chrome or use browser-based testing
2. **Module loading errors**: Check that all dependencies are properly defined
3. **Sinon not defined**: Ensure test files are loaded with proper QUnit setup

### Debug Mode

To debug tests:
1. Open browser developer tools
2. Set breakpoints in test files
3. Refresh the test page
4. Step through test execution