sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "com.sysmonitor/model/supabase"
], function (Controller, MessageToast, Supabase) {
  "use strict";

  return Controller.extend("com.sysmonitor.controller.SystemDetail", {
    onInit: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("system").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function (oEvent) {
      var sId = oEvent.getParameter("arguments").systemId;
      var a = this.getOwnerComponent().getModel().getProperty("/systems") || [];
      var o = a.find(function (x) { return x.id === sId; }) || { id: sId, name: sId };
      var oViewModel = new sap.ui.model.json.JSONModel(o);
      this.getView().setModel(oViewModel);
    },

    _cmd: function (cmd) {
      var sId = this.getView().getModel().getProperty("/id");
      Supabase.sendCommand(sId, cmd).then(function () {
        MessageToast.show(cmd + " enviado");
      }).catch(function (e) {
        MessageToast.show(e.message);
      });
    },

    onStart: function () { this._cmd('start'); },
    onStop: function () { this._cmd('stop'); },
    onRestart: function () { this._cmd('restart'); }
  });
});
