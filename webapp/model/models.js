sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device"], (JSONModel, Device) => {
  /**
   * Fábrica de Modelos de Dados
   *
   * Este módulo centraliza a criação de todos os modelos de dados utilizados
   * na aplicação. Seguindo o padrão Factory, fornece métodos para criar
   * diferentes tipos de modelos com configurações apropriadas.
   *
   * Tipos de modelos criados:
   * - Device Model: Informações sobre o dispositivo/navegador
   * - Employee Model: Dados de funcionários (simulação de backend)
   * - Metadata Model: Configurações e metadados da aplicação
   *
   * Vantagens desta abordagem:
   * - Centralização da configuração de modelos
   * - Reutilização de código
   * - Facilita manutenção e testes
   * - Separação clara entre dados e lógica de negócio
   *
   * @namespace sapui5.template.model
   */
  return {
    /**
     * Cria modelo com informações do dispositivo para responsividade
     *
     * O Device Model contém informações sobre o dispositivo onde a aplicação
     * está executando, incluindo tipo de dispositivo, sistema operacional,
     * navegador e capacidades touch. Essencial para implementar interfaces
     * responsivas que se adaptam ao contexto de uso.
     *
     * Informações disponíveis:
     * - device.system: Sistema operacional (iOS, Android, Windows, etc.)
     * - device.browser: Navegador (Chrome, Safari, Firefox, etc.)
     * - device.support.touch: Suporte a touch
     * - device.resize: Capacidades de redimensionamento
     *
     * Configurações aplicadas:
     * - OneWay binding: Dados não mudam durante execução
     * - Read-only: Informações são apenas para consulta
     *
     * @returns {sap.ui.model.json.JSONModel} Modelo de informações do dispositivo
     * @public
     */
    createDeviceModel: function () {
      const oModel = new JSONModel(Device);
      // Define modo de binding como OneWay pois dados do dispositivo não mudam
      oModel.setDefaultBindingMode("OneWay");
      return oModel;
    },

    /**
     * Cria modelo de dados de funcionários com dados de exemplo
     *
     * Este modelo simula um backend real, fornecendo dados estruturados
     * para demonstrar todas as funcionalidades da aplicação. Em produção,
     * seria substituído por modelos OData ou outros serviços de dados.
     *
     * Estrutura de dados:
     * - employees: Array com dados completos de funcionários
     * - departments: Lista de departamentos disponíveis
     * - positions: Cargos/posições disponíveis na empresa
     * - statusOptions: Opções de status com estados visuais
     *
     * Funcionalidades suportadas:
     * - CRUD completo de funcionários
     * - Filtros por departamento e status
     * - Busca em múltiplos campos
     * - Validação de dados
     * - Formatação de valores
     *
     * @returns {sap.ui.model.json.JSONModel} Modelo de dados de funcionários
     * @public
     */
    createEmployeeModel: function () {
      const oData = {
        // Array principal com dados dos funcionários
        // Cada funcionário possui campos completos para demonstrar
        // diferentes tipos de dados e formatações
        employees: [
          {
            id: "001",
            firstName: "João",
            lastName: "Silva",
            email: "joao.silva@empresa.com",
            department: "TI",
            position: "Desenvolvedor Senior",
            hireDate: "2020-01-15",
            salary: 8500.0,
            status: "Ativo",
            phone: "+55 11 99999-1234",
            address: "Rua das Flores, 123 - São Paulo, SP"
          },
          {
            id: "002",
            firstName: "Maria",
            lastName: "Santos",
            email: "maria.santos@empresa.com",
            department: "RH",
            position: "Analista de RH",
            hireDate: "2019-03-22",
            salary: 6200.0,
            status: "Ativo",
            phone: "+55 11 88888-5678",
            address: "Av. Paulista, 456 - São Paulo, SP"
          },
          {
            id: "003",
            firstName: "Carlos",
            lastName: "Oliveira",
            email: "carlos.oliveira@empresa.com",
            department: "FIN",
            position: "Controller Financeiro",
            hireDate: "2018-07-10",
            salary: 9200.0,
            status: "Ativo",
            phone: "+55 11 77777-9012",
            address: "Rua Augusta, 789 - São Paulo, SP"
          },
          {
            id: "004",
            firstName: "Ana",
            lastName: "Costa",
            email: "ana.costa@empresa.com",
            department: "TI",
            position: "Desenvolvedora Pleno",
            hireDate: "2021-05-18",
            salary: 7000.0,
            status: "Ativo",
            phone: "+55 11 66666-3456",
            address: "Rua Oscar Freire, 321 - São Paulo, SP"
          },
          {
            id: "005",
            firstName: "Pedro",
            lastName: "Ferreira",
            email: "pedro.ferreira@empresa.com",
            department: "VEN",
            position: "Gerente de Vendas",
            hireDate: "2017-11-30",
            salary: 10500.0,
            status: "Férias",
            phone: "+55 11 55555-7890",
            address: "Rua Consolação, 654 - São Paulo, SP"
          },
          {
            id: "006",
            firstName: "Lucia",
            lastName: "Almeida",
            email: "lucia.almeida@empresa.com",
            department: "RH",
            position: "Coordenadora de RH",
            hireDate: "2016-02-14",
            salary: 8800.0,
            status: "Licença",
            phone: "+55 11 44444-2468",
            address: "Rua Frei Caneca, 987 - São Paulo, SP"
          }
        ],

        // Lista de departamentos com informações detalhadas
        // Utilizada para filtros, validação e exibição de informações organizacionais
        departments: [
          {
            key: "TI", // Chave única para referência
            text: "Tecnologia da Informação", // Nome para exibição
            description: "Desenvolvimento e manutenção de sistemas", // Descrição detalhada
            manager: "João Silva" // Gestor responsável
          },
          {
            key: "RH",
            text: "Recursos Humanos",
            description: "Gestão de pessoas e processos de RH",
            manager: "Lucia Almeida"
          },
          {
            key: "FIN",
            text: "Financeiro",
            description: "Controle financeiro e contabilidade",
            manager: "Carlos Oliveira"
          },
          {
            key: "VEN",
            text: "Vendas",
            description: "Gestão comercial e relacionamento com clientes",
            manager: "Pedro Ferreira"
          },
          {
            key: "MKT",
            text: "Marketing",
            description: "Marketing digital e comunicação",
            manager: "Em contratação" // Indica vaga em aberto
          }
        ],

        // Lista de posições/cargos disponíveis na empresa
        // Utilizada em formulários de criação/edição para padronizar nomenclatura
        positions: [
          { key: "DEV_JR", text: "Desenvolvedor Junior" },
          { key: "DEV_PL", text: "Desenvolvedor Pleno" },
          { key: "DEV_SR", text: "Desenvolvedor Senior" },
          { key: "ANA_RH", text: "Analista de RH" },
          { key: "COORD_RH", text: "Coordenadora de RH" },
          { key: "CTRL_FIN", text: "Controller Financeiro" },
          { key: "GER_VEN", text: "Gerente de Vendas" },
          { key: "ANA_MKT", text: "Analista de Marketing" }
        ],

        // Opções de status com estados visuais correspondentes
        // O campo 'state' define a cor/ícone usado nos controles ObjectStatus
        statusOptions: [
          { key: "Ativo", text: "Ativo", state: "Success" }, // Verde
          { key: "Férias", text: "Férias", state: "Warning" }, // Amarelo
          { key: "Licença", text: "Licença", state: "Information" }, // Azul
          { key: "Inativo", text: "Inativo", state: "Error" } // Vermelho
        ]
      };

      // Cria modelo JSON com dados estruturados
      const oModel = new JSONModel(oData);

      // Configura modelo para permitir modificações (TwoWay binding)
      // Necessário para operações CRUD funcionarem corretamente
      oModel.setDefaultBindingMode("TwoWay");

      return oModel;
    },

    /**
     * Cria modelo de metadados e configurações da aplicação
     *
     * Este modelo contém informações sobre a aplicação, configurações
     * globais e estatísticas calculadas. Utilizado para personalização
     * da interface e controle de comportamentos da aplicação.
     *
     * Seções do modelo:
     * - appInfo: Informações básicas da aplicação
     * - settings: Configurações de comportamento
     * - statistics: Estatísticas calculadas (atualizadas dinamicamente)
     *
     * Casos de uso:
     * - Exibição de informações "Sobre" da aplicação
     * - Controle de paginação e limites
     * - Configurações de tema e aparência
     * - Dashboard com estatísticas
     *
     * @returns {sap.ui.model.json.JSONModel} Modelo de metadados
     * @public
     */
    /**
     * Cria modelo de produção com ordens e operações por centro de trabalho
     *
     * Estrutura:
     * - workCenters: [{ id, name, plant, orders: [{ orderId, material, description, dueDate, criticality, operations: [{ operationId, description, sequence, status, workCenterId, plannedStart, plannedFinish, durationMin }] }]}]
     *
     * @returns {sap.ui.model.json.JSONModel} Modelo de dados de produção
     */
    createProductionModel: function () {
      const oData = {
        workCenters: [
          {
            id: "WC-100",
            name: "Usinagem CNC",
            plant: "1000",
            orders: [
              {
                orderId: "MO-450001",
                material: "MAT-AX12",
                description: "Eixo Cardan - Lote A",
                dueDate: "2025-09-25",
                criticality: "High",
                operations: [
                  {
                    operationId: "0100",
                    description: "Preparação de máquina",
                    sequence: 100,
                    status: "Open",
                    workCenterId: "WC-100",
                    plannedStart: "2025-09-22T08:00:00Z",
                    plannedFinish: "2025-09-22T08:30:00Z",
                    durationMin: 30
                  },
                  {
                    operationId: "0200",
                    description: "Usinagem CNC",
                    sequence: 200,
                    status: "Open",
                    workCenterId: "WC-100",
                    plannedStart: "2025-09-22T08:30:00Z",
                    plannedFinish: "2025-09-22T10:30:00Z",
                    durationMin: 120
                  },
                  {
                    operationId: "0300",
                    description: "Inspeção dimensional",
                    sequence: 300,
                    status: "Open",
                    workCenterId: "WC-100",
                    plannedStart: "2025-09-22T10:30:00Z",
                    plannedFinish: "2025-09-22T11:00:00Z",
                    durationMin: 30
                  }
                ]
              },
              {
                orderId: "MO-450002",
                material: "MAT-PL34",
                description: "Placa de Base - Lote C",
                dueDate: "2025-09-24",
                criticality: "Medium",
                operations: [
                  {
                    operationId: "0100",
                    description: "Set-up",
                    sequence: 100,
                    status: "Open",
                    workCenterId: "WC-100",
                    plannedStart: "2025-09-22T12:00:00Z",
                    plannedFinish: "2025-09-22T12:20:00Z",
                    durationMin: 20
                  },
                  {
                    operationId: "0200",
                    description: "Fresamento",
                    sequence: 200,
                    status: "Open",
                    workCenterId: "WC-100",
                    plannedStart: "2025-09-22T12:20:00Z",
                    plannedFinish: "2025-09-22T14:20:00Z",
                    durationMin: 120
                  }
                ]
              }
            ]
          },
          {
            id: "WC-200",
            name: "Montagem Final",
            plant: "1000",
            orders: [
              {
                orderId: "MO-450010",
                material: "KIT-MF10",
                description: "Conjunto Motor - Série X",
                dueDate: "2025-09-23",
                criticality: "High",
                operations: [
                  {
                    operationId: "0100",
                    description: "Pré-montagem",
                    sequence: 100,
                    status: "Open",
                    workCenterId: "WC-200",
                    plannedStart: "2025-09-22T08:00:00Z",
                    plannedFinish: "2025-09-22T09:00:00Z",
                    durationMin: 60
                  },
                  {
                    operationId: "0200",
                    description: "Montagem",
                    sequence: 200,
                    status: "Open",
                    workCenterId: "WC-200",
                    plannedStart: "2025-09-22T09:00:00Z",
                    plannedFinish: "2025-09-22T12:00:00Z",
                    durationMin: 180
                  },
                  {
                    operationId: "0300",
                    description: "Teste funcional",
                    sequence: 300,
                    status: "Open",
                    workCenterId: "WC-200",
                    plannedStart: "2025-09-22T13:00:00Z",
                    plannedFinish: "2025-09-22T14:00:00Z",
                    durationMin: 60
                  }
                ]
              },
              {
                orderId: "MO-450011",
                material: "KIT-PA20",
                description: "Painel de Acionamento",
                dueDate: "2025-09-28",
                criticality: "Low",
                operations: [
                  {
                    operationId: "0100",
                    description: "Separação de componentes",
                    sequence: 100,
                    status: "Open",
                    workCenterId: "WC-200",
                    plannedStart: "2025-09-23T08:00:00Z",
                    plannedFinish: "2025-09-23T09:00:00Z",
                    durationMin: 60
                  },
                  {
                    operationId: "0200",
                    description: "Montagem elétrica",
                    sequence: 200,
                    status: "Open",
                    workCenterId: "WC-200",
                    plannedStart: "2025-09-23T09:00:00Z",
                    plannedFinish: "2025-09-23T12:00:00Z",
                    durationMin: 180
                  }
                ]
              }
            ]
          }
        ]
      };

      const oModel = new JSONModel(oData);
      oModel.setDefaultBindingMode("TwoWay");
      return oModel;
    },

    createMetadataModel: function () {
      const oData = {
        // Informações básicas da aplicação
        // Utilizadas em títulos, rodapés e diálogos "Sobre"
        appInfo: {
          title: "Employee Management System", // Título da aplicação
          version: "1.0.0", // Versão atual
          description: "Template SapUI5 para gestão de funcionários", // Descrição
          author: "Equipe de Desenvolvimento", // Autor/Equipe
          lastUpdate: new Date().toISOString(), // Data da última atualização
          buildNumber: "20241201.1" // Número do build
        },

        // Configurações globais da aplicação
        // Controlam comportamentos e limites da interface
        settings: {
          itemsPerPage: 20, // Itens por página em listas
          defaultTheme: "sap_horizon", // Tema padrão
          enableNotifications: true, // Habilita notificações
          autoSave: false, // Salvamento automático
          debugMode: false, // Modo de debug
          maxFileSize: 5242880, // Tamanho máximo de arquivo (5MB)
          supportedLanguages: ["pt", "en"], // Idiomas suportados
          defaultLanguage: "pt" // Idioma padrão
        },

        // Estatísticas da aplicação
        // Valores iniciais que são atualizados dinamicamente
        statistics: {
          totalEmployees: 6, // Total de funcionários
          activeEmployees: 4, // Funcionários ativos
          departmentCount: 5, // Número de departamentos
          averageSalary: 0, // Salário médio (calculado)
          newestEmployee: null, // Funcionário mais recente
          oldestEmployee: null // Funcionário mais antigo
        },

        // Configurações de interface
        // Controlam aspectos visuais e de usabilidade
        ui: {
          showWelcomeMessage: true, // Exibe mensagem de boas-vindas
          compactMode: false, // Modo compacto
          showHelpTips: true, // Exibe dicas de ajuda
          animationsEnabled: true, // Habilita animações
          soundEnabled: false // Habilita sons de feedback
        }
      };

      // Cria modelo JSON com configurações
      const oModel = new JSONModel(oData);

      // Define como OneWay pois metadados geralmente não são editáveis pelo usuário
      oModel.setDefaultBindingMode("OneWay");

      return oModel;
    }
  };
});
