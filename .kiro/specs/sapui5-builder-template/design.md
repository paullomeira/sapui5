# Documento de Design

## Visão Geral

Esta aplicação SapUI5 de exemplo será estruturada seguindo o padrão MVC (Model-View-Controller) e as melhores práticas recomendadas pela SAP. A aplicação demonstrará diferentes padrões de interface comuns em aplicações empresariais, incluindo navegação, formulários, listas e componentes reutilizáveis.

A aplicação será uma "Employee Management System" que permitirá visualizar, criar e editar informações de funcionários, demonstrando assim os principais padrões de CRUD em SapUI5.

## Arquitetura

### Estrutura de Pastas
```
sapui5-template/
├── webapp/
│   ├── controller/
│   │   ├── BaseController.js
│   │   ├── App.controller.js
│   │   ├── Main.controller.js
│   │   ├── EmployeeList.controller.js
│   │   ├── EmployeeDetail.controller.js
│   │   └── EmployeeForm.controller.js
│   ├── view/
│   │   ├── App.view.xml
│   │   ├── Main.view.xml
│   │   ├── EmployeeList.view.xml
│   │   ├── EmployeeDetail.view.xml
│   │   └── EmployeeForm.view.xml
│   ├── model/
│   │   ├── models.js
│   │   └── formatter.js
│   ├── fragment/
│   │   ├── EmployeeDialog.fragment.xml
│   │   └── ConfirmDialog.fragment.xml
│   ├── control/
│   │   └── EmployeeCard.js
│   ├── css/
│   │   └── style.css
│   ├── i18n/
│   │   ├── i18n.properties
│   │   └── i18n_pt.properties
│   ├── test/
│   │   ├── unit/
│   │   └── integration/
│   ├── Component.js
│   ├── manifest.json
│   └── index.html
├── package.json
├── ui5.yaml
├── .eslintrc.js
├── .prettierrc
└── README.md
```

### Padrão de Navegação
A aplicação utilizará o Router do UI5 para navegação entre views:
- **Main View**: Página inicial com navegação para diferentes seções
- **Employee List**: Lista master com todos os funcionários
- **Employee Detail**: View de detalhes de um funcionário específico
- **Employee Form**: Formulário para criar/editar funcionários

## Componentes e Interfaces

### 1. Component Principal (Component.js)
- Configuração do router
- Inicialização de modelos
- Configuração de i18n
- Setup de temas

### 2. Controllers

#### BaseController
```javascript
// Funcionalidades comuns a todos os controllers
- getRouter()
- getModel()
- getResourceBundle()
- navTo()
- onNavBack()
```

#### App Controller
- Controle da aplicação principal
- Gerenciamento de busy indicators globais
- Tratamento de erros globais

#### Main Controller
- Navegação para diferentes seções
- Dashboard com estatísticas básicas

#### EmployeeList Controller
- Listagem de funcionários
- Filtros e busca
- Navegação para detalhes
- Ações em lote

#### EmployeeDetail Controller
- Exibição de detalhes do funcionário
- Navegação para edição
- Ações específicas (delete, etc.)

#### EmployeeForm Controller
- Criação/edição de funcionários
- Validação de formulários
- Salvamento de dados

### 3. Views

#### Padrões de Layout
- **App View**: Shell container com header e content
- **Main View**: IconTabBar ou TileContainer para navegação
- **List View**: Table ou List com filtros
- **Detail View**: ObjectHeader com ObjectStatus
- **Form View**: SimpleForm com validação

### 4. Modelos de Dados

#### JSON Model Structure
```javascript
{
  employees: [
    {
      id: "001",
      firstName: "João",
      lastName: "Silva",
      email: "joao.silva@empresa.com",
      department: "TI",
      position: "Desenvolvedor",
      hireDate: "2020-01-15",
      salary: 5000,
      status: "Ativo"
    }
  ],
  departments: [
    { key: "TI", text: "Tecnologia da Informação" },
    { key: "RH", text: "Recursos Humanos" },
    { key: "FIN", text: "Financeiro" }
  ]
}
```

### 5. Componentes Reutilizáveis

#### EmployeeCard Control
- Custom control para exibir informações do funcionário
- Propriedades: employee, editable, compact
- Eventos: press, edit, delete

#### Fragments
- **EmployeeDialog**: Dialog para ações rápidas
- **ConfirmDialog**: Dialog de confirmação reutilizável

## Modelos de Dados

### Estrutura de Dados
A aplicação utilizará JSON Models para simular dados de backend:

1. **Employee Model**: Dados dos funcionários
2. **Metadata Model**: Configurações e metadados
3. **i18n Model**: Textos internacionalizados

### Formatters
Funções de formatação para:
- Datas (formatDate)
- Moeda (formatCurrency)
- Status (formatStatus)
- Nomes (formatFullName)

## Tratamento de Erros

### Estratégia de Error Handling
1. **Global Error Handler**: Captura erros não tratados
2. **Validation Errors**: Validação de formulários
3. **Network Errors**: Tratamento de falhas de comunicação
4. **User Feedback**: Messages e MessageToast para feedback

### Implementação
```javascript
// Error Handler centralizado
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
], function(Controller, MessageBox) {
  return {
    handleError: function(error) {
      MessageBox.error(error.message);
    }
  };
});
```

## Estratégia de Testes

### Testes Unitários
- **QUnit**: Framework de testes
- **Sinon**: Mocking e stubbing
- **Coverage**: Cobertura de código

#### Estrutura de Testes
```
test/unit/
├── controller/
│   ├── BaseController.js
│   ├── EmployeeList.controller.js
│   └── EmployeeDetail.controller.js
├── model/
│   └── formatter.js
└── AllTests.js
```

### Testes de Integração
- **OPA5**: One Page Acceptance Tests
- **Journey**: Fluxos de usuário end-to-end

#### Cenários de Teste
1. Navegação entre views
2. CRUD de funcionários
3. Validação de formulários
4. Responsividade

### Testes de Performance
- **UI5 Inspector**: Análise de performance
- **Lighthouse**: Métricas web
- **Bundle Analysis**: Otimização de bundles

## Configurações de Build

### UI5 Tooling (ui5.yaml)
```yaml
specVersion: '2.6'
metadata:
  name: sapui5-template
type: application
framework:
  name: OpenUI5
  version: "1.120.0"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.f
    - name: themelib_sap_horizon
```

### Package.json Scripts
```json
{
  "scripts": {
    "start": "ui5 serve --open",
    "build": "ui5 build --dest dist",
    "lint": "eslint webapp/",
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "karma start",
    "test:integration": "wdio run wdio.conf.js"
  }
}
```

## Internacionalização

### Estrutura i18n
- **i18n.properties**: Textos em inglês (padrão)
- **i18n_pt.properties**: Textos em português
- **i18n_es.properties**: Textos em espanhol

### Padrões de Nomenclatura
```
# Títulos de páginas
pageTitle.main=Main Page
pageTitle.employeeList=Employee List

# Labels de formulários
label.firstName=First Name
label.lastName=Last Name

# Mensagens
msg.saveSuccess=Employee saved successfully
msg.deleteConfirm=Are you sure you want to delete this employee?
```

## Responsividade e Temas

### Breakpoints
- **Phone**: < 600px
- **Tablet**: 600px - 1024px
- **Desktop**: > 1024px

### Controles Responsivos
- **sap.f.DynamicPage**: Para páginas adaptáveis
- **sap.m.Table**: Com modo responsivo
- **sap.f.GridList**: Para layouts em grid

### Temas Suportados
- **sap_horizon**: Tema padrão moderno
- **sap_fiori_3**: Tema Fiori 3
- **sap_belize**: Tema clássico
- **Custom Theme**: Possibilidade de tema personalizado

## Segurança

### Validação de Dados
- Input validation no frontend
- XSS protection
- CSRF tokens (quando integrado com backend)

### Boas Práticas
- Sanitização de inputs
- Validação de tipos
- Escape de HTML
- Content Security Policy headers