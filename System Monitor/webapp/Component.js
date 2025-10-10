sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device"
], function (UIComponent, JSONModel, Device) {
  "use strict";

  return UIComponent.extend("com.systemmonitor", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      var oDeviceModel = new JSONModel(Device);
      oDeviceModel.setDefaultBindingMode("OneWay");
      this.setModel(oDeviceModel, "device");

      var oAppModel = new JSONModel({
        systems: [],
        logs: [],
        supabaseConnected: false
      });
      this.setModel(oAppModel);

      this.getRouter().initialize();
    }
  });
});
