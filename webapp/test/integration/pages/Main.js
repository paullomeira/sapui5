sap.ui.define(
  [
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/AggregationLengthEquals",
    "sap/ui/test/matchers/AggregationFilled",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "./Common"
  ],
  function (Opa5, AggregationLengthEquals, AggregationFilled, PropertyStrictEquals, Common) {
    "use strict";

    const sViewName = "Main";

    Opa5.createPageObjects({
      onTheMainPage: {
        baseClass: Common,
        actions: {
          iPressOnTheEmployeeListTile: function () {
            return this.waitFor({
              id: "employeeListTile",
              viewName: sViewName,
              actions: new sap.ui.test.actions.Press(),
              success: function () {
                Opa5.assert.ok(true, "The Employee List tile was pressed");
              },
              errorMessage: "Did not find the Employee List tile"
            });
          }
        },
        assertions: {
          iShouldSeeTheMainPage: function () {
            return this.waitFor({
              id: "mainPage",
              viewName: sViewName,
              success: function () {
                Opa5.assert.ok(true, "The Main page is displayed");
              },
              errorMessage: "Did not find the Main page"
            });
          },

          iShouldSeeTheTileContainer: function () {
            return this.waitFor({
              id: "tileContainer",
              viewName: sViewName,
              matchers: new AggregationFilled({
                name: "tiles"
              }),
              success: function () {
                Opa5.assert.ok(true, "The tile container has tiles");
              },
              errorMessage: "The tile container has no tiles"
            });
          }
        }
      }
    });
  }
);
