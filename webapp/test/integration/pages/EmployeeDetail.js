sap.ui.define(
  ["sap/ui/test/Opa5", "sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/actions/Press", "./Common"],
  function (Opa5, PropertyStrictEquals, Press, Common) {
    "use strict";

    const sViewName = "EmployeeDetail";

    Opa5.createPageObjects({
      onTheEmployeeDetailPage: {
        baseClass: Common,
        actions: {
          iPressOnTheEditButton: function () {
            return this.waitFor({
              id: "editButton",
              viewName: sViewName,
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "The edit button was pressed");
              },
              errorMessage: "Did not find the edit button"
            });
          },

          iPressOnTheDeleteButton: function () {
            return this.waitFor({
              id: "deleteButton",
              viewName: sViewName,
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "The delete button was pressed");
              },
              errorMessage: "Did not find the delete button"
            });
          },

          iPressOnTheBackButton: function () {
            return this.waitFor({
              id: "detailPage",
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
          iShouldSeeTheEmployeeDetail: function () {
            return this.waitFor({
              id: "detailPage",
              viewName: sViewName,
              success: function () {
                Opa5.assert.ok(true, "The Employee Detail page is displayed");
              },
              errorMessage: "Did not find the Employee Detail page"
            });
          },

          iShouldSeeTheEmployeeName: function (sExpectedName) {
            return this.waitFor({
              id: "objectHeader",
              viewName: sViewName,
              matchers: new PropertyStrictEquals({
                name: "title",
                value: sExpectedName
              }),
              success: function () {
                Opa5.assert.ok(true, "The employee name is displayed: " + sExpectedName);
              },
              errorMessage: "The employee name is not displayed correctly"
            });
          },

          iShouldSeeTheEmployeeInformation: function () {
            return this.waitFor({
              id: "objectHeader",
              viewName: sViewName,
              success: function (oObjectHeader) {
                Opa5.assert.ok(oObjectHeader.getTitle(), "The employee information is displayed");
              },
              errorMessage: "The employee information is not displayed"
            });
          }
        }
      }
    });
  }
);
