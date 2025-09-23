# Relatório: Desenvolvimento da To-Do List com SAP UI5

## Contexto do Projeto
Este projeto implementa uma aplicação de gerenciamento de tarefas (To-Do List) focada em projetos ágeis, utilizando exclusivamente SAP UI5. A aplicação é standalone, sem backend, utilizando localStorage para persistência.

## Escolhas de Design

### Tema e Estilo
- **Tema Fiori 3**: Utilizado para um visual corporativo moderno, consistente com as diretrizes SAP.
- **Layout Responsivo**: Uso de sap.ui.layout para grids flexíveis, adaptáveis a diferentes tamanhos de tela.
- **Simplicidade**: Interface limpa, evitando elementos visuais excessivos, priorizando ações primárias.

### Componentes Utilizados
- **sap.m.Page**: Estrutura principal da página.
- **sap.m.Panel**: Para seções de KPIs e formulário.
- **sap.m.GenericTile**: Para KPIs com ícones e estados (Error para atrasadas).
- **sap.ui.layout.form.SimpleForm**: Formulário de adição com campos obrigatórios.
- **sap.m.Table**: Lista de tarefas com colunas customizadas.
- **sap.m.ObjectStatus**: Para prioridades com cores Fiori (verde=baixa, vermelho=crítica).
- **sap.m.Button**: Ações com ícones padrão (accept, delete).
- **sap.m.MessageBox**: Diálogo de confirmação para exclusão.

### Funcionalidades Implementadas
- **Inserção de Tarefas**: Validação de campos, atalho Enter, feedback com MessageToast.
- **Gerenciamento**: Concluir (strike-through), excluir com confirmação.
- **KPIs**: Atualização em tempo real, destaques visuais.
- **Persistência**: JSONModel + localStorage, carregamento automático.

## Aplicação das Diretrizes Fiori

### Design
- **Consistência**: Uso de ícones e botões padrão SAP.
- **Responsividade**: Componentes adaptáveis, testados em desktop/mobile.
- **Feedback Imediato**: Toasts para sucesso/erro, estados visuais.

### UX
- **Ações Primárias**: Botão "Adicionar" destacado, formulário acessível.
- **Acessibilidade**: Labels ARIA implícitas, suporte a leitores de tela.
- **Foco em Usabilidade**: Validações preventivas, navegação intuitiva.

### Qualidade de Código
- **MVC**: Separação clara entre View (XML), Controller (JS), Model (JSON).
- **Tratamento de Erros**: Validações no front-end, mensagens claras.
- **Comentários**: Código limpo e comentado.

## Desafios e Soluções
- **Persistência**: Implementada via localStorage no Component, com métodos para salvar/carregar.
- **Atualização KPIs**: Método centralizado no Component, chamado após mudanças.
- **Validações**: No controller, com feedback imediato.

## Conclusão
A aplicação atende todos os requisitos, sendo intuitiva, responsiva e alinhada com Fiori. Tempo estimado: 5 horas. Testada em Chrome/Edge, sem erros.