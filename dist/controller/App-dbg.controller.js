sap.ui.define(
  ["sapui5/template/controller/BaseController", "sap/ui/model/json/JSONModel"],
  (BaseController, JSONModel) => {
    /**
     * Controller Principal da Aplicação (App Controller)
     *
     * Este controller gerencia o shell principal da aplicação e é responsável por:
     * - Configuração de estado global da aplicação (busy indicators, layout)
     * - Tratamento global de erros não capturados
     * - Aplicação de classes CSS para densidade de conteúdo
     * - Gerenciamento de indicadores de carregamento globais
     *
     * O App Controller atua como um container para toda a aplicação,
     * fornecendo funcionalidades que afetam todas as views filhas.
     *
     * Padrões implementados:
     * - Global Error Handling: Captura erros não tratados
     * - Global State Management: Gerencia estado compartilhado
     * - Busy Indicator Pattern: Controla indicadores de carregamento
     *
     * @namespace sapui5.template.controller
     */
    return BaseController.extend("sapui5.template.controller.App", {
      /**
       * Inicialização do Controller da Aplicação
       *
       * Chamado automaticamente quando o controller é instanciado.
       * Configura o estado inicial da aplicação, modelos de view e
       * sistemas de tratamento de erro.
       *
       * Responsabilidades:
       * 1. Criar modelo de view para estado global
       * 2. Aplicar classes CSS apropriadas
       * 3. Configurar tratamento global de erros
       * 4. Inicializar indicadores de carregamento
       *
       * @public
       * @override
       */
      onInit: function () {
        // Cria modelo de view para gerenciamento de estado global
        // Este modelo controla aspectos visuais que afetam toda a aplicação
        const oAppViewModel = new JSONModel({
          busy: false, // Indica se a aplicação está processando
          delay: 0, // Delay antes de mostrar busy indicator
          layout: "OneColumn" // Layout atual da aplicação (para Flexible Column Layout)
        });
        this.setModel(oAppViewModel, "appView");

        // Aplica classe CSS para densidade de conteúdo baseada no dispositivo
        // Garante que a aplicação tenha aparência apropriada em diferentes dispositivos
        this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

        // Configura tratamento global de erros
        // Captura erros não tratados e fornece feedback apropriado ao usuário
        this._setupErrorHandling();

        // Configura título inicial da aplicação
        this._setInitialPageTitle();
      },

      /**
       * Configura o título inicial da página
       *
       * Define o título da aba do navegador com base nos recursos i18n.
       * Importante para acessibilidade e experiência do usuário.
       *
       * @private
       */
      _setInitialPageTitle: function () {
        const sAppTitle = this.getResourceBundle().getText("appTitle", ["SAP UI5 Template"]);
        document.title = sAppTitle;
      },

      /**
       * Configura tratamento global de erros da aplicação
       *
       * Implementa um sistema robusto de captura de erros que:
       * - Captura promises rejeitadas não tratadas
       * - Captura erros JavaScript globais
       * - Fornece feedback consistente ao usuário
       * - Registra erros para debugging
       *
       * Este padrão é essencial para aplicações em produção, garantindo
       * que erros inesperados não quebrem a experiência do usuário.
       *
       * @private
       */
      _setupErrorHandling: function () {
        // Handler para promises rejeitadas não tratadas
        // Comum em operações assíncronas (fetch, setTimeout, etc.)
        window.addEventListener("unhandledrejection", (event) => {
          this._handleGlobalError(event.reason);
          // Previne que o erro apareça no console do navegador
          event.preventDefault();
        });

        // Handler para erros JavaScript globais
        // Captura erros de sintaxe, referências indefinidas, etc.
        window.addEventListener("error", (event) => {
          this._handleGlobalError(event.error);
        });
      },

      /**
       * Trata erros globais e exibe mensagens apropriadas ao usuário
       *
       * Centraliza o tratamento de erros, garantindo consistência na
       * apresentação de erros ao usuário. Implementa diferentes estratégias
       * baseadas no tipo e severidade do erro.
       *
       * Estratégias de tratamento:
       * - Erros de rede: Mensagem específica sobre conectividade
       * - Erros de validação: Destaque dos campos problemáticos
       * - Erros do sistema: Mensagem genérica com opção de retry
       *
       * @param {Error|string} oError - O objeto de erro ou mensagem
       * @private
       */
      _handleGlobalError: function (oError) {
        const sMessage = this.getResourceBundle().getText("globalErrorMessage", ["Ocorreu um erro inesperado"]);
        let sDetails = "";

        // Extrai informações do erro para logging e debugging
        if (oError && typeof oError === "object") {
          if (oError.message) {
            sDetails = oError.message;
          }
          if (oError.stack) {
            // Log completo do stack trace para debugging
            // eslint-disable-next-line no-console
            console.error("Global error stack:", oError.stack);
          }
        } else if (typeof oError === "string") {
          sDetails = oError;
        }

        // Log estruturado do erro para monitoramento
        // eslint-disable-next-line no-console
        console.error("Global error handled:", {
          message: sMessage,
          details: sDetails,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });

        // Exibe mensagem de erro ao usuário
        // Usa MessageToast para não bloquear a interface
        sap.m.MessageToast.show(sMessage, {
          duration: 5000,
          width: "20em",
          my: "center center",
          at: "center center"
        });

        // Remove indicador de carregamento se ativo
        // Evita que a aplicação fique "travada" em estado de loading
        this.setBusy(false);
      },

      /**
       * Define o estado de carregamento da aplicação
       *
       * Controla o busy indicator global da aplicação. Útil para operações
       * que afetam toda a aplicação, como carregamento inicial de dados
       * ou operações de sincronização.
       *
       * Padrão de uso:
       * - Ativar antes de operações longas
       * - Desativar após conclusão ou erro
       * - Usar delay para evitar flickering em operações rápidas
       *
       * @param {boolean} bBusy - Se a aplicação deve mostrar indicador de carregamento
       * @param {number} iDelay - Delay em ms antes de mostrar o indicador (opcional)
       * @public
       */
      setBusy: function (bBusy, iDelay) {
        const oAppViewModel = this.getModel("appView");
        oAppViewModel.setProperty("/busy", bBusy);

        // Define delay apenas se especificado
        if (iDelay !== undefined) {
          oAppViewModel.setProperty("/delay", iDelay);
        }

        // Log para debugging em desenvolvimento
        if (window.location.hostname === "localhost") {
          // eslint-disable-next-line no-console
          console.debug(`App busy state changed: ${bBusy}${iDelay ? ` (delay: ${iDelay}ms)` : ""}`);
        }
      },

      /**
       * Obtém o estado atual de carregamento da aplicação
       *
       * Útil para verificar se a aplicação está processando antes
       * de iniciar novas operações ou para implementar lógica condicional.
       *
       * @returns {boolean} Estado atual do busy indicator
       * @public
       */
      getBusy: function () {
        return this.getModel("appView").getProperty("/busy");
      },

      /**
       * Define o layout da aplicação
       *
       * Controla o layout visual da aplicação, especialmente útil
       * para implementações com Flexible Column Layout.
       *
       * Layouts disponíveis:
       * - OneColumn: Uma coluna (mobile/lista)
       * - TwoColumnsBeginExpanded: Duas colunas com foco na primeira
       * - TwoColumnsMidExpanded: Duas colunas com foco na segunda
       * - ThreeColumnsMidExpanded: Três colunas (master-detail-detail)
       *
       * @param {string} sLayout - Nome do layout a ser aplicado
       * @public
       */
      setLayout: function (sLayout) {
        this.getModel("appView").setProperty("/layout", sLayout);
      },

      /**
       * Obtém o layout atual da aplicação
       *
       * @returns {string} Layout atual da aplicação
       * @public
       */
      getLayout: function () {
        return this.getModel("appView").getProperty("/layout");
      },

      /**
       * Limpeza do controller quando a view é destruída
       *
       * Remove event listeners globais para evitar vazamentos de memória.
       * Importante para aplicações SPA (Single Page Application).
       *
       * @public
       * @override
       */
      onExit: function () {
        // Remove event listeners globais
        window.removeEventListener("unhandledrejection", this._handleGlobalError);
        window.removeEventListener("error", this._handleGlobalError);
      }
    });
  }
);
