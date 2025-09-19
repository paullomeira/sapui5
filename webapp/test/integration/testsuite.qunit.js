sap.ui.define(function () {
  "use strict";

  return {
    name: "QUnit TestSuite for SapUI5 Template Integration Tests",
    defaults: {
      bootCore: true,
      ui5: {
        libs: "sap.m,sap.ui.core,sap.f",
        theme: "sap_horizon",
        noConflict: true,
        preload: "auto",
        resourceroots: {
          "sapui5.template": "../../",
          "sapui5.template.test": "../"
        }
      },
      qunit: {
        version: 2,
        reorder: false
      },
      sinon: {
        version: 4,
        qunitBridge: true,
        useFakeTimers: false
      },
      module: "./{name}.qunit"
    },
    tests: {
      AllJourneys: {
        title: "Integration Tests - All Journeys"
      }
    }
  };
});
