# Integration Tests

This folder contains OPA5 (One Page Acceptance) integration tests for the SapUI5 Template application.

## Structure

- `opaTests.qunit.html` - Main test runner HTML file
- `opaTestsWithCoverage.qunit.html` - Test runner with code coverage
- `AllJourneys.js` - Main configuration file that loads all test journeys
- `arrangements/` - Contains test setup and startup configurations
- `pages/` - Contains page objects for each view in the application
- `*Journey.js` - Test journey files containing the actual test scenarios

## Test Journeys

### NavigationJourney.js
Tests the basic navigation flow between different views:
- Main page display
- Navigation to employee list
- Navigation to employee detail
- Back navigation

### EmployeeJourney.js
Tests the complete CRUD operations for employees:
- Creating new employees
- Searching employees
- Viewing employee details
- Editing employees
- Deleting employees

### ValidationJourney.js
Tests form validation and error handling:
- Required field validation
- Email format validation
- Form cancellation

## Page Objects

Each view has a corresponding page object that encapsulates:
- **Actions**: User interactions (clicks, text input, etc.)
- **Assertions**: Verification of expected states and content

### Available Page Objects:
- `App.js` - Main application shell
- `Main.js` - Main/home page
- `EmployeeList.js` - Employee list view
- `EmployeeDetail.js` - Employee detail view
- `EmployeeForm.js` - Employee create/edit form
- `Dialog.js` - Dialog interactions
- `Common.js` - Shared functionality

## Running the Tests

### Option 1: Direct HTML Runner
Open `opaTests.qunit.html` in a web browser to run all integration tests.

### Option 2: With Coverage
Open `opaTestsWithCoverage.qunit.html` to run tests with code coverage reporting.

### Option 3: Command Line (if configured)
```bash
npm run test:integration
```

## Writing New Tests

1. **Add new page objects** in the `pages/` folder for new views
2. **Create journey files** for new test scenarios
3. **Update AllJourneys.js** to include new journey files
4. **Follow the Given-When-Then pattern** for test readability

### Example Test Structure:
```javascript
opaTest("Should perform some action", function (Given, When, Then) {
    // Arrangements
    Given.iStartMyApp();

    // Actions
    When.onTheSomePage.iPerformSomeAction();

    // Assertions
    Then.onTheSomePage.iShouldSeeSomeResult();
});
```

## Best Practices

- Use meaningful test descriptions
- Keep tests independent and atomic
- Use page objects to encapsulate UI interactions
- Follow the AAA pattern (Arrange, Act, Assert)
- Clean up after tests with `iTeardownMyApp()`
- Use appropriate matchers for reliable element selection
- Add proper error messages for failed assertions