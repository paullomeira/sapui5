# SapUI5 Builder Template

Uma aplicação SapUI5 de exemplo completa que demonstra as melhores práticas do framework, incluindo componentes reutilizáveis, padrões MVC, testes automatizados e ferramentas de desenvolvimento modernas.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16.0.0 ou superior)
- **npm** (versão 8.0.0 ou superior)
- **Git** (para controle de versão)

### Verificar versões instaladas:
```bash
node --version
npm --version
git --version
```

## 🚀 Instalação e Configuração

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd sapui5-builder-template
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Iniciar servidor de desenvolvimento
```bash
npm start
```

A aplicação será aberta automaticamente no navegador em `http://localhost:8080`.

## 📁 Estrutura do Projeto

```
sapui5-builder-template/
├── webapp/                          # Código fonte da aplicação
│   ├── controller/                  # Controllers MVC
│   │   ├── BaseController.js        # Controller base com funcionalidades comuns
│   │   ├── App.controller.js        # Controller principal da aplicação
│   │   ├── Main.controller.js       # Controller da página inicial
│   │   ├── EmployeeList.controller.js    # Controller da lista de funcionários
│   │   ├── EmployeeDetail.controller.js  # Controller de detalhes
│   │   └── EmployeeForm.controller.js     # Controller do formulário
│   ├── view/                        # Views XML
│   │   ├── App.view.xml             # View principal (shell)
│   │   ├── Main.view.xml            # Página inicial
│   │   ├── EmployeeList.view.xml    # Lista de funcionários
│   │   ├── EmployeeDetail.view.xml  # Detalhes do funcionário
│   │   └── EmployeeForm.view.xml    # Formulário de criação/edição
│   ├── model/                       # Modelos e utilitários
│   │   ├── models.js                # Configuração de modelos de dados
│   │   ├── formatter.js             # Funções de formatação
│   │   └── DialogHelper.js          # Utilitários para dialogs
│   ├── control/                     # Controles customizados
│   │   └── EmployeeCard.js          # Card reutilizável para funcionários
│   ├── fragment/                    # Fragments reutilizáveis
│   │   ├── EmployeeDialog.fragment.xml   # Dialog de funcionário
│   │   └── ConfirmDialog.fragment.xml    # Dialog de confirmação
│   ├── css/                         # Estilos customizados
│   │   └── style.css                # Estilos da aplicação
│   ├── i18n/                        # Internacionalização
│   │   ├── i18n.properties          # Textos em inglês (padrão)
│   │   └── i18n_pt.properties       # Textos em português
│   ├── test/                        # Testes automatizados
│   │   ├── unit/                    # Testes unitários (QUnit)
│   │   └── integration/             # Testes de integração (OPA5)
│   ├── Component.js                 # Componente principal
│   └── manifest.json                # Configurações da aplicação
├── package.json                     # Dependências e scripts npm
├── ui5.yaml                         # Configurações do UI5 Tooling
├── .eslintrc.js                     # Configurações do ESLint
├── .prettierrc                      # Configurações do Prettier
└── README.md                        # Este arquivo
```

## 🎯 Funcionalidades Demonstradas

### Padrões de Interface
- **Master-Detail**: Lista de funcionários com navegação para detalhes
- **Formulários**: Criação e edição com validação
- **Navegação**: Router com múltiplas rotas
- **Responsividade**: Layout adaptável para diferentes dispositivos

### Componentes Reutilizáveis
- **EmployeeCard**: Controle customizado para exibir informações
- **Fragments**: Dialogs reutilizáveis para confirmação e ações
- **BaseController**: Funcionalidades comuns compartilhadas

### Recursos Técnicos
- **Internacionalização**: Suporte a múltiplos idiomas (PT/EN)
- **Formatação**: Funções para datas, moeda e status
- **Validação**: Validação de formulários com feedback visual
- **Testes**: Testes unitários e de integração automatizados

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia servidor de desenvolvimento
npm run build          # Build para produção
npm run build:dev      # Build para desenvolvimento

# Qualidade de Código
npm run lint           # Executa ESLint
npm run lint:fix       # Corrige problemas do ESLint automaticamente
npm run format         # Formata código com Prettier
npm run format:check   # Verifica formatação

# Testes
npm test               # Informações sobre testes
npm run test:unit      # Executa testes unitários
npm run test:integration # Executa testes de integração
```

## 🔧 Como Estender a Aplicação

### Adicionando uma Nova View

1. **Criar a View XML**:
```bash
# Criar arquivo webapp/view/MinhaNovaView.view.xml
```

2. **Criar o Controller**:
```bash
# Criar arquivo webapp/controller/MinhaNovaView.controller.js
```

3. **Adicionar rota no manifest.json**:
```json
{
  "routes": [
    {
      "name": "RouteMinhaNovaView",
      "pattern": "minha-rota",
      "target": ["TargetMinhaNovaView"]
    }
  ],
  "targets": {
    "TargetMinhaNovaView": {
      "viewType": "XML",
      "viewId": "MinhaNovaView",
      "viewName": "MinhaNovaView"
    }
  }
}
```

### Exemplo de Controller Básico

```javascript
sap.ui.define([
  "sapui5/template/controller/BaseController"
], function (BaseController) {
  "use strict";

  return BaseController.extend("sapui5.template.controller.MinhaNovaView", {
    onInit: function () {
      // Inicialização da view
    },

    onNavBack: function () {
      this.getRouter().navTo("RouteMain");
    }
  });
});
```

### Criando um Novo Controle Customizado

1. **Criar arquivo em webapp/control/**:
```javascript
sap.ui.define([
  "sap/ui/core/Control"
], function (Control) {
  "use strict";

  return Control.extend("sapui5.template.control.MeuControle", {
    metadata: {
      properties: {
        "texto": { type: "string", defaultValue: "" }
      },
      events: {
        "press": {}
      }
    },

    renderer: function (oRM, oControl) {
      oRM.write("<div");
      oRM.writeControlData(oControl);
      oRM.addClass("meuControle");
      oRM.writeClasses();
      oRM.write(">");
      oRM.writeEscaped(oControl.getTexto());
      oRM.write("</div>");
    }
  });
});
```

### Adicionando Novos Textos i18n

1. **Adicionar em webapp/i18n/i18n.properties**:
```properties
# Novos textos
meuTitulo=My Title
minhaDescricao=My Description
```

2. **Adicionar tradução em webapp/i18n/i18n_pt.properties**:
```properties
# Traduções
meuTitulo=Meu Título
minhaDescricao=Minha Descrição
```

3. **Usar na view**:
```xml
<Title text="{i18n>meuTitulo}" />
```

## 🧪 Executando Testes

### Testes Unitários
Os testes unitários usam QUnit e podem ser executados abrindo:
```
webapp/test/unit/unitTests.qunit.html
```

### Testes de Integração
Os testes de integração usam OPA5 e estão localizados em:
```
webapp/test/integration/
```

### Estrutura de Testes
```
test/
├── unit/                    # Testes unitários
│   ├── controller/          # Testes de controllers
│   ├── model/              # Testes de modelos
│   └── unitTests.qunit.html # Página de execução
└── integration/            # Testes de integração
    ├── pages/              # Page Objects
    ├── NavigationJourney.js # Testes de navegação
    ├── EmployeeJourney.js  # Testes de CRUD
    └── ValidationJourney.js # Testes de validação
```

## 🎨 Personalização de Temas

A aplicação suporta os temas padrão do SAP:
- `sap_horizon` (padrão)
- `sap_fiori_3`
- `sap_belize`

Para personalizar estilos, edite `webapp/css/style.css`.

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta a:
- **Desktop**: > 1024px
- **Tablet**: 600px - 1024px  
- **Mobile**: < 600px

## 🔍 Ferramentas de Desenvolvimento

### ESLint
Configurado com regras específicas para UI5:
```bash
npm run lint        # Verificar problemas
npm run lint:fix    # Corrigir automaticamente
```

### Prettier
Formatação automática de código:
```bash
npm run format      # Formatar código
npm run format:check # Verificar formatação
```

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Estrutura do Build
```
dist/
├── resources/          # Recursos do framework
├── controller/         # Controllers minificados
├── view/              # Views otimizadas
├── css/               # CSS minificado
├── i18n/              # Recursos de tradução
├── manifest.json      # Manifest otimizado
└── Component-preload.js # Bundle da aplicação
```

## 📚 Recursos Adicionais

### Documentação Oficial
- [UI5 Documentation](https://ui5.sap.com/)
- [SAP Fiori Design Guidelines](https://experience.sap.com/fiori-design/)
- [UI5 Tooling](https://sap.github.io/ui5-tooling/)

### Comunidade
- [UI5 Community](https://community.sap.com/topics/ui5)
- [OpenUI5 GitHub](https://github.com/SAP/openui5)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## ✨ Próximos Passos

Após configurar o projeto, você pode:

1. **Explorar o código**: Examine os controllers e views para entender os padrões
2. **Executar testes**: Verifique que tudo está funcionando corretamente
3. **Personalizar**: Adapte a aplicação para suas necessidades
4. **Estender**: Adicione novas funcionalidades seguindo os padrões estabelecidos

---

**Desenvolvido com ❤️ usando SAP UI5**# sapui5
