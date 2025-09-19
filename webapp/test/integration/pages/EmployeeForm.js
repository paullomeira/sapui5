sap.ui.define(
  [
    "sap/ui/test/Opa5",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "./Common"
  ],
  function (Opa5, PropertyStrictEquals, Press, EnterText, Common) {
    "use strict";

    const sViewName = "EmployeeForm";

    Opa5.createPageObjects({
      onTheEmployeeFormPage: {
        baseClass: Common,
        actions: {
          iEnterFirstName: function (sFirstName) {
            return this.waitFor({
              id: "firstNameInput",
              viewName: sViewName,
              actions: new EnterText({
                text: sFirstName
              }),
              success: function () {
                Opa5.assert.ok(true, "First name was entered: " + sFirstName);
              },
              errorMessage: "Did not find the first name input"
            });
          },

          iEnterLastName: function (sLastName) {
            return this.waitFor({
              id: "lastNameInput",
              viewName: sViewName,
              actions: new EnterText({
                text: sLastName
              }),
              success: function () {
                Opa5.assert.ok(true, "Last name was entered: " + sLastName);
              },
              errorMessage: "Did not find the last name input"
            });
          },

          iEnterEmail: function (sEmail) {
            return this.waitFor({
              id: "emailInput",
              viewName: sViewName,
              actions: new EnterText({
                text: sEmail
              }),
              success: function () {
                Opa5.assert.ok(true, "Email was entered: " + sEmail);
              },
              errorMessage: "Did not find the email input"
            });
          },

          iPressOnTheSaveButton: function () {
            return this.waitFor({
              id: "saveButton",
              viewName: sViewName,
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "The save button was pressed");
              },
              errorMessage: "Did not find the save button"
            });
          },

          iPressOnTheCancelButton: function () {
            return this.waitFor({
              id: "cancelButton",
              viewName: sViewName,
              actions: new Press(),
              success: function () {
                Opa5.assert.ok(true, "The cancel button was pressed");
              },
              errorMessage: "Did not find the cancel button"
            });
          }
        },
        assertions: {
          iShouldSeeTheEmployeeForm: function () {
            return this.waitFor({
              id: "formPage",
              viewName: sViewName,
              success: function () {
                Opa5.assert.ok(true, "The Employee Form page is displayed");
              },
              errorMessage: "Did not find the Employee Form page"
            });
          },

          iShouldSeeValidationErrors: function () {
            return this.waitFor({
              controlType: "sap.m.Input",
              viewName: sViewName,
              matchers: new PropertyStrictEquals({
                name: "valueState",
                value: "Error"
              }),
              success: function (aInputs) {
                Opa5.assert.ok(aInputs.length > 0, "Validation errors are displayed");
              },
              errorMessage: "No validation errors found"
            });
          },

          iShouldSeeTheFormTitle: function (sExpectedTitle) {
            return this.waitFor({
              id: "formPage",
              viewName: sViewName,
              matchers: new PropertyStrictEquals({
                name: "title",
                value: sExpectedTitle
              }),
              success: function () {
                Opa5.assert.ok(true, "The form title is displayed: " + sExpectedTitle);
              },
              errorMessage: "The form title is not displayed correctly"
            });
          }
        }
      }
    });
  }
);
