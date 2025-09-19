/**
 * Simple test runner for unit tests
 * This file can be used to run tests programmatically or in CI/CD environments
 */
sap.ui.define(["sap/ui/test/TestRunner"], function (TestRunner) {
  "use strict";

  return {
    /**
     * Runs all unit tests
     */
    runAllTests: function () {
      TestRunner.run({
        name: "Unit Tests - SapUI5 Template",
        testSuite: "sapui5/template/test/unit/testsuite.qunit",
        autostart: true
      });
    }
  };
});
