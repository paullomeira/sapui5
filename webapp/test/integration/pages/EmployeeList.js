sap.ui.define(
  [
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/AggregationFilled",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ui/test/actions/Press",
    "./Common"
  ],
  function (Opa5, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Press, Common) {
    "use strict";

    const sViewName = "EmployeeList";

    Opa5.createPageObjects({
      onTheEmployeeListPage: {
        baseClass: Common,
        actions: {
          iPressOnTheFirstEmployee: function () {
            return this.waitFor({
              id: "employeeTable",
              viewName: sViewName,
              matchers: new AggregationFilled({
                name: "items"
              }),
              actions: function (oTable) {
                oTable.getItems()[0].firePress();
              },
              success: function () {
                Opa5.assert.ok(true, "The first employee was pressed");
              },
              errorMessage: "The employee table has no items"
            });
          },

          iPressOnTheCreateButton: function () {
            return this.waitFor({
              id: "createButton",
              viewName: sViewName,
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "The create button was pressed");
              },
              errorMessage: "Did not find the create button"
            });
          },

          iEnterTextInTheSearchField: function (sSearchText) {
            return this.waitFor({
              id: "searchField",
              viewName: sViewName,
              actions: function (oSearchField) {
                oSearchField.setValue(sSearchText);
                oSearchField.fireSearch();
              },
              success: function () {
                Opa5.assert.ok(true, "Search text was entered: " + sSearchText);
              },
              errorMessage: "Did not find the search field"
            });
          },

          iPressOnTheBackButton: function () {
            return this.waitFor({
              id: "employeeListPage",
              viewName: sViewName,
              actions: function (oPage) {
                oPage.fireNavButtonPress();
              },
              success: function () {
                Opa5.assert.ok(true, "The back button was pressed");
              },
              errorMessage: "Did not find the back button"
            });
          }
        },
        assertions: {
          iShouldSeeTheEmployeeList: function () {
            return this.waitFor({
              id: "employeeListPage",
              viewName: sViewName,
              success: function () {
                Opa5.assert.ok(true, "The Employee List page is displayed");
              },
              errorMessage: "Did not find the Employee List page"
            });
          },

          iShouldSeeTheEmployeeTable: function () {
            return this.waitFor({
              id: "employeeTable",
              viewName: sViewName,
              matchers: new AggregationFilled({
                name: "items"
              }),
              success: function (oTable) {
                Opa5.assert.ok(oTable.getItems().length > 0, "The employee table has items");
              },
              errorMessage: "The employee table has no items"
            });
          },

          iShouldSeeEmployeesInTheTable: function (iExpectedCount) {
            return this.waitFor({
              id: "employeeTable",
              viewName: sViewName,
              matchers: new AggregationLengthEquals({
                name: "items",
                length: iExpectedCount
              }),
              success: function () {
                Opa5.assert.ok(true, "The employee table has " + iExpectedCount + " items");
              },
              errorMessage: "The employee table does not have " + iExpectedCount + " items"
            });
          }
        }
      }
    });
  }
);
