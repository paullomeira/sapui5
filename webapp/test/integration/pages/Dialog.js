sap.ui.define(
  ["sap/ui/test/Opa5", "sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/actions/Press", "./Common"],
  function (Opa5, PropertyStrictEquals, Press, Common) {
    "use strict";

    Opa5.createPageObjects({
      onTheDialog: {
        baseClass: Common,
        actions: {
          iPressOnTheConfirmButton: function () {
            return this.waitFor({
              controlType: "sap.m.Button",
              matchers: new PropertyStrictEquals({
                name: "text",
                value: "Confirm"
              }),
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "The confirm button was pressed");
              },
              errorMessage: "Did not find the confirm button"
            });
          },

          iPressOnTheCancelButton: function () {
            return this.waitFor({
              controlType: "sap.m.Button",
              matchers: new PropertyStrictEquals({
                name: "text",
                value: "Cancel"
              }),
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "The cancel button was pressed");
              },
              errorMessage: "Did not find the cancel button"
            });
          },

          iPressOnTheOKButton: function () {
            return this.waitFor({
              controlType: "sap.m.Button",
              matchers: new PropertyStrictEquals({
                name: "text",
                value: "OK"
              }),
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "The OK button was pressed");
              },
              errorMessage: "Did not find the OK button"
            });
          }
        },
        assertions: {
          iShouldSeeAConfirmationDialog: function () {
            return this.waitFor({
              controlType: "sap.m.Dialog",
              success: function () {
                Opa5.assert.ok(true, "A confirmation dialog is displayed");
              },
              errorMessage: "No confirmation dialog found"
            });
          },

          iShouldSeeAMessageDialog: function (sExpectedMessage) {
            return this.waitFor({
              controlType: "sap.m.Dialog",
              matchers: function (oDialog) {
                return oDialog.getContent().some(function (oContent) {
                  return oContent.getText && oContent.getText().indexOf(sExpectedMessage) > -1;
                });
              },
              success: function () {
                Opa5.assert.ok(true, "A message dialog with expected text is displayed");
              },
              errorMessage: "No message dialog with expected text found"
            });
          }
        }
      }
    });
  }
);
