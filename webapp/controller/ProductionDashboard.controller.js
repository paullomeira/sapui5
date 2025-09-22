sap.ui.define([
  "sapui5/template/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Sorter",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/Dialog",
  "sap/m/List",
  "sap/m/StandardListItem",
  "sap/m/Button",
  "sap/m/Bar",
  "sap/m/Title"
], function (BaseController, JSONModel, Sorter, Filter, FilterOperator, Dialog, List, StandardListItem, Button, Bar, Title) {
  "use strict";

  return BaseController.extend("sapui5.template.controller.ProductionDashboard", {
    onInit: function () {
      var oViewModel = new JSONModel({
        selectedWorkCenter: "ALL",
        searchQuery: "",
        sortMode: "DUE",
        ordersFlat: [],
        workCentersOptions: []
      });
      this.setModel(oViewModel, "prodView");

      // Opções de centro de trabalho (inclui 'Todos')
      this._buildWorkCenterOptions();

      // Prepara dados iniciais
      this._rebuildFlatOrders();
      this._applyFiltersSorters();

      this.setPageTitle(this.getView().getModel("i18n").getResourceBundle().getText("pageTitle.production", ["Painel de Produção"]));
    },

    // Reconstroi lista plana de ordens/ops priorizadas
    _rebuildFlatOrders: function () {
      var oProdModel = this.getView().getModel("production");
      var aCenters = (oProdModel && oProdModel.getProperty("/workCenters")) || [];
      var aFlat = [];

      aCenters.forEach(function (wc) {
        (wc.orders || []).forEach(function (ord) {
          var nextOp = null;
          var ops = ord.operations || [];
          if (ops.length) {
            ops.sort(function (a, b) { return a.sequence - b.sequence; });
            nextOp = ops.find(function (o) { return o.status === "Open"; }) || ops[0];
          }

          var dDue = ord.dueDate ? new Date(ord.dueDate) : null;
          var bOverdue = dDue ? (new Date().setHours(0,0,0,0) > dDue.setHours(0,0,0,0)) : false;
          var iCritWeight = ord.criticality === "High" ? 3 : (ord.criticality === "Medium" ? 2 : 1);

          aFlat.push({
            workCenterId: wc.id,
            workCenterName: wc.name,
            plant: wc.plant,
            orderId: ord.orderId,
            material: ord.material,
            description: ord.description,
            dueDate: ord.dueDate,
            overdue: bOverdue,
            criticality: ord.criticality,
            criticalityWeight: iCritWeight,
            nextOperationId: nextOp ? nextOp.operationId : "",
            nextOperationDesc: nextOp ? nextOp.description : "",
            operations: ops
          });
        });
      });

      var oVM = this.getModel("prodView");
      oVM.setProperty("/ordersFlat", aFlat);
    },

    _applyFiltersSorters: function () {
      var oVM = this.getModel("prodView");
      var sWC = oVM.getProperty("/selectedWorkCenter");
      var sQ = (oVM.getProperty("/searchQuery") || "").toLowerCase();
      var sMode = oVM.getProperty("/sortMode");

      var aFilters = [];
      if (sWC && sWC !== "ALL") {
        aFilters.push(new Filter({ path: "workCenterId", operator: FilterOperator.EQ, value1: sWC }));
      }
      if (sQ) {
        aFilters.push(new Filter({
          filters: [
            new Filter({ path: "orderId", operator: FilterOperator.Contains, value1: sQ }),
            new Filter({ path: "material", operator: FilterOperator.Contains, value1: sQ }),
            new Filter({ path: "description", operator: FilterOperator.Contains, value1: sQ }),
            new Filter({ path: "workCenterName", operator: FilterOperator.Contains, value1: sQ })
          ],
          and: false
        }));
      }

      var aSorters = [];
      if (sMode === "CRIT") {
        aSorters.push(new Sorter("criticalityWeight", true)); // High first
        aSorters.push(new Sorter({
          path: "dueDate",
          descending: false,
          comparator: function (a, b) { return new Date(a) - new Date(b); }
        }));
      } else {
        aSorters.push(new Sorter({
          path: "dueDate",
          descending: false,
          comparator: function (a, b) { return new Date(a) - new Date(b); }
        }));
        aSorters.push(new Sorter("criticalityWeight", true));
      }

      var oList = this.byId("ordersList");
      var oBinding = oList.getBinding("items");
      if (oBinding) {
        oBinding.filter(aFilters);
        oBinding.sort(aSorters);
      }
    },

    onRefresh: function () {
      this._rebuildFlatOrders();
      this._applyFiltersSorters();
    },

    onSearch: function (oEvent) {
      var sValue = oEvent.getParameter("newValue") || oEvent.getSource().getValue();
      this.getModel("prodView").setProperty("/searchQuery", sValue);
      this._applyFiltersSorters();
    },

    onWorkCenterChange: function (oEvent) {
      var sKey = oEvent.getParameter("selectedItem").getKey();
      this.getModel("prodView").setProperty("/selectedWorkCenter", sKey);
      this._applyFiltersSorters();
    },

    onSortModeChange: function () {
      this._applyFiltersSorters();
    },

    onOrderPress: function (oEvent) {
      var oCtx = oEvent.getSource().getBindingContext("prodView");
      var oData = oCtx.getObject();

      if (this._oOpsDialog) {
        this._oOpsDialog.destroy();
        this._oOpsDialog = null;
      }

      var oList = new List({
        items: {
          path: "/operations",
          template: new StandardListItem({
            title: "{operationId} - {description}",
            description: "{plannedStart} → {plannedFinish}",
            icon: "sap-icon://activity-2"
          })
        }
      });
      var oDlg = new Dialog({
        title: this.getView().getModel("i18n").getResourceBundle().getText("dialog.operations.title", [oData.orderId]),
        contentWidth: "480px",
        contentHeight: "360px",
        verticalScrolling: true,
        content: [oList],
        customHeader: new Bar({
          contentMiddle: [new Title({ text: this.getView().getModel("i18n").getResourceBundle().getText("dialog.operations.title", [oData.orderId]) })]
        }),
        beginButton: new Button({ text: this.getView().getModel("i18n").getResourceBundle().getText("btn.close"), press: function(){ oDlg.close(); } })
      });
      oList.setModel(new JSONModel(oData));
      this.getView().addDependent(oDlg);
      this._oOpsDialog = oDlg;
      oDlg.open();
    },

    // Formatters
    formatOrderTitle: function (sOrderId, sMaterial) {
      if (!sOrderId) { return ""; }
      return this.getView().getModel("i18n").getResourceBundle().getText("order.title", [sOrderId, sMaterial || "-"]); 
    },

    formatNextOp: function (sId, sDesc) {
      if (!sId) { return this.getView().getModel("i18n").getResourceBundle().getText("attr.nextOperation.none"); }
      return sId + ": " + sDesc;
    },

    formatDueLabel: function (sDue) {
      if (!sDue) { return ""; }
      var d = new Date(sDue);
      var oRB = this.getView().getModel("i18n").getResourceBundle();
      return oRB.getText("label.dueDate", [d.toLocaleDateString()]);
    },

    formatDueState: function (bOverdue) {
      return bOverdue ? "Error" : "Warning";
    },

    formatCriticalityLabel: function (sCrit) {
      var oRB = this.getView().getModel("i18n").getResourceBundle();
      if (sCrit === "High") { return oRB.getText("criticality.high"); }
      if (sCrit === "Medium") { return oRB.getText("criticality.medium"); }
      return oRB.getText("criticality.low");
    },

    formatCriticalityState: function (sCrit) {
      if (sCrit === "High") { return "Error"; }
      if (sCrit === "Medium") { return "Warning"; }
      return "Information";
    }
  });
});
