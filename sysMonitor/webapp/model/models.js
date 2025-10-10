sap.ui.define([
  "sap/ui/model/json/JSONModel"
], function (JSONModel) {
  "use strict";

  return {
    createAppModel: function () {
      return new JSONModel({ systems: [], logs: [], supabaseConnected: false });
    }
  };
});
