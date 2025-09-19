sap.ui.define(["sap/ui/test/Opa5", "./Common"], function (Opa5, Common) {
  "use strict";

  const sViewName = "App";

  Opa5.createPageObjects({
    onTheAppPage: {
      baseClass: Common,
      actions: {
        iWaitUntilTheAppBusyIndicatorIsGone: function () {
          return this.waitFor({
            id: "app",
            viewName: sViewName,
            // inline-template, no id
            matchers: function (oRootView) {
              // we set a custom busy indicator so we need to query the parent of the app
              return oRootView.getBusy() === false;
            },
            success: function () {
              Opa5.assert.ok(true, "The app is not busy");
            },
            errorMessage: "The app is still busy"
          });
        }
      },
      assertions: {
        iShouldSeeTheBusyIndicator: function () {
          return this.waitFor({
            id: "app",
            viewName: sViewName,
            success: function (oRootView) {
              // we set a custom busy indicator so we need to query the parent of the app
              Opa5.assert.ok(oRootView.getBusy(), "The app is busy");
            },
            errorMessage: "The app is not busy"
          });
        }
      }
    }
  });
});
