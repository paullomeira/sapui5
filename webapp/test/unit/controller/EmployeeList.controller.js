sap.ui.define(
  [
    "sapui5/template/controller/EmployeeList.controller",
    "sap/ui/core/mvc/View",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/Router",
    "sap/ui/core/routing/Route",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/Table",
    "sap/m/SearchField",
    "sap/m/ComboBox",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
  ],
  function (
    EmployeeListController,
    View,
    UIComponent,
    Router,
    Route,
    JSONModel,
    ResourceModel,
    Table,
    SearchField,
    ComboBox,
    MessageToast,
    MessageBox
  ) {
    "use strict";

    QUnit.module("EmployeeList Controller Tests", {
      beforeEach: function () {
        // Create mock data
        this.oEmployeeData = {
          employees: [
            {
              id: "001",
              firstName: "João",
              lastName: "Silva",
              email: "joao.silva@empresa.com",
              department: "TI",
              position: "Desenvolvedor",
              status: "Ativo"
            },
            {
              id: "002",
              firstName: "Maria",
              lastName: "Santos",
              email: "maria.santos@empresa.com",
              department: "RH",
              position: "Analista",
              status: "Inativo"
            }
          ]
        };

        // Create mock objects
        this.oView = new View();
        this.oComponent = new UIComponent();
        this.oRouter = new Router();
        this.oRoute = new Route();
        this.oEmployeeModel = new JSONModel(this.oEmployeeData);
        this.oResourceBundle = {
          getText: sinon.stub().returns("Test Text")
        };
        this.oResourceModel = new ResourceModel();

        // Create mock controls
        this.oTable = new Table();
        this.oSearchField = new SearchField();
        this.oDepartmentFilter = new ComboBox();
        this.oStatusFilter = new ComboBox();

        // Setup binding mock
        this.oBinding = {
          filter: sinon.stub(),
          getContexts: sinon.stub().returns([])
        };
        sinon.stub(this.oTable, "getBinding").returns(this.oBinding);
        sinon.stub(this.oTable, "getSelectedItems").returns([]);
        sinon.stub(this.oTable, "removeSelections");

        // Setup stubs
        sinon.stub(this.oResourceModel, "getResourceBundle").returns(this.oResourceBundle);
        sinon.stub(this.oComponent, "getRouter").returns(this.oRouter);
        sinon.stub(this.oComponent, "getModel").returns(this.oResourceModel);
        sinon.stub(this.oRouter, "getRoute").returns(this.oRoute);
        sinon.stub(this.oRoute, "attachPatternMatched");
        sinon.stub(this.oRouter, "navTo");

        // Create controller instance
        this.oController = new EmployeeListController();
        sinon.stub(this.oController, "getView").returns(this.oView);
        sinon.stub(this.oController, "getModel").callsFake((sName) => {
          if (sName === "view") {
            return new JSONModel({ selectedEmployees: [] });
          }
          return this.oEmployeeModel;
        });
        sinon.stub(this.oController, "setModel");
        sinon.stub(this.oController, "getRouter").returns(this.oRouter);
        sinon.stub(this.oController, "getResourceBundle").returns(this.oResourceBundle);
        sinon.stub(this.oController, "byId").callsFake((sId) => {
          switch (sId) {
            case "employeeTable":
              return this.oTable;
            case "searchField":
              return this.oSearchField;
            case "departmentFilter":
              return this.oDepartmentFilter;
            case "statusFilter":
              return this.oStatusFilter;
            default:
              return null;
          }
        });
      },

      afterEach: function () {
        // Restore all stubs
        sinon.restore();

        // Cleanup
        this.oView.destroy();
        this.oComponent.destroy();
        this.oRouter.destroy();
        this.oRoute.destroy();
        this.oEmployeeModel.destroy();
        this.oResourceModel.destroy();
        this.oTable.destroy();
        this.oSearchField.destroy();
        this.oDepartmentFilter.destroy();
        this.oStatusFilter.destroy();
      }
    });

    QUnit.test("onInit should initialize view model and attach route", function (assert) {
      // Act
      this.oController.onInit();

      // Assert
      assert.ok(this.oController.setModel.called, "View model set");
      assert.ok(this.oRoute.attachPatternMatched.called, "Route pattern matched attached");
    });

    QUnit.test("onSearch should filter table with search query", function (assert) {
      // Arrange
      const oEvent = {
        getParameter: sinon.stub().returns("João")
      };

      // Act
      this.oController.onSearch(oEvent);

      // Assert
      assert.ok(this.oBinding.filter.called, "Filter applied to binding");
      const aFilters = this.oBinding.filter.getCall(0).args[0];
      assert.ok(Array.isArray(aFilters), "Filters array passed");
      assert.ok(aFilters.length > 0, "Filters applied");
    });

    QUnit.test("onSearch should clear filters when search is empty", function (assert) {
      // Arrange
      const oEvent = {
        getParameter: sinon.stub().returns("")
      };
      sinon.stub(this.oSearchField, "getValue").returns("");
      sinon.stub(this.oDepartmentFilter, "getSelectedKey").returns("");
      sinon.stub(this.oStatusFilter, "getSelectedKey").returns("");

      // Act
      this.oController.onSearch(oEvent);

      // Assert
      assert.ok(this.oBinding.filter.called, "Filter called");
      const aFilters = this.oBinding.filter.getCall(0).args[0];
      assert.strictEqual(aFilters.length, 0, "No filters applied for empty search");
    });

    QUnit.test("onFilterChange should apply dropdown filters", function (assert) {
      // Arrange
      sinon.stub(this.oSearchField, "getValue").returns("");
      sinon.stub(this.oDepartmentFilter, "getSelectedKey").returns("TI");
      sinon.stub(this.oStatusFilter, "getSelectedKey").returns("Ativo");

      // Act
      this.oController.onFilterChange();

      // Assert
      assert.ok(this.oBinding.filter.called, "Filter applied to binding");
      const aFilters = this.oBinding.filter.getCall(0).args[0];
      assert.ok(aFilters.length > 0, "Filters applied for dropdown selections");
    });

    QUnit.test("onClearFilters should clear all filters and search", function (assert) {
      // Arrange
      sinon.stub(this.oSearchField, "setValue");
      sinon.stub(this.oDepartmentFilter, "setSelectedKey");
      sinon.stub(this.oStatusFilter, "setSelectedKey");

      // Act
      this.oController.onClearFilters();

      // Assert
      assert.ok(this.oSearchField.setValue.calledWith(""), "Search field cleared");
      assert.ok(this.oDepartmentFilter.setSelectedKey.calledWith(""), "Department filter cleared");
      assert.ok(this.oStatusFilter.setSelectedKey.calledWith(""), "Status filter cleared");
      assert.ok(this.oBinding.filter.calledWith([]), "Empty filters applied");
    });

    QUnit.test("onEmployeePress should navigate to employee detail", function (assert) {
      // Arrange
      const oBindingContext = {
        getProperty: sinon.stub().returns("001")
      };
      const oEvent = {
        getSource: sinon.stub().returns({
          getBindingContext: sinon.stub().returns(oBindingContext)
        })
      };

      // Act
      this.oController.onEmployeePress(oEvent);

      // Assert
      assert.ok(
        this.oRouter.navTo.calledWith("RouteEmployeeDetail", { employeeId: "001" }),
        "Navigation to employee detail called with correct ID"
      );
    });

    QUnit.test("onAddEmployee should navigate to employee create", function (assert) {
      // Act
      this.oController.onAddEmployee();

      // Assert
      assert.ok(this.oRouter.navTo.calledWith("RouteEmployeeCreate"), "Navigation to employee create called");
    });

    QUnit.test("onEditEmployee should navigate to employee form", function (assert) {
      // Arrange
      const oBindingContext = {
        getProperty: sinon.stub().returns("001")
      };
      const oEvent = {
        getSource: sinon.stub().returns({
          getBindingContext: sinon.stub().returns(oBindingContext)
        })
      };

      // Act
      this.oController.onEditEmployee(oEvent);

      // Assert
      assert.ok(
        this.oRouter.navTo.calledWith("RouteEmployeeForm", { employeeId: "001" }),
        "Navigation to employee form called with correct ID"
      );
    });

    QUnit.test("onDeleteEmployee should show confirmation dialog", function (assert) {
      // Arrange
      const oEmployee = { id: "001", firstName: "João", lastName: "Silva" };
      const oBindingContext = {
        getObject: sinon.stub().returns(oEmployee)
      };
      const oEvent = {
        getSource: sinon.stub().returns({
          getBindingContext: sinon.stub().returns(oBindingContext)
        })
      };
      const oMessageBoxStub = sinon.stub(MessageBox, "confirm");

      // Act
      this.oController.onDeleteEmployee(oEvent);

      // Assert
      assert.ok(oMessageBoxStub.called, "Confirmation dialog shown");

      // Cleanup
      oMessageBoxStub.restore();
    });

    QUnit.test("onDeleteSelected should show message when no selection", function (assert) {
      // Arrange
      const oMessageToastStub = sinon.stub(MessageToast, "show");
      this.oTable.getSelectedItems.returns([]);

      // Act
      this.oController.onDeleteSelected();

      // Assert
      assert.ok(oMessageToastStub.called, "Message toast shown for no selection");

      // Cleanup
      oMessageToastStub.restore();
    });

    QUnit.test("onDeleteSelected should show confirmation for selected items", function (assert) {
      // Arrange
      const oEmployee = { id: "001", firstName: "João", lastName: "Silva" };
      const oSelectedItem = {
        getBindingContext: sinon.stub().returns({
          getObject: sinon.stub().returns(oEmployee)
        })
      };
      this.oTable.getSelectedItems.returns([oSelectedItem]);
      const oMessageBoxStub = sinon.stub(MessageBox, "confirm");

      // Act
      this.oController.onDeleteSelected();

      // Assert
      assert.ok(oMessageBoxStub.called, "Confirmation dialog shown for selected items");

      // Cleanup
      oMessageBoxStub.restore();
    });

    QUnit.test("formatFullName should combine first and last name", function (assert) {
      // Arrange
      const oBindingContext = {
        getProperty: sinon.stub().returns("Silva")
      };
      sinon.stub(this.oController, "getBindingContext").returns(oBindingContext);

      // Act
      const sResult = this.oController.formatFullName("João");

      // Assert
      assert.strictEqual(sResult, "João Silva", "Full name formatted correctly");
    });

    QUnit.test("formatFullName should return first name when no context", function (assert) {
      // Arrange
      sinon.stub(this.oController, "getBindingContext").returns(null);

      // Act
      const sResult = this.oController.formatFullName("João");

      // Assert
      assert.strictEqual(sResult, "João", "First name returned when no context");
    });

    QUnit.test("formatStatus should return localized status text", function (assert) {
      // Arrange
      this.oResourceBundle.getText.withArgs("status.active").returns("Active");
      this.oResourceBundle.getText.withArgs("status.inactive").returns("Inactive");

      // Act
      const sActiveResult = this.oController.formatStatus("Ativo");
      const sInactiveResult = this.oController.formatStatus("Inativo");
      const sUnknownResult = this.oController.formatStatus("Unknown");

      // Assert
      assert.strictEqual(sActiveResult, "Active", "Active status localized");
      assert.strictEqual(sInactiveResult, "Inactive", "Inactive status localized");
      assert.strictEqual(sUnknownResult, "Unknown", "Unknown status returned as-is");
    });

    QUnit.test("formatStatusState should return correct semantic states", function (assert) {
      // Act
      const sActiveState = this.oController.formatStatusState("Ativo");
      const sInactiveState = this.oController.formatStatusState("Inativo");
      const sUnknownState = this.oController.formatStatusState("Unknown");

      // Assert
      assert.strictEqual(sActiveState, "Success", "Active status returns Success state");
      assert.strictEqual(sInactiveState, "Error", "Inactive status returns Error state");
      assert.strictEqual(sUnknownState, "None", "Unknown status returns None state");
    });
  }
);
