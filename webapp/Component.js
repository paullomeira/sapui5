sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "./model/models"], (UIComponent, Device, models) => {
  /**
   * Componente Principal da Aplicação SapUI5 Template
   *
   * Este componente serve como ponto de entrada da aplicação e é responsável por:
   * - Inicialização do router e navegação
   * - Configuração de modelos de dados globais
   * - Configuração de recursos de internacionalização
   * - Definição de configurações globais da aplicação
   *
   * O componente segue o padrão Component-based Architecture do UI5, onde
   * toda a aplicação é encapsulada em um componente reutilizável que pode
   * ser facilmente integrado em outras aplicações ou usado standalone.
   *
   * Configurações importantes:
   * - manifest.json: Define metadados, dependências e configura��ões
   * - Router: Gerencia navegação entre views
   * - Models: Configura modelos de dados globais
   *
   * @namespace sapui5.template
   */
  return UIComponent.extend("sapui5.template.Component", {
    metadata: {
      manifest: "json" // Indica que as configurações estão no manifest.json
    },

    /**
     * Inicialização do Componente
     *
     * Este método é chamado automaticamente pelo framework UI5 durante
     * a inicialização da aplicação. É responsável por configurar todos
     * os recursos necessários para o funcionamento da aplicação.
     *
     * Sequência de inicialização:
     * 1. Chama inicialização do componente pai (UIComponent)
     * 2. Inicializa o sistema de roteamento
     * 3. Configura modelos de dados globais
     * 4. Aplica configurações de densidade de conteúdo
     *
     * @public
     * @override
     */
    init: function () {
      // Chama a inicialização do componente pai
      // Essencial para garantir que todas as funcionalidades base sejam configuradas
      UIComponent.prototype.init.apply(this, arguments);

      // Inicializa o router para navegação entre views
      // O router é configurado no manifest.json com todas as rotas disponíveis
      this.getRouter().initialize();

      // Configura o modelo de dispositivo para responsividade
      // Contém informações sobre o tipo de dispositivo (desktop, tablet, phone)
      // e outras características que influenciam o layout da aplicação
      this.setModel(models.createDeviceModel(), "device");

      // Configura o modelo de dados dos funcionários
      // Este modelo contém os dados de exemplo da aplicação e serve como
      // simulação de um backend real. Em produção, seria substituído por
      // modelos OData ou outros serviços de dados
      this.setModel(models.createEmployeeModel(), "employee");

      // Configura o modelo de metadados da aplicação
      // Contém configurações, constantes e outros dados de configuração
      // que são utilizados globalmente na aplicação
      this.setModel(models.createMetadataModel(), "metadata");

      // Configura o modelo de produção com ordens/centros de trabalho
      this.setModel(models.createProductionModel(), "production");

      // Aplica classe CSS para densidade de conteúdo apropriada
      // Garante que a aplicação tenha a aparência correta em diferentes
      // tipos de dispositivos (touch vs. desktop)
      this._applyContentDensityClass();
    },

    /**
     * Aplica a classe CSS apropriada para densidade de conteúdo
     *
     * A densidade de conteúdo determina o espaçamento e tamanho dos elementos
     * da interface. Dispositivos touch precisam de elementos maiores e mais
     * espaçados, enquanto desktops podem ter elementos mais compactos.
     *
     * Classes disponíveis:
     * - sapUiSizeCompact: Para desktops (elementos menores)
     * - sapUiSizeCozy: Para dispositivos touch (elementos maiores)
     *
     * @private
     */
    _applyContentDensityClass: function () {
      const sContentDensityClass = this.getContentDensityClass();
      document.body.classList.add(sContentDensityClass);
    },

    /**
     * Determina a classe CSS apropriada para densidade de conteúdo
     *
     * Analisa o dispositivo atual e retorna a classe CSS apropriada
     * para otimizar a experiência do usuário.
     *
     * @returns {string} Nome da classe CSS para densidade de conteúdo
     * @public
     */
    getContentDensityClass: function () {
      // Verifica se é um dispositivo touch
      if (Device.support.touch) {
        // Dispositivos touch usam elementos maiores (Cozy)
        return "sapUiSizeCozy";
      } else {
        // Desktops usam elementos menores (Compact)
        return "sapUiSizeCompact";
      }
    },

    /**
     * Método de limpeza chamado quando o componente é destru��do
     *
     * Realiza limpeza de recursos para evitar vazamentos de memória.
     * Remove event listeners, destrói modelos e limpa referências.
     *
     * @public
     * @override
     */
    exit: function () {
      // Remove classe de densidade de conteúdo
      const sContentDensityClass = this.getContentDensityClass();
      document.body.classList.remove(sContentDensityClass);

      // Chama método de limpeza do componente pai
      UIComponent.prototype.exit.apply(this, arguments);
    }
  });
});
