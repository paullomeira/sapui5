sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
  ],
  (Controller, History, UIComponent, MessageBox, MessageToast) => {
    /**
     * BaseController - Controlador base que fornece funcionalidades comuns
     *
     * Este controlador serve como base para todos os outros controladores da aplicação,
     * fornecendo métodos utilitários para navegação, acesso a modelos e recursos.
     * Seguindo o padrão DRY (Don't Repeat Yourself), centraliza funcionalidades
     * que seriam repetidas em múltiplos controladores.
     *
     * Padrões implementados:
     * - Acesso centralizado ao Router
     * - Métodos utilitários para navegação
     * - Acesso simplificado a modelos de dados
     * - Acesso a recursos de internacionalização
     * - Tratamento padronizado de mensagens
     *
     * @namespace sapui5.template.controller
     */
    return Controller.extend("sapui5.template.controller.BaseController", {
      /**
       * Obtém a instância do Router da aplicação
       *
       * O Router é responsável por gerenciar a navegação entre views na aplicação.
       * Este método fornece acesso centralizado ao router, evitando a necessidade
       * de obter a referência em cada controlador filho.
       *
       * @returns {sap.ui.core.routing.Router} A instância do router da aplicação
       * @public
       */
      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      /**
       * Obtém um modelo específico da aplicação
       *
       * Fornece acesso simplificado aos modelos de dados da aplicação.
       * Se nenhum nome for especificado, retorna o modelo padrão.
       *
       * Modelos disponíveis na aplicação:
       * - "employee": Dados dos funcionários
       * - "device": Informações do dispositivo
       * - "metadata": Configurações da aplicação
       * - "i18n": Recursos de internacionalização
       *
       * @param {string} sName Nome do modelo (opcional)
       * @returns {sap.ui.model.Model} A instância do modelo solicitado
       * @public
       */
      getModel: function (sName) {
        return this.getView().getModel(sName);
      },

      /**
       * Define um modelo na view atual
       *
       * Método utilitário para definir modelos na view de forma simplificada.
       * Útil para definir modelos locais específicos de uma view.
       *
       * @param {sap.ui.model.Model} oModel A instância do modelo
       * @param {string} sName Nome do modelo (opcional)
       * @returns {sap.ui.core.mvc.View} A view atual para method chaining
       * @public
       */
      setModel: function (oModel, sName) {
        return this.getView().setModel(oModel, sName);
      },

      /**
       * Obtém o bundle de recursos para internacionalização
       *
       * Fornece acesso aos textos internacionalizados da aplicação.
       * Utilizado para obter textos traduzidos baseados no idioma atual.
       *
       * Exemplo de uso:
       * var sTitle = this.getResourceBundle().getText("pageTitle");
       *
       * @returns {sap.ui.model.resource.ResourceModel} O bundle de recursos i18n
       * @public
       */
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      },

      /**
       * Navega para uma rota específica
       *
       * Método utilitário para navegação programática entre views.
       * Encapsula a lógica de navegação do Router, fornecendo uma interface
       * mais simples e consistente.
       *
       * @param {string} sName Nome da rota de destino
       * @param {object} oParameters Parâmetros da rota (opcional)
       * @param {object} oComponentTargetInfo Informações adicionais de navegação (opcional)
       * @param {boolean} bReplace Se true, substitui a entrada atual no histórico
       * @public
       */
      navTo: function (sName, oParameters, oComponentTargetInfo, bReplace) {
        this.getRouter().navTo(sName, oParameters, oComponentTargetInfo, bReplace);
      },

      /**
       * Executa navegação de volta (back navigation)
       *
       * Implementa a lógica padrão de navegação de volta, verificando o histórico
       * do navegador. Se houver histórico anterior, navega de volta; caso contrário,
       * navega para uma rota padrão (geralmente a página principal).
       *
       * Este padrão é comum em aplicações SAP Fiori para manter consistência
       * na experiência de navegação do usuário.
       *
       * @param {string} sDefaultRoute Rota padrão caso não haja histórico (opcional, padrão: "RouteMain")
       * @public
       */
      onNavBack: function (sDefaultRoute) {
        const sPreviousHash = History.getInstance().getPreviousHash();
        const sDefaultRouteName = sDefaultRoute || "RouteMain";

        if (sPreviousHash !== undefined) {
          // Há histórico anterior, navega de volta
          window.history.go(-1);
        } else {
          // Não há histórico, navega para a rota padrão
          this.navTo(sDefaultRouteName, {}, {}, true);
        }
      },

      /**
       * Obtém a referência do componente proprietário
       *
       * Método utilitário para acessar o componente principal da aplicação.
       * Útil para acessar configurações globais, modelos e outros recursos
       * definidos no nível do componente.
       *
       * @returns {sap.ui.core.UIComponent} O componente da aplicação
       * @public
       */
      getOwnerComponent: function () {
        return UIComponent.getRouterFor(this);
      },

      /**
       * Exibe uma mensagem de sucesso
       *
       * Método utilitário para exibir mensagens de feedback positivo ao usuário.
       * Utiliza MessageToast para uma experiência não-intrusiva.
       *
       * @param {string} sMessage Texto da mensagem
       * @param {object} mOptions Opções adicionais do MessageToast (opcional)
       * @public
       */
      showSuccessMessage: function (sMessage, mOptions) {
        MessageToast.show(
          sMessage,
          mOptions || {
            duration: 3000,
            width: "15em"
          }
        );
      },

      /**
       * Exibe uma mensagem de erro
       *
       * Método utilitário para exibir mensagens de erro ao usuário.
       * Utiliza MessageBox para garantir que o usuário veja a mensagem importante.
       *
       * @param {string} sMessage Texto da mensagem de erro
       * @param {object} mOptions Opções adicionais do MessageBox (opcional)
       * @public
       */
      showErrorMessage: function (sMessage, mOptions) {
        MessageBox.error(sMessage, mOptions || {});
      },

      /**
       * Exibe um diálogo de confirmação
       *
       * Método utilitário para solicitar confirmação do usuário antes de
       * executar ações importantes (como exclusão de dados).
       *
       * @param {string} sMessage Texto da mensagem de confirmação
       * @param {function} fnOnConfirm Callback executado quando o usuário confirma
       * @param {function} fnOnCancel Callback executado quando o usuário cancela (opcional)
       * @param {object} mOptions Opções adicionais do MessageBox (opcional)
       * @public
       */
      showConfirmDialog: function (sMessage, fnOnConfirm, fnOnCancel, mOptions) {
        const oOptions = Object.assign(
          {
            title: this.getResourceBundle().getText("confirmDialogTitle", ["Confirmação"]),
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            emphasizedAction: MessageBox.Action.YES,
            onClose: function (sAction) {
              if (sAction === MessageBox.Action.YES && fnOnConfirm) {
                fnOnConfirm();
              } else if (sAction === MessageBox.Action.NO && fnOnCancel) {
                fnOnCancel();
              }
            }
          },
          mOptions || {}
        );

        MessageBox.confirm(sMessage, oOptions);
      },

      /**
       * Obtém um parâmetro da URL atual
       *
       * Método utilitário para extrair parâmetros da rota atual.
       * Útil para obter IDs de entidades ou outros parâmetros de navegação.
       *
       * @param {string} sParameterName Nome do parâmetro
       * @returns {string} Valor do parâmetro ou undefined se não encontrado
       * @public
       */
      getRouteParameter: function (sParameterName) {
        const oRouter = this.getRouter();
        const oRoute = oRouter.getRoute(oRouter.getHashChanger().getHash());

        if (oRoute && oRoute.getParameters) {
          return oRoute.getParameters()[sParameterName];
        }

        return undefined;
      },

      /**
       * Define o título da página atual
       *
       * Método utilitário para definir o título da página de forma consistente.
       * Atualiza tanto o título da view quanto o título da aba do navegador.
       *
       * @param {string} sTitle Título da página
       * @public
       */
      setPageTitle: function (sTitle) {
        // Define o título no modelo da view para uso em controles
        const oViewModel = this.getModel("view");
        if (oViewModel) {
          oViewModel.setProperty("/title", sTitle);
        }

        // Define o título da aba do navegador
        document.title = sTitle + " - " + this.getResourceBundle().getText("appTitle", ["SAP UI5 Template"]);
      }
    });
  }
);
