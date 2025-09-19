sap.ui.define(
  ["sap/ui/test/opaQunit", "./pages/App", "./pages/EmployeeList", "./pages/EmployeeForm", "./pages/Dialog"],
  function (opaTest) {
    "use strict";

    QUnit.module("Form Validation Journey");

    opaTest("Should start the app and navigate to create form", function (Given, When, Then) {
      // Arrangements
      Given.iStartMyApp({
        hash: "employees/create"
      });

      // Actions
      When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

      // Assertions
      Then.onTheEmployeeFormPage.iShouldSeeTheEmployeeForm().and.iShouldSeeTheFormTitle("Create Employee");
    });

    opaTest("Should show validation errors for empty required fields", function (Given, When, Then) {
      // Actions - Try to save without filling required fields
      When.onTheEmployeeFormPage.iPressOnTheSaveButton();

      // Assertions
      Then.onTheEmployeeFormPage.iShouldSeeValidationErrors();
    });

    opaTest("Should show validation error for invalid email", function (Given, When, Then) {
      // Actions - Enter invalid email
      When.onTheEmployeeFormPage
        .iEnterFirstName("Test")
        .and.iEnterLastName("User")
        .and.iEnterEmail("invalid-email")
        .and.iPressOnTheSaveButton();

      // Assertions
      Then.onTheEmployeeFormPage.iShouldSeeValidationErrors();
    });

    opaTest("Should successfully save with valid data", function (Given, When, Then) {
      // Actions - Enter valid data
      When.onTheEmployeeFormPage.iEnterEmail("test.user@empresa.com").and.iPressOnTheSaveButton();

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeTheEmployeeList();
    });

    opaTest("Should cancel form and return to list", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeListPage.iPressOnTheCreateButton();

      // Assertions
      Then.onTheEmployeeFormPage.iShouldSeeTheEmployeeForm();

      // Actions - Cancel the form
      When.onTheEmployeeFormPage.iPressOnTheCancelButton();

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeTheEmployeeList();

      // Cleanup
      Then.iTeardownMyApp();
    });
  }
);
