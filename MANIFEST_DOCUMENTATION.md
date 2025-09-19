# Documentação do Manifest.json

## Visão Geral

O arquivo `manifest.json` é o descritor central da aplicação SapUI5, definindo metadados, dependências, configurações de roteamento e outros aspectos fundamentais da aplicação. Este documento explica cada seção e sua importância.

## Estrutura do Manifest

### 1. Seção `sap.app`

```json
{
  "_version": "1.58.0",
  "sap.app": {
    "id": "sapui5.template",
    "type": "application",
    "i18n": "i18n/i18n.properties",
    "applicationVersion": {
      "version": "0.0.1"
    },
    "title": "{{appTitle}}",
    "description": "{{appDescription}}"
  }
}
```

**Explicação dos campos:**

- `_version`: Versão do formato do manifest (compatibilidade com ferramentas SAP)
- `id`: Identificador único da aplicação (namespace)
- `type`: Tipo de artefato ("application" para aplicações standalone)
- `i18n`: Caminho para o arquivo de recursos de internacionalização padrão
- `applicationVersion`: Versão da aplicação (usado para controle de versão)
- `title`: Título da aplicação (referência i18n para suporte multilíngue)
- `description`: Descrição da aplicação (referência i18n)

### 2. Seção `sap.ui`

```json
{
  "sap.ui": {
    "technology": "UI5",
    "icons": {
      "icon": "",
      "favIcon": "",
      "phone": "",
      "phone@2": "",
      "tablet": "",
      "tablet@2": ""
    },
    "deviceTypes": {
      "desktop": true,
      "tablet": true,
      "phone": true
    }
  }
}
```

**Explicação dos campos:**

- `technology`: Framework utilizado (UI5 para SapUI5/OpenUI5)
- `icons`: Ícones da aplicação para diferentes contextos e resoluções
  - `icon`: Ícone padrão da aplicação
  - `favIcon`: Favicon para navegadores
  - `phone`/`phone@2`: Ícones para dispositivos móveis (normal e alta resolução)
  - `tablet`/`tablet@2`: Ícones para tablets
- `deviceTypes`: Tipos de dispositivos suportados pela aplicação

### 3. Seção `sap.ui5`

```json
{
  "sap.ui5": {
    "flexEnabled": true,
    "dependencies": {
      "minUI5Version": "1.120.0",
      "libs": {
        "sap.m": {},
        "sap.ui.core": {},
        "sap.f": {},
        "sap.suite.ui.commons": {}
      }
    },
    "models": {
      "i18n": {
        "type": "sap.ui.model.resource.ResourceModel",
        "settings": {
          "bundleName": "sapui5.template.i18n.i18n"
        }
      }
    }
  }
}
```

**Explicação dos campos:**

- `flexEnabled`: Habilita SAP Fiori Elements e funcionalidades de flexibilidade
- `dependencies`: Define dependências da aplicação
  - `minUI5Version`: Versão mínima do UI5 necessária
  - `libs`: Bibliotecas UI5 utilizadas pela aplicação
- `models`: Configuração de modelos de dados globais
  - `i18n`: Modelo de recursos para internacionalização

### 4. Seção de Roteamento

```json
{
  "sap.ui5": {
    "routing": {
      "config": {
        "routerClass": "sap.m.routing.Router",
        "viewType": "XML",
        "async": true,
        "viewPath": "sapui5.template.view",
        "controlAggregation": "pages",
        "controlId": "app",
        "clearControlAggregation": false
      },
      "routes": [
        {
          "name": "RouteMain",
          "pattern": ":?query:",
          "target": ["TargetMain"]
        }
      ],
      "targets": {
        "TargetMain": {
          "viewType": "XML",
          "transition": "slide",
          "clearControlAggregation": false,
          "viewId": "Main",
          "viewName": "Main"
        }
      }
    }
  }
}
```

**Explicação da configuração de roteamento:**

#### Config (Configuração Global)
- `routerClass`: Classe do router a ser utilizada
- `viewType`: Tipo de views (XML, JS, JSON, HTML)
- `async`: Carregamento assíncrono de views (recomendado: true)
- `viewPath`: Namespace base para localização das views
- `controlAggregation`: Agregação onde as views serão inseridas
- `controlId`: ID do controle container principal
- `clearControlAggregation`: Se deve limpar agregação ao navegar

#### Routes (Rotas)
Cada rota define:
- `name`: Nome único da rota
- `pattern`: Padrão de URL que ativa a rota
- `target`: Target(s) a serem ativados

#### Targets (Alvos)
Cada target define:
- `viewType`: Tipo da view específica
- `transition`: Tipo de transição entre views
- `viewId`: ID único da view
- `viewName`: Nome da view (arquivo)

### 5. Recursos e CSS

```json
{
  "sap.ui5": {
    "resources": {
      "css": [
        {
          "uri": "css/style.css"
        }
      ]
    }
  }
}
```

**Explicação:**
- `resources`: Define recursos adicionais da aplicação
- `css`: Array de arquivos CSS customizados a serem carregados

## Padrões de Configuração

### Roteamento Hierárquico
```json
{
  "routes": [
    {
      "name": "RouteEmployeeList",
      "pattern": "employees",
      "target": ["TargetEmployeeList"]
    },
    {
      "name": "RouteEmployeeDetail",
      "pattern": "employees/{employeeId}",
      "target": ["TargetEmployeeDetail"]
    }
  ]
}
```

### Modelos Múltiplos
```json
{
  "models": {
    "": {
      "dataSource": "mainService",
      "type": "sap.ui.model.odata.v2.ODataModel"
    },
    "i18n": {
      "type": "sap.ui.model.resource.ResourceModel",
      "settings": {
        "bundleName": "sapui5.template.i18n.i18n"
      }
    }
  }
}
```

## Boas Práticas

### 1. Versionamento
- Sempre definir `minUI5Version` para garantir compatibilidade
- Manter `applicationVersion` atualizada
- Usar versionamento semântico (major.minor.patch)

### 2. Internacionalização
- Usar referências i18n para todos os textos (`{{chave}}`)
- Definir modelo i18n no manifest
- Organizar chaves de forma hierárquica

### 3. Roteamento
- Usar nomes descritivos para rotas e targets
- Implementar navegação hierárquica consistente
- Configurar transições apropriadas

### 4. Dependências
- Incluir apenas bibliotecas realmente utilizadas
- Especificar versão mínima necessária
- Considerar impacto no tamanho do bundle

### 5. Recursos
- Organizar CSS em arquivos separados
- Usar caminhos relativos para recursos
- Otimizar imagens e ícones

## Validação e Debugging

### Ferramentas de Validação
- UI5 Inspector: Verifica configurações em runtime
- SAP Web IDE: Validação automática do manifest
- UI5 CLI: Validação durante build

### Problemas Comuns
1. **Rotas não funcionam**: Verificar padrões e targets
2. **Views não carregam**: Verificar viewPath e viewName
3. **Modelos não disponíveis**: Verificar configuração de models
4. **CSS não aplica**: Verificar caminho em resources

### Debug de Roteamento
```javascript
// No console do navegador
sap.ui.core.UIComponent.getRouterFor(this).getHashChanger().getHash()
```

## Exemplo Completo Comentado

```json
{
  // Versão do formato do manifest
  "_version": "1.58.0",
  
  // Metadados básicos da aplicação
  "sap.app": {
    "id": "sapui5.template",              // Namespace único
    "type": "application",                // Tipo de artefato
    "i18n": "i18n/i18n.properties",     // Recursos i18n padrão
    "applicationVersion": {
      "version": "0.0.1"                 // Versão da aplicação
    },
    "title": "{{appTitle}}",             // Título internacionalizado
    "description": "{{appDescription}}"  // Descrição internacionalizada
  },
  
  // Configurações específicas do UI5
  "sap.ui": {
    "technology": "UI5",                 // Framework utilizado
    "deviceTypes": {                     // Dispositivos suportados
      "desktop": true,
      "tablet": true,
      "phone": true
    }
  },
  
  // Configurações avançadas do UI5
  "sap.ui5": {
    "flexEnabled": true,                 // Habilita flexibilidade
    "dependencies": {                    // Dependências da aplicação
      "minUI5Version": "1.120.0",       // Versão mínima do UI5
      "libs": {                          // Bibliotecas necessárias
        "sap.m": {},                     // Mobile controls
        "sap.ui.core": {},               // Core do framework
        "sap.f": {}                      // Fiori controls
      }
    },
    "models": {                          // Modelos de dados
      "i18n": {                          // Modelo de internacionalização
        "type": "sap.ui.model.resource.ResourceModel",
        "settings": {
          "bundleName": "sapui5.template.i18n.i18n"
        }
      }
    },
    "resources": {                       // Recursos adicionais
      "css": [                           // Arquivos CSS customizados
        {
          "uri": "css/style.css"
        }
      ]
    },
    "routing": {                         // Configuração de roteamento
      "config": {                        // Configuração global
        "routerClass": "sap.m.routing.Router",
        "viewType": "XML",
        "async": true,
        "viewPath": "sapui5.template.view",
        "controlAggregation": "pages",
        "controlId": "app"
      },
      "routes": [                        // Definição de rotas
        {
          "name": "RouteMain",
          "pattern": ":?query:",
          "target": ["TargetMain"]
        }
      ],
      "targets": {                       // Definição de targets
        "TargetMain": {
          "viewType": "XML",
          "viewId": "Main",
          "viewName": "Main"
        }
      }
    }
  }
}
```

Este manifest.json serve como configuração central da aplicação, definindo todos os aspectos necessários para o funcionamento correto da aplicação SapUI5.