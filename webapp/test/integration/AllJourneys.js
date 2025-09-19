sap.ui.define(
  ["sap/ui/test/Opa5", "./arrangements/Startup", "./NavigationJourney", "./EmployeeJourney", "./ValidationJourney"],
  function (Opa5, Startup) {
    "use strict";

    Opa5.extendConfig({
      arrangements: new Startup(),
      viewNamespace: "sapui5.template.view.",
      autoWait: true
    });
  }
);
