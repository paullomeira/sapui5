sap.ui.define(
  [
    "sap/ui/test/opaQunit",
    "./pages/App",
    "./pages/Main",
    "./pages/EmployeeList",
    "./pages/EmployeeDetail",
    "./pages/EmployeeForm",
    "./pages/Dialog"
  ],
  function (opaTest) {
    "use strict";

    QUnit.module("Employee CRUD Journey");

    opaTest("Should start the app and navigate to employee list", function (Given, When, Then) {
      // Arrangements
      Given.iStartMyApp({
        hash: "employees"
      });

      // Actions
      When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeTheEmployeeList().and.iShouldSeeTheEmployeeTable();
    });

    opaTest("Should create a new employee", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeListPage.iPressOnTheCreateButton();

      // Assertions
      Then.onTheEmployeeFormPage.iShouldSeeTheEmployeeForm().and.iShouldSeeTheFormTitle("Create Employee");

      // Actions - Fill the form
      When.onTheEmployeeFormPage
        .iEnterFirstName("João")
        .and.iEnterLastName("Silva")
        .and.iEnterEmail("joao.silva@empresa.com")
        .and.iPressOnTheSaveButton();

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeTheEmployeeList();
    });

    opaTest("Should search for employees", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeListPage.iEnterTextInTheSearchField("João");

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeEmployeesInTheTable(1);

      // Actions - Clear search
      When.onTheEmployeeListPage.iEnterTextInTheSearchField("");

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeTheEmployeeTable();
    });

    opaTest("Should view employee details", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeListPage.iPressOnTheFirstEmployee();

      // Assertions
      Then.onTheEmployeeDetailPage.iShouldSeeTheEmployeeDetail().and.iShouldSeeTheEmployeeInformation();
    });

    opaTest("Should edit an employee", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeDetailPage.iPressOnTheEditButton();

      // Assertions
      Then.onTheEmployeeFormPage.iShouldSeeTheEmployeeForm().and.iShouldSeeTheFormTitle("Edit Employee");

      // Actions - Update the form
      When.onTheEmployeeFormPage.iEnterFirstName("João Carlos").and.iPressOnTheSaveButton();

      // Assertions
      Then.onTheEmployeeDetailPage.iShouldSeeTheEmployeeDetail().and.iShouldSeeTheEmployeeName("João Carlos Silva");
    });

    opaTest("Should delete an employee", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeDetailPage.iPressOnTheDeleteButton();

      // Assertions
      Then.onTheDialog.iShouldSeeAConfirmationDialog();

      // Actions
      When.onTheDialog.iPressOnTheConfirmButton();

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeTheEmployeeList();

      // Cleanup
      Then.iTeardownMyApp();
    });
  }
);
