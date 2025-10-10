sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "com.sysmonitor/model/supabase"
], function (Controller, JSONModel, Supabase) {
  "use strict";

  return Controller.extend("com.sysmonitor.controller.Overview", {
    onInit: function () {
      this._loadSystems();
    },

    _loadSystems: function () {
      var oModel = this.getOwnerComponent().getModel();
      Supabase.listSystems().then(function (a) {
        oModel.setProperty("/systems", a);
      }).catch(function () {
        oModel.setProperty("/systems", []);
      });
    },

    onSystemPress: function (oEvent) {
      var oItem = oEvent.getSource();
      var oCtx = oItem.getBindingContext();
      var sId = oCtx.getProperty("id");
      this.getOwnerComponent().getRouter().navTo("system", { systemId: sId });
    },

    onNavLogs: function () {
      this.getOwnerComponent().getRouter().navTo("logs");
    },

    onNavSettings: function () {
      this.getOwnerComponent().getRouter().navTo("settings");
    }
  });
});
