sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "com.sysmonitor/model/supabase"
], function (Controller, Filter, FilterOperator, Supabase) {
  "use strict";

  return Controller.extend("com.sysmonitor.controller.Logs", {
    onInit: function () {
      this._loadLogs();
    },

    _loadLogs: function () {
      var oModel = this.getOwnerComponent().getModel();
      Supabase.listLogs(200).then(function (a) {
        oModel.setProperty("/logs", a);
      }).catch(function () {
        oModel.setProperty("/logs", []);
      });
      this.getView().byId("logsTable").setModel(oModel).bindItems({
        path: "/logs"
      });
    },

    onSearch: function (oEvent) {
      var sQuery = oEvent.getSource().getValue();
      var oTable = this.getView().byId("logsTable");
      var oBinding = oTable.getBinding("items");
      if (!oBinding) { return; }
      if (sQuery) {
        oBinding.filter(new Filter({
          filters: [
            new Filter("message", FilterOperator.Contains, sQuery),
            new Filter("system", FilterOperator.Contains, sQuery),
            new Filter("level", FilterOperator.Contains, sQuery)
          ],
          and: false
        }));
      } else {
        oBinding.filter([]);
      }
    }
  });
});
