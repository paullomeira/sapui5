sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "com.sysmonitor/model/supabase"
], function (Controller, Supabase) {
  "use strict";

  return Controller.extend("com.sysmonitor.controller.App", {
    onInit: function () {
      var that = this;
      Supabase.init().then(function (ok) {
        that.getOwnerComponent().getModel().setProperty("/supabaseConnected", !!ok);
      });
    }
  });
});
