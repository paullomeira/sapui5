sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
  ],
  (BaseController, JSONModel, Filter, FilterOperator, MessageBox, MessageToast) => {
    /**
     * Controller da Lista de Funcionários (EmployeeList Controller)
     *
     * Este controller gerencia a view de listagem de funcionários, implementando
     * funcionalidades essenciais para visualização e gerenciamento de dados:
     * - Listagem paginada de funcionários
     * - Busca e filtros avançados
     * - Seleção múltipla para ações em lote
     * - Navegação para detalhes e edição
     * - Operações CRUD (Create, Read, Update, Delete)
     *
     * Padrões implementados:
     * - Master-Detail Pattern: Lista como master para navegação
     * - Search and Filter Pattern: Busca em múltiplos campos
     * - Batch Operations: Ações em múltiplos registros
     * - Responsive Table: Adaptação para diferentes dispositivos
     *
     * @namespace sapui5.template.controller
     */
    return BaseController.extend("sapui5.template.controller.EmployeeList", {
      /**
       * Inicialização do Controller da Lista de Funcionários
       *
       * Configura o modelo de view para controle de estado da interface
       * e estabelece listeners para eventos de navegação. O modelo de view
       * mantém informações sobre seleções e estado da UI.
       *
       * @public
       * @override
       */
      onInit: function () {
        // Inicializa modelo de view para estado da interface
        const oViewModel = new JSONModel({
          selectedEmployees: [], // Array de funcionários selecionados
          isFilterBarVisible: true, // Controla visibilidade da barra de filtros
          totalCount: 0 // Total de registros (para paginação futura)
        });
        this.setModel(oViewModel, "view");

        // Obtém router e anexa evento de rota correspondente
        const oRouter = this.getRouter();
        oRouter.getRoute("RouteEmployeeList").attachPatternMatched(this._onRouteMatched, this);

        // Define título da página para acessibilidade
        this.setPageTitle(this.getResourceBundle().getText("pageTitle.employeeList", ["Lista de Funcionários"]));
      },

      /**
       * Handler de rota correspondente - atualiza a lista ao navegar para esta view
       *
       * Chamado sempre que o usuário navega para a lista de funcionários.
       * Garante que a view esteja em estado limpo e atualizado.
       *
       * @private
       */
      _onRouteMatched: function () {
        // Limpa filtros e busca existentes para estado limpo
        this._clearAllFilters();

        // Atualiza contagem total de registros
        this._updateTotalCount();
      },

      /**
       * Manipula funcionalidade de busca com capacidade de busca em tempo real
       *
       * Implementa busca avançada que permite encontrar funcionários através
       * de múltiplos campos simultaneamente. A busca é case-insensitive e
       * utiliza operador "Contains" para maior flexibilidade.
       *
       * Campos pesquisáveis:
       * - Nome (firstName)
       * - Sobrenome (lastName)
       * - Email
       * - Departamento
       * - Cargo (position)
       *
       * @param {sap.ui.base.Event} oEvent - Evento de busca
       * @public
       */
      onSearch: function (oEvent) {
        const sQuery = oEvent.getParameter("query") || oEvent.getParameter("newValue") || "";
        const oTable = this.byId("employeeTable");
        const oBinding = oTable.getBinding("items");

        if (!oBinding) {
          return;
        }

        const aFilters = [];

        // Cria filtros de busca para múltiplos campos
        if (sQuery && sQuery.length > 0) {
          const aSearchFilters = [
            new Filter("firstName", FilterOperator.Contains, sQuery),
            new Filter("lastName", FilterOperator.Contains, sQuery),
            new Filter("email", FilterOperator.Contains, sQuery),
            new Filter("department", FilterOperator.Contains, sQuery),
            new Filter("position", FilterOperator.Contains, sQuery)
          ];

          // Combina filtros de busca com lógica OR
          // Isso permite que o termo de busca seja encontrado em qualquer campo
          aFilters.push(
            new Filter({
              filters: aSearchFilters,
              and: false // Lógica OR: encontra em qualquer campo
            })
          );
        }

        // Aplica filtros existentes dos dropdowns
        this._applyAdditionalFilters(aFilters);

        // Aplica todos os filtros ao binding da tabela
        oBinding.filter(aFilters);

        // Atualiza contagem de resultados
        this._updateTotalCount();
      },

      /**
       * Manipula mudanças de filtro dos controles dropdown
       *
       * Chamado quando o usuário seleciona opções nos filtros de departamento
       * ou status. Combina filtros de dropdown com busca textual ativa.
       *
       * @param {sap.ui.base.Event} _oEvent - Evento de mudança de seleção
       * @public
       */
      onFilterChange: function (_oEvent) {
        const oTable = this.byId("employeeTable");
        const oBinding = oTable.getBinding("items");

        if (!oBinding) {
          return;
        }

        const aFilters = [];

        // Aplica filtro de busca se existir
        const sSearchQuery = this.byId("searchField").getValue();
        if (sSearchQuery) {
          const aSearchFilters = [
            new Filter("firstName", FilterOperator.Contains, sSearchQuery),
            new Filter("lastName", FilterOperator.Contains, sSearchQuery),
            new Filter("email", FilterOperator.Contains, sSearchQuery),
            new Filter("department", FilterOperator.Contains, sSearchQuery),
            new Filter("position", FilterOperator.Contains, sSearchQuery)
          ];

          aFilters.push(
            new Filter({
              filters: aSearchFilters,
              and: false
            })
          );
        }

        // Aplica filtros dos dropdowns
        this._applyAdditionalFilters(aFilters);

        // Aplica todos os filtros
        oBinding.filter(aFilters);

        // Atualiza contagem de resultados
        this._updateTotalCount();
      },

      /**
       * Aplica filtros adicionais dos controles dropdown
       *
       * Método utilitário que adiciona filtros específicos de departamento
       * e status ao array de filtros existente. Utiliza lógica AND para
       * combinar com outros filtros.
       *
       * @param {Array} aFilters - Array de filtros existentes para adicionar
       * @private
       */
      _applyAdditionalFilters: function (aFilters) {
        // Filtro de departamento
        const sDepartment = this.byId("departmentFilter").getSelectedKey();
        if (sDepartment) {
          aFilters.push(new Filter("department", FilterOperator.EQ, sDepartment));
        }

        // Filtro de status
        const sStatus = this.byId("statusFilter").getSelectedKey();
        if (sStatus) {
          aFilters.push(new Filter("status", FilterOperator.EQ, sStatus));
        }
      },

      /**
       * Limpa todos os filtros e busca
       *
       * Reseta a interface para estado inicial, removendo todos os filtros
       * aplicados e exibindo todos os registros disponíveis.
       *
       * @public
       */
      onClearFilters: function () {
        this._clearAllFilters();

        const oTable = this.byId("employeeTable");
        const oBinding = oTable.getBinding("items");
        if (oBinding) {
          oBinding.filter([]);
        }

        // Atualiza contagem total
        this._updateTotalCount();

        // Exibe mensagem de confirmação
        MessageToast.show(this.getResourceBundle().getText("msg.filtersCleared", ["Filtros removidos"]));
      },

      /**
       * Limpa todos os controles de filtro
       *
       * Método utilitário que reseta todos os campos de filtro para
       * seus valores padrão (vazios).
       *
       * @private
       */
      _clearAllFilters: function () {
        this.byId("searchField").setValue("");
        this.byId("departmentFilter").setSelectedKey("");
        this.byId("statusFilter").setSelectedKey("");
      },

      /**
       * Atualiza a contagem total de registros exibidos
       *
       * Calcula e atualiza o número de registros visíveis após aplicação
       * de filtros. Útil para feedback ao usuário sobre resultados.
       *
       * @private
       */
      _updateTotalCount: function () {
        const oTable = this.byId("employeeTable");
        const oBinding = oTable.getBinding("items");

        if (oBinding) {
          const iCount = oBinding.getLength();
          this.getModel("view").setProperty("/totalCount", iCount);
        }
      },

      /**
       * Handles navigation to employee details when a row is pressed
       * @param {sap.ui.base.Event} oEvent - The press event
       */
      onEmployeePress: function (oEvent) {
        const oBindingContext = oEvent.getSource().getBindingContext();
        const sEmployeeId = oBindingContext.getProperty("id");

        this.getRouter().navTo("RouteEmployeeDetail", {
          employeeId: sEmployeeId
        });
      },

      /**
       * Handles navigation to add new employee
       */
      onAddEmployee: function () {
        this.getRouter().navTo("RouteEmployeeCreate");
      },

      /**
       * Handles edit employee action
       * @param {sap.ui.base.Event} oEvent - The press event
       */
      onEditEmployee: function (oEvent) {
        const oBindingContext = oEvent.getSource().getBindingContext();
        const sEmployeeId = oBindingContext.getProperty("id");

        this.getRouter().navTo("RouteEmployeeForm", {
          employeeId: sEmployeeId
        });
      },

      /**
       * Handles delete single employee action
       * @param {sap.ui.base.Event} oEvent - The press event
       */
      onDeleteEmployee: function (oEvent) {
        const oBindingContext = oEvent.getSource().getBindingContext();
        const oEmployee = oBindingContext.getObject();

        this._confirmDelete([oEmployee]);
      },

      /**
       * Handles delete selected employees action
       */
      onDeleteSelected: function () {
        const oTable = this.byId("employeeTable");
        const aSelectedItems = oTable.getSelectedItems();

        if (aSelectedItems.length === 0) {
          MessageToast.show(this.getResourceBundle().getText("msg.noSelection"));
          return;
        }

        const aEmployees = aSelectedItems.map((oItem) => {
          return oItem.getBindingContext().getObject();
        });

        this._confirmDelete(aEmployees);
      },

      /**
       * Shows confirmation dialog for delete action
       * @param {Array} aEmployees - Array of employees to delete
       * @private
       */
      _confirmDelete: function (aEmployees) {
        let sMessage;
        const oResourceBundle = this.getResourceBundle();

        if (aEmployees.length === 1) {
          sMessage = oResourceBundle.getText("msg.deleteConfirm", [
            aEmployees[0].firstName + " " + aEmployees[0].lastName
          ]);
        } else {
          sMessage = oResourceBundle.getText("msg.deleteMultipleConfirm", [aEmployees.length]);
        }

        MessageBox.confirm(sMessage, {
          title: oResourceBundle.getText("title.confirm"),
          onClose: function (oAction) {
            if (oAction === MessageBox.Action.OK) {
              this._deleteEmployees(aEmployees);
            }
          }.bind(this)
        });
      },

      /**
       * Deletes employees from the model
       * @param {Array} aEmployees - Array of employees to delete
       * @private
       */
      _deleteEmployees: function (aEmployees) {
        const oModel = this.getModel();
        const aAllEmployees = oModel.getProperty("/employees");

        // Remove employees from the array
        aEmployees.forEach((oEmployeeToDelete) => {
          const iIndex = aAllEmployees.findIndex((oEmployee) => {
            return oEmployee.id === oEmployeeToDelete.id;
          });

          if (iIndex > -1) {
            aAllEmployees.splice(iIndex, 1);
          }
        });

        // Update the model
        oModel.setProperty("/employees", aAllEmployees);

        // Clear table selection
        const oTable = this.byId("employeeTable");
        oTable.removeSelections();

        // Show success message
        const oResourceBundle = this.getResourceBundle();
        const sMessage =
          aEmployees.length === 1
            ? oResourceBundle.getText("msg.deleteSuccess")
            : oResourceBundle.getText("msg.deleteMultipleSuccess", [aEmployees.length]);

        MessageToast.show(sMessage);
      },

      /**
       * Formatter for full name display
       * @param {string} sFirstName - First name
       * @returns {string} Formatted full name
       */
      formatFullName: function (sFirstName) {
        const oContext = this.getBindingContext();
        if (!oContext) {
          return sFirstName;
        }

        const sLastName = oContext.getProperty("lastName");
        return sFirstName + " " + sLastName;
      },

      /**
       * Formatter for status display
       * @param {string} sStatus - Status value
       * @returns {string} Formatted status text
       */
      formatStatus: function (sStatus) {
        const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        switch (sStatus) {
          case "Ativo":
            return oResourceBundle.getText("status.active");
          case "Inativo":
            return oResourceBundle.getText("status.inactive");
          default:
            return sStatus;
        }
      },

      /**
       * Formatter for status state (for ObjectStatus control)
       * @param {string} sStatus - Status value
       * @returns {string} Status state for styling
       */
      formatStatusState: function (sStatus) {
        switch (sStatus) {
          case "Ativo":
            return "Success";
          case "Inativo":
            return "Error";
          default:
            return "None";
        }
      }
    });
  }
);
