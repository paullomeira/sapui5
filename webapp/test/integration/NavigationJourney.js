sap.ui.define(
  ["sap/ui/test/opaQunit", "./pages/App", "./pages/Main", "./pages/EmployeeList", "./pages/EmployeeDetail"],
  function (opaTest) {
    "use strict";

    QUnit.module("Navigation Journey");

    opaTest("Should start the app and see the main page", function (Given, When, Then) {
      // Arrangements
      Given.iStartMyApp();

      // Actions
      When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

      // Assertions
      Then.onTheMainPage.iShouldSeeTheMainPage().and.iShouldSeeTheTileContainer();
    });

    opaTest("Should navigate to employee list", function (Given, When, Then) {
      // Actions
      When.onTheMainPage.iPressOnTheEmployeeListTile();

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeTheEmployeeList().and.iShouldSeeTheEmployeeTable();
    });

    opaTest("Should navigate to employee detail", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeListPage.iPressOnTheFirstEmployee();

      // Assertions
      Then.onTheEmployeeDetailPage.iShouldSeeTheEmployeeDetail().and.iShouldSeeTheEmployeeInformation();
    });

    opaTest("Should navigate back to employee list", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeDetailPage.iPressOnTheBackButton();

      // Assertions
      Then.onTheEmployeeListPage.iShouldSeeTheEmployeeList();
    });

    opaTest("Should navigate back to main page", function (Given, When, Then) {
      // Actions
      When.onTheEmployeeListPage.iPressOnTheBackButton();

      // Assertions
      Then.onTheMainPage.iShouldSeeTheMainPage();

      // Cleanup
      Then.iTeardownMyApp();
    });
  }
);
