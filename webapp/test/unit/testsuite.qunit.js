sap.ui.define(function () {
  "use strict";

  return {
    name: "QUnit TestSuite for SapUI5 Template",
    defaults: {
      bootCore: true,
      ui5: {
        libs: "sap.ui.core,sap.m,sap.f",
        theme: "sap_horizon",
        noConflict: true,
        preload: "auto"
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
      // Model tests
      "model/formatter": {
        title: "Formatter Tests"
      },

      // Controller tests
      "controller/BaseController": {
        title: "BaseController Tests"
      },
      "controller/EmployeeList.controller": {
        title: "EmployeeList Controller Tests"
      },
      "controller/EmployeeDetail.controller": {
        title: "EmployeeDetail Controller Tests"
      }
    }
  };
});
