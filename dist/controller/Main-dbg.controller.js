sap.ui.define(
  ["sapui5/template/controller/BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  (BaseController, JSONModel, MessageToast) => {
    /**
     * Controller da Página Principal (Main Controller)
     *
     * Este controller gerencia a página inicial da aplicação, funcionando como
     * um dashboard que apresenta:
     * - Estatísticas resumidas dos dados
     * - Navegação para diferentes seções da aplicação
     * - Atividades recentes do sistema
     * - Funcionalidades de demonstração (troca de idioma)
     *
     * Padrões implementados:
     * - Dashboard Pattern: Apresentação de métricas e KPIs
     * - Navigation Hub: Ponto central de navegação
     * - Data Aggregation: Cálculo de estatísticas em tempo real
     * - Internationalization: Demonstração de troca de idiomas
     *
     * @namespace sapui5.template.controller
     */
    return BaseController.extend("sapui5.template.controller.Main", {
      /**
       * Inicialização do Controller Principal
       *
       * Configura o modelo de view para o dashboard e carrega os dados
       * estatísticos iniciais. O modelo de view mantém o estado da interface
       * e os dados calculados para exibição.
       *
       * Estrutura do modelo de view:
       * - statistics: Métricas calculadas (funcionários, departamentos, etc.)
       * - recentActivity: Lista de atividades recentes do sistema
       *
       * @public
       * @override
       */
      onInit: function () {
        // Cria modelo de view para dados do dashboard
        // Este modelo mantém dados calculados e estado da interface
        const oMainViewModel = new JSONModel({
          statistics: {
            totalEmployees: 0, // Total de funcionários cadastrados
            activeDepartments: 0, // Número de departamentos ativos
            newHires: 0 // Contratações no mês atual
          },
          recentActivity: [] // Lista de atividades recentes
        });
        this.setModel(oMainViewModel, "mainView");

        // Carrega dados iniciais do dashboard
        this._loadDashboardData();

        // Define título da página para acessibilidade
        this.setPageTitle(this.getResourceBundle().getText("pageTitle.main", ["Página Principal"]));
      },

      /**
       * Carrega estatísticas do dashboard e dados de atividade recente
       *
       * Este método é responsável por calcular e atualizar todas as métricas
       * exibidas no dashboard. Ele agrega dados do modelo principal e
       * calcula estatísticas em tempo real.
       *
       * Métricas calculadas:
       * - Total de funcionários cadastrados
       * - Número de departamentos ativos
       * - Contratações no mês atual
       * - Lista de atividades recentes (últimos 30 dias)
       *
       * @private
       */
      _loadDashboardData: function () {
        const oMainModel = this.getModel("mainView");
        const oDataModel = this.getModel("employee");

        if (oDataModel) {
          const aEmployees = oDataModel.getProperty("/employees") || [];
          const aDepartments = oDataModel.getProperty("/departments") || [];

          // Calcula estatísticas baseadas nos dados atuais
          const iNewHires = this._calculateNewHires(aEmployees);

          // Atualiza o modelo de view com as estatísticas calculadas
          oMainModel.setData({
            statistics: {
              totalEmployees: aEmployees.length,
              activeDepartments: aDepartments.length,
              newHires: iNewHires
            },
            recentActivity: this._generateRecentActivity(aEmployees)
          });
        }
      },

      /**
       * Calcula o número de contratações no mês atual
       *
       * Filtra a lista de funcionários para encontrar aqueles contratados
       * no mês e ano atuais. Útil para métricas de RH e acompanhamento
       * de crescimento da equipe.
       *
       * @param {Array} aEmployees - Array de objetos de funcionários
       * @returns {number} Número de contratações no mês atual
       * @private
       */
      _calculateNewHires: function (aEmployees) {
        const oCurrentDate = new Date();
        const iCurrentMonth = oCurrentDate.getMonth();
        const iCurrentYear = oCurrentDate.getFullYear();

        return aEmployees.filter((oEmployee) => {
          if (oEmployee.hireDate) {
            const oHireDate = new Date(oEmployee.hireDate);
            return oHireDate.getMonth() === iCurrentMonth && oHireDate.getFullYear() === iCurrentYear;
          }
          return false;
        }).length;
      },

      /**
       * Gera dados de atividade recente para o dashboard
       *
       * Cria uma lista de atividades recentes baseada em eventos do sistema,
       * como contratações nos últimos 30 dias. Esta funcionalidade simula
       * um feed de atividades que seria comum em sistemas reais.
       *
       * Tipos de atividades rastreadas:
       * - Contratações de novos funcionários
       * - Mudanças de departamento (futuro)
       * - Promoções (futuro)
       *
       * @param {Array} aEmployees - Array de objetos de funcionários
       * @returns {Array} Array de itens de atividade recente
       * @private
       */
      _generateRecentActivity: function (aEmployees) {
        const aRecentActivity = [];

        // Obtém funcionários contratados nos últimos 30 dias
        const oThirtyDaysAgo = new Date();
        oThirtyDaysAgo.setDate(oThirtyDaysAgo.getDate() - 30);

        aEmployees.forEach((oEmployee) => {
          if (oEmployee.hireDate) {
            const oHireDate = new Date(oEmployee.hireDate);
            if (oHireDate >= oThirtyDaysAgo) {
              aRecentActivity.push({
                title: this.getResourceBundle().getText("activity.newEmployee", ["Novo Funcionário"]),
                description: `${oEmployee.firstName} ${oEmployee.lastName} ingressou em ${oEmployee.department}`,
                timestamp: this._formatDate(oHireDate),
                icon: "sap-icon://add-employee"
              });
            }
          }
        });

        // Ordena por mais recente primeiro
        aRecentActivity.sort((a, b) => {
          return new Date(b.timestamp) - new Date(a.timestamp);
        });

        // Limita a 5 itens mais recentes para não sobrecarregar a interface
        return aRecentActivity.slice(0, 5);
      },

      /**
       * Formata uma data para exibição
       *
       * Utiliza a localização do navegador para formatar datas de acordo
       * com as preferências regionais do usuário.
       *
       * @param {Date} oDate - Data a ser formatada
       * @returns {string} String de data formatada
       * @private
       */
      _formatDate: function (oDate) {
        return oDate.toLocaleDateString();
      },

      /**
       * Handler de navegação para o tile Lista de Funcionários
       *
       * Navega para a view de listagem de funcionários, onde o usuário
       * pode visualizar, filtrar e gerenciar todos os funcionários cadastrados.
       *
       * @public
       */
      onNavigateToEmployeeList: function () {
        this.navTo("RouteEmployeeList");
      },

      /**
       * Handler de navegação para o tile Adicionar Funcionário
       *
       * Navega diretamente para o formulário de criação de novo funcionário,
       * proporcionando acesso rápido à funcionalidade mais comum.
       *
       * @public
       */
      onNavigateToAddEmployee: function () {
        this.navTo("RouteEmployeeCreate");
      },

      /**
       * Handler de navegação para o tile Departamentos
       *
       * Funcionalidade planejada para gerenciamento de departamentos.
       * Atualmente exibe mensagem informativa sobre desenvolvimento futuro.
       *
       * Funcionalidades planejadas:
       * - Listagem de departamentos
       * - Criação/edição de departamentos
       * - Estatísticas por departamento
       * - Organograma da empresa
       *
       * @public
       */
      onNavigateToDepartments: function () {
        // Exibe mensagem informativa sobre funcionalidade em desenvolvimento
        const sMessage = this.getResourceBundle().getText("msg.departmentsComingSoon", [
          "Funcionalidade em desenvolvimento"
        ]);
        MessageToast.show(sMessage);
      },

      /**
       * Handler de navegação para o tile Relatórios
       *
       * Funcionalidade planejada para geração de relatórios e analytics.
       * Atualmente exibe mensagem informativa sobre desenvolvimento futuro.
       *
       * Funcionalidades planejadas:
       * - Relatórios de funcionários por departamento
       * - Gráficos de contratações por período
       * - Análise de turnover
       * - Exportação de dados (PDF, Excel)
       *
       * @public
       */
      onNavigateToReports: function () {
        // Exibe mensagem informativa sobre funcionalidade em desenvolvimento
        const sMessage = this.getResourceBundle().getText("msg.reportsComingSoon", ["Relatórios em desenvolvimento"]);
        MessageToast.show(sMessage);
      },

      /**
       * Chamado antes da renderização da view
       *
       * Atualiza os dados do dashboard sempre que a view é exibida,
       * garantindo que as estatísticas estejam sempre atualizadas.
       * Importante para refletir mudanças feitas em outras partes da aplicação.
       *
       * @public
       * @override
       */
      onBeforeRendering: function () {
        // Atualiza dados do dashboard quando a view é exibida
        this._loadDashboardData();
      },

      /**
       * Alterna o idioma da aplicação para demonstração de i18n
       *
       * Funcionalidade de demonstração que permite alternar entre
       * português e inglês para mostrar as capacidades de internacionalização
       * da aplicação. Em produção, o idioma seria determinado pelas
       * configurações do navegador ou preferências do usuário.
       *
       * Processo de troca de idioma:
       * 1. Atualiza configuração de locale do UI5
       * 2. Recarrega o resource bundle
       * 3. Força atualização de todos os bindings i18n
       * 4. Exibe confirmação ao usuário
       *
       * @param {string} sLanguage - Código do idioma (ex: "en", "pt")
       * @public
       */
      switchLanguage: function (sLanguage) {
        const oResourceModel = this.getModel("i18n");

        // Atualiza a configuração de locale do framework
        sap.ui.getCore().getConfiguration().setLanguage(sLanguage);

        // Recarrega o resource bundle com o novo idioma
        oResourceModel.getResourceBundle().then((_oBundle) => {
          // Força atualização de todos os bindings para refletir o novo idioma
          oResourceModel.refresh();

          // Atualiza título da página
          this.setPageTitle(this.getResourceBundle().getText("pageTitle.main", ["Página Principal"]));
        });

        // Exibe mensagem de confirmação no idioma apropriado
        const sMessage = sLanguage === "pt" ? "Idioma alterado para Português" : "Language changed to English";
        MessageToast.show(sMessage);
      }
    });
  }
);
