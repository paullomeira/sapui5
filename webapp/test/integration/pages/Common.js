sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
  "use strict";

  function getFrameUrl(sHash, sUrlParameters) {
    const sUrl = sap.ui.require.toUrl("sapui5/template/test/integration/opaTests.qunit.html");
    sHash = sHash || "";
    sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";

    if (sHash) {
      sHash = "#" + (sHash.indexOf("/") === 0 ? sHash.substring(1) : sHash);
    } else {
      sHash = "";
    }

    return sUrl + sUrlParameters + sHash;
  }

  return Opa5.extend("sapui5.template.test.integration.pages.Common", {
    constructor: function (oConfig) {
      Opa5.apply(this, arguments);

      this._oConfig = oConfig;
    },

    _getFrameUrl: getFrameUrl,

    iLookAtTheScreen: function () {
      return this;
    }
  });
});
