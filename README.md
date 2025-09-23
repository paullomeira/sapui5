# To-Do List Ágil

Aplicação web de gerenciamento de tarefas desenvolvida com SAP UI5, seguindo as diretrizes Fiori para projetos ágeis.

## Funcionalidades

- **Adição de Tarefas**: Formulário com descrição, prioridade e data de entrega.
- **Visualização**: Tabela com tarefas, prioridades coloridas e ações.
- **KPIs**: Indicadores de tarefas atrasadas, hoje e amanhã.
- **Persistência**: Dados salvos no localStorage.
- **Responsivo**: Adaptável a desktop e mobile.

## Tecnologias

- SAP UI5 1.120+
- Tema Fiori 3
- localStorage para persistência

## Setup e Execução

1. Clone ou baixe o repositório.
2. Abra um terminal na pasta raiz do projeto.
3. Execute um servidor HTTP local:
   ```
   python -m http.server 8000
   ```
4. Abra o navegador em `http://localhost:8000`.

## Estrutura do Projeto

- `webapp/`: Código fonte
  - `Component.js`: Inicialização da app
  - `manifest.json`: Configurações
  - `view/`: Views XML
  - `controller/`: Controllers JS
  - `model/`: Modelos
  - `i18n/`: Internacionalização
  - `css/`: Estilos

## Testado em

- Chrome
- Edge

## Relatório

Ver arquivo `relatorio.md` para detalhes sobre design e diretrizes Fiori aplicadas.