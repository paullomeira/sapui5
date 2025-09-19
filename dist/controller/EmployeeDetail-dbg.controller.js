sap.ui.define(
  [
    "sapui5/template/controller/BaseController",
    "sapui5/template/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
  ],
  (BaseController, formatter, JSONModel, _MessageBox, _MessageToast) => {
    /**
     * EmployeeDetail Controller
     *
     * Controlador responsável pela view de detalhes do funcionário.
     * Implementa funcionalidades para:
     * - Carregamento e exibição de dados do funcionário
     * - Navegação para formulário de edição
     * - Exclusão de funcionário com confirmação
     * - Navegação de volta para lista
     *
     * Padrões implementados:
     * - Binding de dados específicos do funcionário
     * - Tratamento de parâmetros de rota
     * - Confirmação de ações destrutivas
     * - Feedback visual para o usuário
     *
     * @namespace sapui5.template.controller
     */
    return BaseController.extend("sapui5.template.controller.EmployeeDetail", {
      formatter: formatter,

      /**
       * Inicialização do controlador
       *
       * Configura o roteamento e inicializa o modelo da view.
       * Registra o handler para a rota de detalhes do funcionário.
       *
       * @public
       */
      onInit: function () {
        // Inicializa modelo da view para controle de estado
        const oViewModel = new JSONModel({
          busy: false,
          delay: 0,
          title: "",
          employeeId: null,
          editMode: false
        });
        this.setModel(oViewModel, "view");

        // Registra handler para a rota de detalhes
        this.getRouter().getRoute("RouteEmployeeDetail").attachPatternMatched(this._onRouteMatched, this);
      },

      /**
       * Handler executado quando a rota é correspondida
       *
       * Extrai o ID do funcionário da URL e carrega os dados correspondentes.
       * Atualiza o modelo da view com as informações do funcionário selecionado.
       *
       * @param {sap.ui.base.Event} oEvent Evento de correspondência da rota
       * @private
       */
      _onRouteMatched: function (oEvent) {
        const sEmployeeId = oEvent.getParameter("arguments").employeeId;
        const oViewModel = this.getModel("view");

        // Atualiza o modelo da view com o ID do funcionário
        oViewModel.setProperty("/employeeId", sEmployeeId);
        oViewModel.setProperty("/busy", true);

        // Carrega os dados do funcionário
        this._loadEmployeeData(sEmployeeId);
      },

      /**
       * Carrega os dados do funcionário específico
       *
       * Busca o funcionário no modelo de dados baseado no ID fornecido.
       * Cria um modelo específico para o funcionário e o vincula à view.
       * Trata casos onde o funcionário não é encontrado.
       *
       * @param {string} sEmployeeId ID do funcionário a ser carregado
       * @private
       */
      _loadEmployeeData: function (sEmployeeId) {
        const oEmployeeModel = this.getModel("employee");
        const oViewModel = this.getModel("view");
        const aEmployees = oEmployeeModel.getProperty("/employees");

        // Busca o funcionário pelo ID
        const oEmployee = aEmployees.find((oEmp) => {
          return oEmp.id === sEmployeeId;
        });

        if (oEmployee) {
          // Cria modelo específico para o funcionário
          const oEmployeeDetailModel = new JSONModel(oEmployee);
          this.setModel(oEmployeeDetailModel, "employee");

          // Atualiza título da página
          const sTitle =
            this.getResourceBundle().getText("pageTitle.employeeDetail") +
            " - " +
            oEmployee.firstName +
            " " +
            oEmployee.lastName;
          this.setPageTitle(sTitle);
          oViewModel.setProperty("/title", sTitle);

          oViewModel.setProperty("/busy", false);
        } else {
          // Funcionário não encontrado
          this._handleEmployeeNotFound(sEmployeeId);
        }
      },

      /**
       * Trata o caso onde o funcionário não é encontrado
       *
       * Exibe mensagem de erro e navega de volta para a lista de funcionários.
       *
       * @param {string} sEmployeeId ID do funcionário não encontrado
       * @private
       */
      _handleEmployeeNotFound: function (sEmployeeId) {
        const oViewModel = this.getModel("view");
        const sMessage = "Funcionário com ID '" + sEmployeeId + "' não foi encontrado.";

        oViewModel.setProperty("/busy", false);

        this.showErrorMessage(sMessage, {
          onClose: function () {
            this.navTo("RouteEmployeeList");
          }.bind(this)
        });
      },

      /**
       * Handler para navegação para edição do funcionário
       *
       * Navega para o formulário de edição passando o ID do funcionário atual.
       *
       * @public
       */
      onEditEmployee: function () {
        const oViewModel = this.getModel("view");
        const sEmployeeId = oViewModel.getProperty("/employeeId");

        if (sEmployeeId) {
          this.navTo("RouteEmployeeForm", {
            employeeId: sEmployeeId
          });
        }
      },

      /**
       * Handler para exclusão do funcionário
       *
       * Exibe diálogo de confirmação antes de executar a exclusão.
       * Após confirmação, remove o funcionário do modelo e navega de volta.
       *
       * @public
       */
      onDeleteEmployee: function () {
        const oEmployeeData = this.getModel("employee").getData();
        const sEmployeeName = oEmployeeData.firstName + " " + oEmployeeData.lastName;
        const sMessage = this.getResourceBundle().getText("msg.deleteConfirm", [sEmployeeName]);

        this.showConfirmDialog(sMessage, this._executeDelete.bind(this), null, {
          title: this.getResourceBundle().getText("title.confirm")
        });
      },

      /**
       * Executa a exclusão do funcionário
       *
       * Remove o funcionário do modelo de dados principal e navega de volta
       * para a lista de funcionários. Exibe mensagem de sucesso.
       *
       * @private
       */
      _executeDelete: function () {
        const oViewModel = this.getModel("view");
        const sEmployeeId = oViewModel.getProperty("/employeeId");
        const oEmployeeModel = this.getOwnerComponent().getModel("employee");
        const aEmployees = oEmployeeModel.getProperty("/employees");

        // Encontra o índice do funcionário a ser removido
        const iEmployeeIndex = aEmployees.findIndex((oEmp) => {
          return oEmp.id === sEmployeeId;
        });

        if (iEmployeeIndex !== -1) {
          // Remove o funcionário do array
          aEmployees.splice(iEmployeeIndex, 1);
          oEmployeeModel.setProperty("/employees", aEmployees);

          // Atualiza estatísticas
          this._updateStatistics();

          // Exibe mensagem de sucesso
          const sMessage = this.getResourceBundle().getText("msg.deleteSuccess");
          this.showSuccessMessage(sMessage);

          // Navega de volta para a lista
          this.navTo("RouteEmployeeList", {}, {}, true);
        } else {
          // Erro ao encontrar funcionário
          this.showErrorMessage("Erro ao excluir funcionário. Funcionário não encontrado.");
        }
      },

      /**
       * Atualiza as estatísticas no modelo de metadados
       *
       * Recalcula o número total de funcionários e funcionários ativos
       * após operações de CRUD.
       *
       * @private
       */
      _updateStatistics: function () {
        const oEmployeeModel = this.getOwnerComponent().getModel("employee");
        const oMetadataModel = this.getOwnerComponent().getModel("metadata");
        const aEmployees = oEmployeeModel.getProperty("/employees");

        const iTotalEmployees = aEmployees.length;
        const iActiveEmployees = aEmployees.filter((oEmp) => {
          return oEmp.status === "Ativo";
        }).length;

        // Atualiza estatísticas
        oMetadataModel.setProperty("/statistics/totalEmployees", iTotalEmployees);
        oMetadataModel.setProperty("/statistics/activeEmployees", iActiveEmployees);
      },

      /**
       * Handler para navegação de volta
       *
       * Implementa navegação inteligente de volta, verificando o histórico
       * do navegador. Se não houver histórico, navega para a lista de funcionários.
       *
       * @public
       */
      onNavBack: function () {
        // Usa o método do BaseController com rota padrão personalizada
        this.onNavBack("RouteEmployeeList");
      },

      /**
       * Handler para refresh dos dados
       *
       * Recarrega os dados do funcionário atual, útil para atualizar
       * informações após edições em outras views.
       *
       * @public
       */
      onRefresh: function () {
        const oViewModel = this.getModel("view");
        const sEmployeeId = oViewModel.getProperty("/employeeId");

        if (sEmployeeId) {
          this._loadEmployeeData(sEmployeeId);
        }
      },

      /**
       * Handler para ações do IconTabBar
       *
       * Permite implementar ações específicas baseadas na aba selecionada
       * no header do ObjectHeader.
       *
       * @param {sap.ui.base.Event} oEvent Evento de seleção da aba
       * @public
       */
      onIconTabBarSelect: function (oEvent) {
        const sSelectedKey = oEvent.getParameter("key");

        // Implementar lógica específica baseada na aba selecionada
        switch (sSelectedKey) {
          case "contact":
            // Lógica para aba de contato
            break;
          case "employment":
            // Lógica para aba de emprego
            break;
          default:
            break;
        }
      },

      /**
       * Handler para ações de contato (email, telefone)
       *
       * Permite implementar ações específicas como abrir cliente de email
       * ou aplicativo de telefone.
       *
       * @param {sap.ui.base.Event} oEvent Evento de pressionar link
       * @public
       */
      onContactAction: function (oEvent) {
        const sAction = oEvent.getSource().data("action");
        const oEmployeeData = this.getModel("employee").getData();

        switch (sAction) {
          case "email":
            // Abrir cliente de email
            window.open("mailto:" + oEmployeeData.email);
            break;
          case "phone":
            // Abrir aplicativo de telefone
            window.open("tel:" + oEmployeeData.phone);
            break;
          default:
            break;
        }
      },

      /**
       * Cleanup ao sair da view
       *
       * Remove listeners e limpa recursos para evitar memory leaks.
       *
       * @public
       */
      onExit: function () {
        // Remove modelo específico do funcionário
        const oEmployeeModel = this.getModel("employee");
        if (oEmployeeModel) {
          oEmployeeModel.destroy();
        }
      }
    });
  }
);
