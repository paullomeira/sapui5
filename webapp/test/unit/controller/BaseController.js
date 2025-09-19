sap.ui.define(
  [
    "sapui5/template/controller/BaseController",
    "sap/ui/core/mvc/View",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/Router",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
  ],
  function (BaseController, View, UIComponent, Router, History, JSONModel, ResourceModel, MessageBox, MessageToast) {
    "use strict";

    QUnit.module("BaseController Tests", {
      beforeEach: function () {
        // Create mock objects
        this.oView = new View();
        this.oComponent = new UIComponent();
        this.oRouter = new Router();
        this.oResourceBundle = {
          getText: sinon.stub().returns("Test Text")
        };
        this.oResourceModel = new ResourceModel();

        // Setup stubs
        sinon.stub(this.oResourceModel, "getResourceBundle").returns(this.oResourceBundle);
        sinon.stub(this.oComponent, "getRouter").returns(this.oRouter);
        sinon.stub(this.oComponent, "getModel").returns(this.oResourceModel);
        sinon.stub(UIComponent, "getRouterFor").returns(this.oComponent);

        // Create controller instance
        this.oController = new BaseController();
        sinon.stub(this.oController, "getView").returns(this.oView);
      },

      afterEach: function () {
        // Restore all stubs
        sinon.restore();

        // Cleanup
        this.oView.destroy();
        this.oComponent.destroy();
        this.oRouter.destroy();
        this.oResourceModel.destroy();
      }
    });

    QUnit.test("getRouter should return router instance", function (assert) {
      // Act
      const oRouter = this.oController.getRouter();

      // Assert
      assert.ok(oRouter, "Router instance returned");
      assert.strictEqual(oRouter, this.oRouter, "Correct router instance returned");
    });

    QUnit.test("getModel should return model from view", function (assert) {
      // Arrange
      const oModel = new JSONModel();
      sinon.stub(this.oView, "getModel").returns(oModel);

      // Act
      const oReturnedModel = this.oController.getModel("testModel");

      // Assert
      assert.ok(oReturnedModel, "Model returned");
      assert.strictEqual(oReturnedModel, oModel, "Correct model returned");
      assert.ok(this.oView.getModel.calledWith("testModel"), "getModel called with correct parameter");

      // Cleanup
      oModel.destroy();
    });

    QUnit.test("setModel should set model on view", function (assert) {
      // Arrange
      const oModel = new JSONModel();
      const oSetModelStub = sinon.stub(this.oView, "setModel").returns(this.oView);

      // Act
      const oResult = this.oController.setModel(oModel, "testModel");

      // Assert
      assert.ok(oSetModelStub.calledWith(oModel, "testModel"), "setModel called with correct parameters");
      assert.strictEqual(oResult, this.oView, "View returned for method chaining");

      // Cleanup
      oModel.destroy();
    });

    QUnit.test("getResourceBundle should return resource bundle", function (assert) {
      // Act
      const oBundle = this.oController.getResourceBundle();

      // Assert
      assert.ok(oBundle, "Resource bundle returned");
      assert.strictEqual(oBundle, this.oResourceBundle, "Correct resource bundle returned");
    });

    QUnit.test("navTo should call router navTo", function (assert) {
      // Arrange
      const oNavToStub = sinon.stub(this.oRouter, "navTo");
      const sRouteName = "testRoute";
      const oParameters = { id: "123" };
      const oComponentTargetInfo = {};
      const bReplace = true;

      // Act
      this.oController.navTo(sRouteName, oParameters, oComponentTargetInfo, bReplace);

      // Assert
      assert.ok(
        oNavToStub.calledWith(sRouteName, oParameters, oComponentTargetInfo, bReplace),
        "Router navTo called with correct parameters"
      );
    });

    QUnit.test("onNavBack should navigate back when history exists", function (assert) {
      // Arrange
      const oHistoryStub = sinon.stub(History, "getInstance").returns({
        getPreviousHash: sinon.stub().returns("previousHash")
      });
      const oWindowStub = sinon.stub(window.history, "go");

      // Act
      this.oController.onNavBack();

      // Assert
      assert.ok(oWindowStub.calledWith(-1), "window.history.go(-1) called");

      // Cleanup
      oHistoryStub.restore();
      oWindowStub.restore();
    });

    QUnit.test("onNavBack should navigate to default route when no history", function (assert) {
      // Arrange
      const oHistoryStub = sinon.stub(History, "getInstance").returns({
        getPreviousHash: sinon.stub().returns(undefined)
      });
      const oNavToStub = sinon.stub(this.oController, "navTo");

      // Act
      this.oController.onNavBack("customRoute");

      // Assert
      assert.ok(oNavToStub.calledWith("customRoute", {}, {}, true), "navTo called with custom route");

      // Cleanup
      oHistoryStub.restore();
    });

    QUnit.test("onNavBack should use RouteMain as default when no route specified", function (assert) {
      // Arrange
      const oHistoryStub = sinon.stub(History, "getInstance").returns({
        getPreviousHash: sinon.stub().returns(undefined)
      });
      const oNavToStub = sinon.stub(this.oController, "navTo");

      // Act
      this.oController.onNavBack();

      // Assert
      assert.ok(oNavToStub.calledWith("RouteMain", {}, {}, true), "navTo called with RouteMain");

      // Cleanup
      oHistoryStub.restore();
    });

    QUnit.test("getOwnerComponent should return component", function (assert) {
      // Act
      const oComponent = this.oController.getOwnerComponent();

      // Assert
      assert.ok(oComponent, "Component returned");
      assert.strictEqual(oComponent, this.oComponent, "Correct component returned");
    });

    QUnit.test("showSuccessMessage should call MessageToast.show", function (assert) {
      // Arrange
      const oMessageToastStub = sinon.stub(MessageToast, "show");
      const sMessage = "Success message";
      const mOptions = { duration: 5000 };

      // Act
      this.oController.showSuccessMessage(sMessage, mOptions);

      // Assert
      assert.ok(oMessageToastStub.calledWith(sMessage, mOptions), "MessageToast.show called with correct parameters");

      // Cleanup
      oMessageToastStub.restore();
    });

    QUnit.test("showSuccessMessage should use default options when none provided", function (assert) {
      // Arrange
      const oMessageToastStub = sinon.stub(MessageToast, "show");
      const sMessage = "Success message";

      // Act
      this.oController.showSuccessMessage(sMessage);

      // Assert
      assert.ok(oMessageToastStub.calledWith(sMessage), "MessageToast.show called with message");
      const oCallArgs = oMessageToastStub.getCall(0).args[1];
      assert.strictEqual(oCallArgs.duration, 3000, "Default duration used");
      assert.strictEqual(oCallArgs.width, "15em", "Default width used");

      // Cleanup
      oMessageToastStub.restore();
    });

    QUnit.test("showErrorMessage should call MessageBox.error", function (assert) {
      // Arrange
      const oMessageBoxStub = sinon.stub(MessageBox, "error");
      const sMessage = "Error message";
      const mOptions = { title: "Error" };

      // Act
      this.oController.showErrorMessage(sMessage, mOptions);

      // Assert
      assert.ok(oMessageBoxStub.calledWith(sMessage, mOptions), "MessageBox.error called with correct parameters");

      // Cleanup
      oMessageBoxStub.restore();
    });

    QUnit.test("showConfirmDialog should call MessageBox.confirm", function (assert) {
      // Arrange
      const oMessageBoxStub = sinon.stub(MessageBox, "confirm");
      const sMessage = "Confirm message";
      const fnOnConfirm = sinon.stub();
      const fnOnCancel = sinon.stub();

      // Act
      this.oController.showConfirmDialog(sMessage, fnOnConfirm, fnOnCancel);

      // Assert
      assert.ok(oMessageBoxStub.calledWith(sMessage), "MessageBox.confirm called with message");

      // Test confirm callback
      const oOptions = oMessageBoxStub.getCall(0).args[1];
      oOptions.onClose(MessageBox.Action.YES);
      assert.ok(fnOnConfirm.called, "Confirm callback called on YES action");

      // Test cancel callback
      oOptions.onClose(MessageBox.Action.NO);
      assert.ok(fnOnCancel.called, "Cancel callback called on NO action");

      // Cleanup
      oMessageBoxStub.restore();
    });

    QUnit.test("setPageTitle should update view model and document title", function (assert) {
      // Arrange
      const oViewModel = new JSONModel({ title: "" });
      sinon.stub(this.oController, "getModel").withArgs("view").returns(oViewModel);
      const sTitle = "Test Page Title";
      const sOriginalTitle = document.title;

      // Act
      this.oController.setPageTitle(sTitle);

      // Assert
      assert.strictEqual(oViewModel.getProperty("/title"), sTitle, "View model title updated");
      assert.ok(document.title.includes(sTitle), "Document title updated");

      // Cleanup
      document.title = sOriginalTitle;
      oViewModel.destroy();
    });

    QUnit.test("setPageTitle should handle missing view model gracefully", function (assert) {
      // Arrange
      sinon.stub(this.oController, "getModel").withArgs("view").returns(null);
      const sTitle = "Test Page Title";
      const sOriginalTitle = document.title;

      // Act & Assert - should not throw error
      assert.expect(1);
      try {
        this.oController.setPageTitle(sTitle);
        assert.ok(true, "Method executed without error when view model is missing");
      } catch (e) {
        assert.ok(false, "Method should not throw error when view model is missing");
      }

      // Cleanup
      document.title = sOriginalTitle;
    });
  }
);
