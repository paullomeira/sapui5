sap.ui.define(
  [
    "sapui5/template/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/ValueState",
    "sap/ui/core/message/Message",
    "sap/ui/core/message/MessageType"
  ],
  (BaseController, JSONModel, MessageBox, ValueState, _Message, _MessageType) => {
    /**
     * EmployeeForm Controller - Controlador para formulário de criação/edição de funcionários
     *
     * Este controlador gerencia o formulário de funcionários, incluindo:
     * - Validação de campos obrigatórios e formatos
     * - Lógica de salvamento (create/update)
     * - Navegação de retorno após salvamento
     * - Tratamento de estados de validação visual
     *
     * Padrões implementados:
     * - Validação em tempo real com feedback visual
     * - Separação entre modo criação e edição
     * - Tratamento de erros com mensagens específicas
     * - Navegação consistente com histórico
     *
     * @namespace sapui5.template.controller
     */
    return BaseController.extend("sapui5.template.controller.EmployeeForm", {
      /**
       * Inicialização do controlador
       * Configura o modelo da view e vincula eventos de roteamento
       * @public
       */
      onInit: function () {
        // Inicializa modelo da view com estados de validação
        const oViewModel = new JSONModel({
          title: "",
          mode: "create", // "create" ou "edit"
          saveEnabled: false,
          // Estados de validação para cada campo
          firstNameState: ValueState.None,
          firstNameStateText: "",
          lastNameState: ValueState.None,
          lastNameStateText: "",
          emailState: ValueState.None,
          emailStateText: "",
          phoneState: ValueState.None,
          phoneStateText: "",
          departmentState: ValueState.None,
          departmentStateText: "",
          positionState: ValueState.None,
          positionStateText: "",
          hireDateState: ValueState.None,
          hireDateStateText: "",
          salaryState: ValueState.None,
          salaryStateText: "",
          statusState: ValueState.None,
          statusStateText: ""
        });
        this.setModel(oViewModel, "view");

        // Vincula eventos de roteamento
        this.getRouter().getRoute("RouteEmployeeForm").attachPatternMatched(this._onRouteMatched, this);
        this.getRouter().getRoute("RouteEmployeeCreate").attachPatternMatched(this._onRouteMatched, this);
      },

      /**
       * Manipulador de evento quando a rota é correspondida
       * Configura o formulário baseado no modo (criar/editar)
       * @param {sap.ui.base.Event} oEvent Evento de roteamento
       * @private
       */
      _onRouteMatched: function (oEvent) {
        const sRouteName = oEvent.getParameter("name");
        const oArguments = oEvent.getParameter("arguments");

        // Limpa mensagens anteriores
        this._hideMessageStrip();

        if (sRouteName === "RouteEmployeeCreate") {
          // Modo criação
          this._setupCreateMode();
        } else if (sRouteName === "RouteEmployeeForm") {
          // Modo edição
          const sEmployeeId = oArguments.employeeId;
          this._setupEditMode(sEmployeeId);
        }

        // Valida formulário inicial
        this._validateForm();
      },

      /**
       * Configura o formulário para modo de criação
       * @private
       */
      _setupCreateMode: function () {
        const oViewModel = this.getModel("view");
        const oEmployeeModel = new JSONModel({
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          department: "",
          position: "",
          hireDate: new Date(),
          salary: 0,
          status: "Ativo"
        });

        // Configura modelos e título
        this.setModel(oEmployeeModel, "employee");
        oViewModel.setProperty("/mode", "create");
        oViewModel.setProperty(
          "/title",
          this.getResourceBundle().getText("pageTitle.employeeForm") + " - New Employee"
        );
        this.setPageTitle("New Employee");

        // Reset validation states
        this._resetValidationStates();
      },

      /**
       * Configura o formulário para modo de edição
       * @param {string} sEmployeeId ID do funcionário a ser editado
       * @private
       */
      _setupEditMode: function (sEmployeeId) {
        const oViewModel = this.getModel("view");
        const oEmployeeData = this.getModel().getData();
        const oEmployee = oEmployeeData.employees.find((emp) => {
          return emp.id === sEmployeeId;
        });

        if (!oEmployee) {
          // Funcionário não encontrado, navega de volta
          this.showErrorMessage("Employee not found");
          this.onNavBack();
          return;
        }

        // Cria cópia do funcionário para edição
        const oEmployeeModel = new JSONModel(Object.assign({}, oEmployee));
        this.setModel(oEmployeeModel, "employee");

        // Configura título e modo
        oViewModel.setProperty("/mode", "edit");
        oViewModel.setProperty(
          "/title",
          this.getResourceBundle().getText("pageTitle.employeeForm") +
            " - " +
            oEmployee.firstName +
            " " +
            oEmployee.lastName
        );
        this.setPageTitle("Edit Employee - " + oEmployee.firstName + " " + oEmployee.lastName);

        // Reset validation states
        this._resetValidationStates();
      },

      /**
       * Manipulador de mudança de campo
       * Executa validação em tempo real
       * @param {sap.ui.base.Event} oEvent Evento de mudança
       * @public
       */
      onFieldChange: function (_oEvent) {
        // Pequeno delay para permitir que o binding seja atualizado
        setTimeout(() => {
          this._validateForm();
        }, 100);
      },

      /**
       * Manipulador do botão Salvar
       * Valida e salva o funcionário
       * @public
       */
      onSave: function () {
        if (!this._validateForm()) {
          this._showMessageStrip("Please correct the errors before saving", "Error");
          return;
        }

        const oViewModel = this.getModel("view");
        const oEmployeeData = this.getModel("employee").getData();
        const sMode = oViewModel.getProperty("/mode");

        if (sMode === "create") {
          this._createEmployee(oEmployeeData);
        } else {
          this._updateEmployee(oEmployeeData);
        }
      },

      /**
       * Manipulador do botão Cancelar
       * Navega de volta sem salvar
       * @public
       */
      onCancel: function () {
        this.onNavBack();
      },

      /**
       * Cria um novo funcionário
       * @param {object} oEmployeeData Dados do funcionário
       * @private
       */
      _createEmployee: function (oEmployeeData) {
        const oMainModel = this.getModel();
        const aEmployees = oMainModel.getProperty("/employees");

        // Gera novo ID
        const iMaxId = Math.max.apply(
          Math,
          aEmployees.map((emp) => {
            return parseInt(emp.id, 10);
          })
        );
        oEmployeeData.id = String(iMaxId + 1).padStart(3, "0");

        // Adiciona ao modelo principal
        aEmployees.push(oEmployeeData);
        oMainModel.setProperty("/employees", aEmployees);

        // Atualiza estatísticas
        this._updateStatistics();

        // Feedback e navegação
        this.showSuccessMessage(this.getResourceBundle().getText("msg.saveSuccess"));
        this.navTo("RouteEmployeeDetail", {
          employeeId: oEmployeeData.id
        });
      },

      /**
       * Atualiza um funcionário existente
       * @param {object} oEmployeeData Dados do funcionário
       * @private
       */
      _updateEmployee: function (oEmployeeData) {
        const oMainModel = this.getModel();
        const aEmployees = oMainModel.getProperty("/employees");
        const iIndex = aEmployees.findIndex((emp) => {
          return emp.id === oEmployeeData.id;
        });

        if (iIndex !== -1) {
          // Atualiza funcionário existente
          aEmployees[iIndex] = oEmployeeData;
          oMainModel.setProperty("/employees", aEmployees);

          // Feedback e navegação
          this.showSuccessMessage(this.getResourceBundle().getText("msg.saveSuccess"));
          this.navTo("RouteEmployeeDetail", {
            employeeId: oEmployeeData.id
          });
        } else {
          this.showErrorMessage("Employee not found for update");
        }
      },

      /**
       * Atualiza estatísticas no modelo de metadados
       * @private
       */
      _updateStatistics: function () {
        const oMainModel = this.getModel();
        const aEmployees = oMainModel.getProperty("/employees");
        const iActiveEmployees = aEmployees.filter((emp) => {
          return emp.status === "Ativo";
        }).length;

        // Atualiza estatísticas se o modelo de metadados existir
        if (oMainModel.getProperty("/statistics")) {
          oMainModel.setProperty("/statistics/totalEmployees", aEmployees.length);
          oMainModel.setProperty("/statistics/activeEmployees", iActiveEmployees);
        }
      },

      /**
       * Valida todos os campos do formulário
       * @returns {boolean} True se válido, false caso contrário
       * @private
       */
      _validateForm: function () {
        const oEmployeeData = this.getModel("employee").getData();
        const oViewModel = this.getModel("view");
        let bValid = true;

        // Validação de campos obrigatórios
        bValid = this._validateRequiredField("firstName", oEmployeeData.firstName, "First name is required") && bValid;
        bValid = this._validateRequiredField("lastName", oEmployeeData.lastName, "Last name is required") && bValid;
        bValid =
          this._validateRequiredField("department", oEmployeeData.department, "Department is required") && bValid;
        bValid = this._validateRequiredField("position", oEmployeeData.position, "Position is required") && bValid;
        bValid = this._validateRequiredField("status", oEmployeeData.status, "Status is required") && bValid;

        // Validação de email
        bValid = this._validateEmail(oEmployeeData.email) && bValid;

        // Validação de data de contratação
        bValid = this._validateHireDate(oEmployeeData.hireDate) && bValid;

        // Validação de salário
        bValid = this._validateSalary(oEmployeeData.salary) && bValid;

        // Atualiza estado do botão salvar
        oViewModel.setProperty("/saveEnabled", bValid);

        return bValid;
      },

      /**
       * Valida um campo obrigatório
       * @param {string} sFieldName Nome do campo
       * @param {string} sValue Valor do campo
       * @param {string} sErrorMessage Mensagem de erro
       * @returns {boolean} True se válido
       * @private
       */
      _validateRequiredField: function (sFieldName, sValue, sErrorMessage) {
        const oViewModel = this.getModel("view");
        const bValid = sValue && sValue.trim().length > 0;

        oViewModel.setProperty("/" + sFieldName + "State", bValid ? ValueState.None : ValueState.Error);
        oViewModel.setProperty("/" + sFieldName + "StateText", bValid ? "" : sErrorMessage);

        return bValid;
      },

      /**
       * Valida formato de email
       * @param {string} sEmail Email a ser validado
       * @returns {boolean} True se válido
       * @private
       */
      _validateEmail: function (sEmail) {
        const oViewModel = this.getModel("view");
        const bRequired = sEmail && sEmail.trim().length > 0;
        let bValidFormat = true;

        if (bRequired) {
          const oEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          bValidFormat = oEmailRegex.test(sEmail);
        }

        const bValid = bRequired && bValidFormat;
        const sErrorMessage = !bRequired
          ? "Email is required"
          : !bValidFormat
            ? "Please enter a valid email address"
            : "";

        oViewModel.setProperty("/emailState", bValid ? ValueState.None : ValueState.Error);
        oViewModel.setProperty("/emailStateText", sErrorMessage);

        return bValid;
      },

      /**
       * Valida data de contratação
       * @param {Date} dHireDate Data de contratação
       * @returns {boolean} True se válido
       * @private
       */
      _validateHireDate: function (dHireDate) {
        const oViewModel = this.getModel("view");
        let bValid = dHireDate instanceof Date && !isNaN(dHireDate.getTime());
        let sErrorMessage = bValid ? "" : "Please select a valid hire date";

        // Verifica se a data não é futura
        if (bValid && dHireDate > new Date()) {
          bValid = false;
          sErrorMessage = "Hire date cannot be in the future";
        }

        oViewModel.setProperty("/hireDateState", bValid ? ValueState.None : ValueState.Error);
        oViewModel.setProperty("/hireDateStateText", sErrorMessage);

        return bValid;
      },

      /**
       * Valida salário
       * @param {number} nSalary Salário a ser validado
       * @returns {boolean} True se válido
       * @private
       */
      _validateSalary: function (nSalary) {
        const oViewModel = this.getModel("view");
        const bValid = !isNaN(nSalary) && nSalary > 0;
        const sErrorMessage = bValid ? "" : "Please enter a valid salary amount greater than 0";

        oViewModel.setProperty("/salaryState", bValid ? ValueState.None : ValueState.Error);
        oViewModel.setProperty("/salaryStateText", sErrorMessage);

        return bValid;
      },

      /**
       * Reseta todos os estados de validação
       * @private
       */
      _resetValidationStates: function () {
        const oViewModel = this.getModel("view");
        const aFields = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "department",
          "position",
          "hireDate",
          "salary",
          "status"
        ];

        aFields.forEach((sField) => {
          oViewModel.setProperty("/" + sField + "State", ValueState.None);
          oViewModel.setProperty("/" + sField + "StateText", "");
        });
      },

      /**
       * Exibe uma mensagem no MessageStrip
       * @param {string} sMessage Mensagem a ser exibida
       * @param {string} sType Tipo da mensagem (Success, Warning, Error, Information)
       * @private
       */
      _showMessageStrip: function (sMessage, sType) {
        const oMessageStrip = this.byId("messageStrip");
        oMessageStrip.setText(sMessage);
        oMessageStrip.setType(sType || "Information");
        oMessageStrip.setVisible(true);
      },

      /**
       * Oculta o MessageStrip
       * @private
       */
      _hideMessageStrip: function () {
        const oMessageStrip = this.byId("messageStrip");
        oMessageStrip.setVisible(false);
      }
    });
  }
);
