sap.ui.define(
  ["sap/ui/core/Fragment", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  (Fragment, JSONModel, _MessageToast) => {
    /**
     * Helper utility para gerenciar dialogs reutilizáveis
     * @namespace sapui5.template.model.DialogHelper
     */
    return {
      /**
       * Abre o dialog de funcionário com dados específicos
       * @param {sap.ui.core.mvc.Controller} oController - Controller que chama o dialog
       * @param {object} oEmployee - Dados do funcionário
       * @returns {Promise} Promise que resolve quando o dialog é aberto
       */
      openEmployeeDialog: function (oController, oEmployee) {
        return new Promise((resolve, reject) => {
          if (!oController._oEmployeeDialog) {
            Fragment.load({
              id: oController.getView().getId(),
              name: "sapui5.template.fragment.EmployeeDialog",
              controller: oController
            })
              .then((oDialog) => {
                oController._oEmployeeDialog = oDialog;
                oController.getView().addDependent(oDialog);

                // Configura modelo de dados do funcionário
                const oEmployeeModel = new JSONModel(oEmployee);
                oDialog.setModel(oEmployeeModel, "employee");

                oDialog.open();
                resolve(oDialog);
              })
              .catch(reject);
          } else {
            // Atualiza dados do funcionário existente
            const oEmployeeModel = oController._oEmployeeDialog.getModel("employee");
            oEmployeeModel.setData(oEmployee);
            oController._oEmployeeDialog.open();
            resolve(oController._oEmployeeDialog);
          }
        });
      },

      /**
       * Abre dialog de confirmação genérico
       * @param {sap.ui.core.mvc.Controller} oController - Controller que chama o dialog
       * @param {object} oConfig - Configuração do dialog
       * @param {string} oConfig.title - Título do dialog
       * @param {string} oConfig.message - Mensagem principal
       * @param {string} oConfig.state - Estado do dialog (Success, Warning, Error, Information)
       * @param {string} oConfig.confirmText - Texto do botão de confirmação
       * @param {string} oConfig.cancelText - Texto do botão de cancelamento
       * @param {function} oConfig.onConfirm - Callback para confirmação
       * @param {function} oConfig.onCancel - Callback para cancelamento
       * @returns {Promise} Promise que resolve quando o dialog é aberto
       */
      openConfirmDialog: function (oController, oConfig) {
        return new Promise((resolve, reject) => {
          if (!oController._oConfirmDialog) {
            Fragment.load({
              id: oController.getView().getId(),
              name: "sapui5.template.fragment.ConfirmDialog",
              controller: oController
            })
              .then((oDialog) => {
                oController._oConfirmDialog = oDialog;
                oController.getView().addDependent(oDialog);

                // Configura modelo de dados do dialog
                const oDialogModel = new JSONModel(this._prepareDialogConfig(oConfig));
                oDialog.setModel(oDialogModel, "dialog");

                // Armazena callbacks
                oController._confirmCallback = oConfig.onConfirm;
                oController._cancelCallback = oConfig.onCancel;

                oDialog.open();
                resolve(oDialog);
              })
              .catch(reject);
          } else {
            // Atualiza configuração do dialog existente
            const oDialogModel = oController._oConfirmDialog.getModel("dialog");
            oDialogModel.setData(this._prepareDialogConfig(oConfig));

            // Atualiza callbacks
            oController._confirmCallback = oConfig.onConfirm;
            oController._cancelCallback = oConfig.onCancel;

            oController._oConfirmDialog.open();
            resolve(oController._oConfirmDialog);
          }
        });
      },

      /**
       * Abre dialog de confirmação para deletar funcionário
       * @param {sap.ui.core.mvc.Controller} oController - Controller
       * @param {object} oEmployee - Dados do funcionário
       * @param {function} fnOnConfirm - Callback de confirmação
       * @returns {Promise} Promise do dialog
       */
      openDeleteConfirmDialog: function (oController, oEmployee, fnOnConfirm) {
        const sEmployeeName = (oEmployee.firstName || "") + " " + (oEmployee.lastName || "");

        return this.openConfirmDialog(oController, {
          title: oController.getResourceBundle().getText("confirmDialog.delete.title"),
          message: oController.getResourceBundle().getText("confirmDialog.delete.message"),
          details: oController.getResourceBundle().getText("confirmDialog.delete.details"),
          state: "Warning",
          confirmText: oController.getResourceBundle().getText("confirmDialog.delete.confirm"),
          cancelText: oController.getResourceBundle().getText("confirmDialog.delete.cancel"),
          warningText: "Employee: " + sEmployeeName,
          onConfirm: fnOnConfirm
        });
      },

      /**
       * Abre dialog de confirmação para salvar alterações
       * @param {sap.ui.core.mvc.Controller} oController - Controller
       * @param {function} fnOnConfirm - Callback de confirmação
       * @returns {Promise} Promise do dialog
       */
      openSaveConfirmDialog: function (oController, fnOnConfirm) {
        return this.openConfirmDialog(oController, {
          title: oController.getResourceBundle().getText("confirmDialog.save.title"),
          message: oController.getResourceBundle().getText("confirmDialog.save.message"),
          state: "Information",
          confirmText: oController.getResourceBundle().getText("confirmDialog.save.confirm"),
          cancelText: oController.getResourceBundle().getText("confirmDialog.save.cancel"),
          onConfirm: fnOnConfirm
        });
      },

      /**
       * Abre dialog de confirmação para descartar alterações
       * @param {sap.ui.core.mvc.Controller} oController - Controller
       * @param {function} fnOnConfirm - Callback de confirmação
       * @returns {Promise} Promise do dialog
       */
      openDiscardConfirmDialog: function (oController, fnOnConfirm) {
        return this.openConfirmDialog(oController, {
          title: oController.getResourceBundle().getText("confirmDialog.discard.title"),
          message: oController.getResourceBundle().getText("confirmDialog.discard.message"),
          details: oController.getResourceBundle().getText("confirmDialog.discard.details"),
          state: "Warning",
          confirmText: oController.getResourceBundle().getText("confirmDialog.discard.confirm"),
          cancelText: oController.getResourceBundle().getText("confirmDialog.discard.cancel"),
          onConfirm: fnOnConfirm
        });
      },

      /**
       * Prepara configuração do dialog com valores padrão
       * @private
       */
      _prepareDialogConfig: function (oConfig) {
        return {
          title: oConfig.title || "Confirm",
          message: oConfig.message || "Are you sure?",
          details: oConfig.details || "",
          state: oConfig.state || "Information",
          confirmText: oConfig.confirmText || "OK",
          cancelText: oConfig.cancelText || "Cancel",
          secondaryText: oConfig.secondaryText || "",
          warningText: oConfig.warningText || "",
          confirmEnabled: oConfig.confirmEnabled !== false,
          requiresInput: oConfig.requiresInput || false,
          inputLabel: oConfig.inputLabel || "",
          inputPlaceholder: oConfig.inputPlaceholder || "",
          inputValue: oConfig.inputValue || "",
          inputValueState: oConfig.inputValueState || "None",
          inputValueStateText: oConfig.inputValueStateText || "",
          showDontAskAgain: oConfig.showDontAskAgain || false,
          dontAskAgain: false
        };
      },

      /**
       * Fecha e limpa o dialog de funcionário
       * @param {sap.ui.core.mvc.Controller} oController - Controller
       */
      closeEmployeeDialog: function (oController) {
        if (oController._oEmployeeDialog) {
          oController._oEmployeeDialog.close();
        }
      },

      /**
       * Fecha e limpa o dialog de confirmação
       * @param {sap.ui.core.mvc.Controller} oController - Controller
       */
      closeConfirmDialog: function (oController) {
        if (oController._oConfirmDialog) {
          oController._oConfirmDialog.close();
          // Limpa callbacks
          oController._confirmCallback = null;
          oController._cancelCallback = null;
        }
      },

      /**
       * Limpa todos os dialogs do controller
       * @param {sap.ui.core.mvc.Controller} oController - Controller
       */
      destroyDialogs: function (oController) {
        if (oController._oEmployeeDialog) {
          oController._oEmployeeDialog.destroy();
          oController._oEmployeeDialog = null;
        }
        if (oController._oConfirmDialog) {
          oController._oConfirmDialog.destroy();
          oController._oConfirmDialog = null;
        }
      },

      /**
       * Formatters para uso nos fragments
       */
      formatters: {
        /**
         * Formata ícone baseado no estado do dialog
         */
        formatDialogIcon: function (sState) {
          switch (sState) {
            case "Success":
              return "sap-icon://accept";
            case "Warning":
              return "sap-icon://warning";
            case "Error":
              return "sap-icon://error";
            case "Information":
            default:
              return "sap-icon://information";
          }
        },

        /**
         * Formata cor do ícone baseado no estado
         */
        formatDialogIconColor: function (sState) {
          switch (sState) {
            case "Success":
              return "#107e3e";
            case "Warning":
              return "#e9730c";
            case "Error":
              return "#bb0000";
            case "Information":
            default:
              return "#0070f2";
          }
        },

        /**
         * Formata tipo do botão de confirmação
         */
        formatConfirmButtonType: function (sState) {
          switch (sState) {
            case "Warning":
            case "Error":
              return "Reject";
            case "Success":
              return "Accept";
            default:
              return "Emphasized";
          }
        },

        /**
         * Formata estado visual do status
         */
        formatStatusState: function (sStatus) {
          switch (sStatus) {
            case "Active":
            case "Ativo":
              return "Success";
            case "Inactive":
            case "Inativo":
              return "Error";
            case "On Leave":
            case "Em Licença":
              return "Warning";
            default:
              return "None";
          }
        }
      }
    };
  }
);
