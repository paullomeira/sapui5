sap.ui.define(
  [
    "sapui5/template/controller/EmployeeDetail.controller",
    "sap/ui/core/mvc/View",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/Router",
    "sap/ui/core/routing/Route",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
  ],
  function (
    EmployeeDetailController,
    View,
    UIComponent,
    Router,
    Route,
    JSONModel,
    ResourceModel,
    _MessageBox,
    _MessageToast
  ) {
    "use strict";

    QUnit.module("EmployeeDetail Controller Tests", {
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
              status: "Ativo",
              hireDate: "2020-01-15",
              salary: 5000
            },
            {
              id: "002",
              firstName: "Maria",
              lastName: "Santos",
              email: "maria.santos@empresa.com",
              department: "RH",
              position: "Analista",
              status: "Inativo",
              hireDate: "2019-03-10",
              salary: 4500
            }
          ]
        };

        this.oMetadataData = {
          statistics: {
            totalEmployees: 2,
            activeEmployees: 1
          }
        };

        // Create mock objects
        this.oView = new View();
        this.oComponent = new UIComponent();
        this.oRouter = new Router();
        this.oRoute = new Route();
        this.oEmployeeModel = new JSONModel(this.oEmployeeData);
        this.oMetadataModel = new JSONModel(this.oMetadataData);
        this.oResourceBundle = {
          getText: sinon.stub().callsFake((sKey, aParams) => {
            if (sKey === "pageTitle.employeeDetail") {
              return "Employee Details";
            }
            if (sKey === "msg.deleteConfirm") {
              return `Delete ${aParams[0]}?`;
            }
            if (sKey === "title.confirm") {
              return "Confirm";
            }
            if (sKey === "msg.deleteSuccess") {
              return "Employee deleted successfully";
            }
            return "Test Text";
          })
        };
        this.oResourceModel = new ResourceModel();

        // Setup stubs
        sinon.stub(this.oResourceModel, "getResourceBundle").returns(this.oResourceBundle);
        sinon.stub(this.oComponent, "getRouter").returns(this.oRouter);
        sinon.stub(this.oComponent, "getModel").callsFake((sName) => {
          if (sName === "employee") {
            return this.oEmployeeModel;
          }
          if (sName === "metadata") {
            return this.oMetadataModel;
          }
          return this.oResourceModel;
        });
        sinon.stub(this.oRouter, "getRoute").returns(this.oRoute);
        sinon.stub(this.oRoute, "attachPatternMatched");
        sinon.stub(this.oRouter, "navTo");

        // Create controller instance
        this.oController = new EmployeeDetailController();
        sinon.stub(this.oController, "getView").returns(this.oView);
        sinon.stub(this.oController, "getRouter").returns(this.oRouter);
        sinon.stub(this.oController, "getResourceBundle").returns(this.oResourceBundle);
        sinon.stub(this.oController, "getOwnerComponent").returns(this.oComponent);
        sinon.stub(this.oController, "setModel");
        sinon.stub(this.oController, "setPageTitle");
        sinon.stub(this.oController, "showErrorMessage");
        sinon.stub(this.oController, "showSuccessMessage");
        sinon.stub(this.oController, "showConfirmDialog");
        sinon.stub(this.oController, "navTo");
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
        this.oMetadataModel.destroy();
        this.oResourceModel.destroy();
      }
    });

    QUnit.test("onInit should initialize view model and attach route", function (assert) {
      // Act
      this.oController.onInit();

      // Assert
      assert.ok(this.oController.setModel.called, "View model set");
      assert.ok(this.oRoute.attachPatternMatched.called, "Route pattern matched attached");
    });

    QUnit.test("_onRouteMatched should load employee data", function (assert) {
      // Arrange
      const oEvent = {
        getParameter: sinon.stub().returns({
          employeeId: "001"
        })
      };
      const oViewModel = new JSONModel({
        employeeId: null,
        busy: false
      });
      sinon.stub(this.oController, "getModel").callsFake((sName) => {
        if (sName === "view") {
          return oViewModel;
        }
        if (sName === "employee") {
          return this.oEmployeeModel;
        }
        return this.oResourceModel;
      });

      // Act
      this.oController._onRouteMatched(oEvent);

      // Assert
      assert.strictEqual(oViewModel.getProperty("/employeeId"), "001", "Employee ID set in view model");
      assert.strictEqual(oViewModel.getProperty("/busy"), true, "Busy state set to true");

      // Cleanup
      oViewModel.destroy();
    });

    QUnit.test("_loadEmployeeData should load existing employee", function (assert) {
      // Arrange
      const oViewModel = new JSONModel({
        busy: true,
        title: ""
      });
      sinon.stub(this.oController, "getModel").callsFake((sName) => {
        if (sName === "view") {
          return oViewModel;
        }
        if (sName === "employee") {
          return this.oEmployeeModel;
        }
        return this.oResourceModel;
      });

      // Act
      this.oController._loadEmployeeData("001");

      // Assert
      assert.ok(this.oController.setModel.called, "Employee detail model set");
      assert.ok(this.oController.setPageTitle.called, "Page title set");
      assert.strictEqual(oViewModel.getProperty("/busy"), false, "Busy state set to false");

      // Cleanup
      oViewModel.destroy();
    });

    QUnit.test("_loadEmployeeData should handle employee not found", function (assert) {
      // Arrange
      const oViewModel = new JSONModel({
        busy: true
      });
      sinon.stub(this.oController, "getModel").callsFake((sName) => {
        if (sName === "view") {
          return oViewModel;
        }
        if (sName === "employee") {
          return this.oEmployeeModel;
        }
        return this.oResourceModel;
      });

      // Act
      this.oController._loadEmployeeData("999");

      // Assert
      assert.ok(this.oController.showErrorMessage.called, "Error message shown for non-existent employee");
      assert.strictEqual(oViewModel.getProperty("/busy"), false, "Busy state set to false");

      // Cleanup
      oViewModel.destroy();
    });

    QUnit.test("onEditEmployee should navigate to employee form", function (assert) {
      // Arrange
      const oViewModel = new JSONModel({
        employeeId: "001"
      });
      sinon.stub(this.oController, "getModel").withArgs("view").returns(oViewModel);

      // Act
      this.oController.onEditEmployee();

      // Assert
      assert.ok(
        this.oController.navTo.calledWith("RouteEmployeeForm", { employeeId: "001" }),
        "Navigation to employee form called with correct ID"
      );

      // Cleanup
      oViewModel.destroy();
    });

    QUnit.test("onDeleteEmployee should show confirmation dialog", function (assert) {
      // Arrange
      const oEmployeeDetailModel = new JSONModel({
        firstName: "João",
        lastName: "Silva"
      });
      sinon.stub(this.oController, "getModel").callsFake((sName) => {
        if (sName === "employee") {
          return oEmployeeDetailModel;
        }
        return this.oResourceModel;
      });

      // Act
      this.oController.onDeleteEmployee();

      // Assert
      assert.ok(this.oController.showConfirmDialog.called, "Confirmation dialog shown");
      const sMessage = this.oController.showConfirmDialog.getCall(0).args[0];
      assert.ok(sMessage.includes("João Silva"), "Employee name included in confirmation message");

      // Cleanup
      oEmployeeDetailModel.destroy();
    });

    QUnit.test("_executeDelete should remove employee and navigate back", function (assert) {
      // Arrange
      const oViewModel = new JSONModel({
        employeeId: "001"
      });
      sinon.stub(this.oController, "getModel").withArgs("view").returns(oViewModel);
      const oOriginalEmployees = [...this.oEmployeeData.employees];

      // Act
      this.oController._executeDelete();

      // Assert
      const aEmployeesAfterDelete = this.oEmployeeModel.getProperty("/employees");
      assert.strictEqual(aEmployeesAfterDelete.length, oOriginalEmployees.length - 1, "Employee removed from model");
      assert.ok(!aEmployeesAfterDelete.find((emp) => emp.id === "001"), "Specific employee removed");
      assert.ok(this.oController.showSuccessMessage.called, "Success message shown");
      assert.ok(this.oController.navTo.called, "Navigation back called");

      // Cleanup
      oViewModel.destroy();
    });

    QUnit.test("_executeDelete should handle employee not found", function (assert) {
      // Arrange
      const oViewModel = new JSONModel({
        employeeId: "999"
      });
      sinon.stub(this.oController, "getModel").withArgs("view").returns(oViewModel);

      // Act
      this.oController._executeDelete();

      // Assert
      assert.ok(this.oController.showErrorMessage.called, "Error message shown for non-existent employee");

      // Cleanup
      oViewModel.destroy();
    });

    QUnit.test("_updateStatistics should recalculate employee statistics", function (assert) {
      // Arrange
      // Remove one active employee to test statistics update
      this.oEmployeeData.employees.splice(0, 1);
      this.oEmployeeModel.setData(this.oEmployeeData);

      // Act
      this.oController._updateStatistics();

      // Assert
      const iTotalEmployees = this.oMetadataModel.getProperty("/statistics/totalEmployees");
      const iActiveEmployees = this.oMetadataModel.getProperty("/statistics/activeEmployees");

      assert.strictEqual(iTotalEmployees, 1, "Total employees count updated");
      assert.strictEqual(iActiveEmployees, 0, "Active employees count updated");
    });

    QUnit.test("onNavBack should call base controller onNavBack with correct route", function (assert) {
      // Arrange
      sinon.stub(EmployeeDetailController.prototype.__proto__, "onNavBack");

      // Act
      this.oController.onNavBack();

      // Assert
      assert.ok(
        EmployeeDetailController.prototype.__proto__.onNavBack.calledWith("RouteEmployeeList"),
        "Base controller onNavBack called with correct default route"
      );

      // Cleanup
      EmployeeDetailController.prototype.__proto__.onNavBack.restore();
    });

    QUnit.test("onRefresh should reload employee data", function (assert) {
      // Arrange
      const oViewModel = new JSONModel({
        employeeId: "001"
      });
      sinon.stub(this.oController, "getModel").withArgs("view").returns(oViewModel);
      sinon.stub(this.oController, "_loadEmployeeData");

      // Act
      this.oController.onRefresh();

      // Assert
      assert.ok(this.oController._loadEmployeeData.calledWith("001"), "Employee data reloaded with correct ID");

      // Cleanup
      oViewModel.destroy();
    });

    QUnit.test("onIconTabBarSelect should handle tab selection", function (assert) {
      // Arrange
      const oEvent = {
        getParameter: sinon.stub().returns("contact")
      };

      // Act & Assert - should not throw error
      assert.expect(1);
      try {
        this.oController.onIconTabBarSelect(oEvent);
        assert.ok(true, "IconTabBar select handled without error");
      } catch (e) {
        assert.ok(false, "IconTabBar select should not throw error");
      }
    });

    QUnit.test("onContactAction should handle email action", function (assert) {
      // Arrange
      const oEmployeeDetailModel = new JSONModel({
        email: "joao.silva@empresa.com"
      });
      const oEvent = {
        getSource: sinon.stub().returns({
          data: sinon.stub().returns("email")
        })
      };
      sinon.stub(this.oController, "getModel").withArgs("employee").returns(oEmployeeDetailModel);
      sinon.stub(window, "open");

      // Act
      this.oController.onContactAction(oEvent);

      // Assert
      assert.ok(window.open.calledWith("mailto:joao.silva@empresa.com"), "Email client opened with correct email");

      // Cleanup
      oEmployeeDetailModel.destroy();
      window.open.restore();
    });

    QUnit.test("onContactAction should handle phone action", function (assert) {
      // Arrange
      const oEmployeeDetailModel = new JSONModel({
        phone: "11999991234"
      });
      const oEvent = {
        getSource: sinon.stub().returns({
          data: sinon.stub().returns("phone")
        })
      };
      sinon.stub(this.oController, "getModel").withArgs("employee").returns(oEmployeeDetailModel);
      sinon.stub(window, "open");

      // Act
      this.oController.onContactAction(oEvent);

      // Assert
      assert.ok(window.open.calledWith("tel:11999991234"), "Phone app opened with correct number");

      // Cleanup
      oEmployeeDetailModel.destroy();
      window.open.restore();
    });

    QUnit.test("onExit should cleanup employee model", function (assert) {
      // Arrange
      const oEmployeeDetailModel = new JSONModel();
      sinon.stub(oEmployeeDetailModel, "destroy");
      sinon.stub(this.oController, "getModel").withArgs("employee").returns(oEmployeeDetailModel);

      // Act
      this.oController.onExit();

      // Assert
      assert.ok(oEmployeeDetailModel.destroy.called, "Employee model destroyed on exit");

      // Cleanup
      oEmployeeDetailModel.destroy.restore();
    });
  }
);
