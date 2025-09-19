sap.ui.define(
  [
    "sap/ui/core/Control",
    "sap/m/Card",
    "sap/m/CardHeader",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Text",
    "sap/m/Label",
    "sap/m/Button",
    "sap/m/ObjectStatus",
    "sap/ui/core/Icon",
    "sap/ui/core/library"
  ],
  (Control, Card, CardHeader, VBox, HBox, Text, Label, Button, ObjectStatus, Icon, coreLibrary) => {
    const ValueState = coreLibrary.ValueState;

    /**
     * Custom control para exibir informações de funcionário em formato de card
     * @class EmployeeCard
     * @extends sap.ui.core.Control
     */
    return Control.extend("sapui5.template.control.EmployeeCard", {
      metadata: {
        properties: {
          /**
           * Dados do funcionário a ser exibido
           */
          employee: {
            type: "object",
            defaultValue: null
          },
          /**
           * Define se o card está em modo editável (mostra botões de ação)
           */
          editable: {
            type: "boolean",
            defaultValue: false
          },
          /**
           * Define se o card deve ser exibido em modo compacto
           */
          compact: {
            type: "boolean",
            defaultValue: false
          }
        },
        events: {
          /**
           * Evento disparado quando o card é clicado
           */
          press: {
            parameters: {
              employee: { type: "object" }
            }
          },
          /**
           * Evento disparado quando o botão de editar é clicado
           */
          edit: {
            parameters: {
              employee: { type: "object" }
            }
          },
          /**
           * Evento disparado quando o botão de deletar é clicado
           */
          delete: {
            parameters: {
              employee: { type: "object" }
            }
          }
        }
      },

      /**
       * Inicialização do controle
       */
      init: function () {
        this._oCard = null;
      },

      /**
       * Renderização do controle
       */
      renderer: function (oRm, oControl) {
        const oCard = oControl._getCard();

        oRm.openStart("div", oControl);
        oRm.class("employeeCard");
        if (oControl.getCompact()) {
          oRm.class("employeeCard--compact");
        }
        oRm.openEnd();

        oRm.renderControl(oCard);

        oRm.close("div");
      },

      /**
       * Cria ou atualiza o card interno
       * @private
       */
      _getCard: function () {
        if (!this._oCard) {
          this._oCard = this._createCard();
        } else {
          this._updateCard();
        }
        return this._oCard;
      },

      /**
       * Cria o card com todos os elementos
       * @private
       */
      _createCard: function () {
        const oEmployee = this.getEmployee();
        const bEditable = this.getEditable();
        const bCompact = this.getCompact();

        // Header do card
        const oHeader = new CardHeader({
          title: this._getEmployeeName(oEmployee),
          subtitle: oEmployee ? oEmployee.position : "",
          iconSrc: "sap-icon://person-placeholder"
        });

        // Conteúdo principal
        const oContent = this._createContent(oEmployee, bCompact);

        // Botões de ação (se editável)
        const oActions = bEditable ? this._createActionButtons() : null;

        // Card principal
        const oCard = new Card({
          header: oHeader,
          content: oContent,
          press: this._onCardPress.bind(this)
        });

        // Adiciona botões de ação se editável
        if (oActions) {
          oCard.addContent(oActions);
        }

        return oCard;
      },

      /**
       * Cria o conteúdo do card
       * @private
       */
      _createContent: function (oEmployee, bCompact) {
        if (!oEmployee) {
          return new Text({ text: "No employee data" });
        }

        const oMainBox = new VBox({
          class: "sapUiMediumMargin"
        });

        // Informações básicas
        if (!bCompact) {
          oMainBox.addItem(this._createInfoRow("Email:", oEmployee.email));
          oMainBox.addItem(this._createInfoRow("Department:", oEmployee.department));
        }

        // Status do funcionário
        const oStatus = new ObjectStatus({
          text: oEmployee.status || "Active",
          state: this._getStatusState(oEmployee.status)
        });

        const oStatusBox = new HBox({
          items: [new Label({ text: "Status:" }).addStyleClass("sapUiTinyMarginEnd"), oStatus]
        }).addStyleClass("sapUiTinyMarginTop");

        oMainBox.addItem(oStatusBox);

        // Data de contratação (se não compacto)
        if (!bCompact && oEmployee.hireDate) {
          oMainBox.addItem(this._createInfoRow("Hire Date:", this._formatDate(oEmployee.hireDate)));
        }

        return oMainBox;
      },

      /**
       * Cria uma linha de informação
       * @private
       */
      _createInfoRow: function (sLabel, sValue) {
        return new HBox({
          items: [
            new Label({
              text: sLabel,
              width: "100px"
            }).addStyleClass("sapUiTinyMarginEnd"),
            new Text({ text: sValue || "-" })
          ]
        }).addStyleClass("sapUiTinyMarginTop");
      },

      /**
       * Cria os botões de ação
       * @private
       */
      _createActionButtons: function () {
        const oButtonBox = new HBox({
          justifyContent: "End",
          items: [
            new Button({
              text: "Edit",
              icon: "sap-icon://edit",
              type: "Emphasized",
              press: this._onEditPress.bind(this)
            }).addStyleClass("sapUiTinyMarginEnd"),
            new Button({
              text: "Delete",
              icon: "sap-icon://delete",
              type: "Reject",
              press: this._onDeletePress.bind(this)
            })
          ]
        }).addStyleClass("sapUiMediumMargin");

        return oButtonBox;
      },

      /**
       * Atualiza o card existente
       * @private
       */
      _updateCard: function () {
        // Destroi o card atual e cria um novo
        if (this._oCard) {
          this._oCard.destroy();
          this._oCard = this._createCard();
        }
      },

      /**
       * Obtém o nome completo do funcionário
       * @private
       */
      _getEmployeeName: function (oEmployee) {
        if (!oEmployee) {
          return "Unknown Employee";
        }
        return (oEmployee.firstName || "") + " " + (oEmployee.lastName || "");
      },

      /**
       * Obtém o estado visual do status
       * @private
       */
      _getStatusState: function (sStatus) {
        switch (sStatus) {
          case "Active":
          case "Ativo":
            return ValueState.Success;
          case "Inactive":
          case "Inativo":
            return ValueState.Error;
          case "On Leave":
          case "Em Licença":
            return ValueState.Warning;
          default:
            return ValueState.None;
        }
      },

      /**
       * Formata data para exibição
       * @private
       */
      _formatDate: function (sDate) {
        if (!sDate) {
          return "";
        }
        const oDate = new Date(sDate);
        return oDate.toLocaleDateString();
      },

      /**
       * Handler para clique no card
       * @private
       */
      _onCardPress: function () {
        this.firePress({
          employee: this.getEmployee()
        });
      },

      /**
       * Handler para botão de editar
       * @private
       */
      _onEditPress: function () {
        this.fireEdit({
          employee: this.getEmployee()
        });
      },

      /**
       * Handler para botão de deletar
       * @private
       */
      _onDeletePress: function () {
        this.fireDelete({
          employee: this.getEmployee()
        });
      },

      /**
       * Setter customizado para propriedade employee
       */
      setEmployee: function (oEmployee) {
        this.setProperty("employee", oEmployee, true);
        if (this._oCard) {
          this._updateCard();
        }
        return this;
      },

      /**
       * Setter customizado para propriedade editable
       */
      setEditable: function (bEditable) {
        this.setProperty("editable", bEditable, true);
        if (this._oCard) {
          this._updateCard();
        }
        return this;
      },

      /**
       * Setter customizado para propriedade compact
       */
      setCompact: function (bCompact) {
        this.setProperty("compact", bCompact, true);
        if (this._oCard) {
          this._updateCard();
        }
        return this;
      },

      /**
       * Cleanup quando o controle é destruído
       */
      exit: function () {
        if (this._oCard) {
          this._oCard.destroy();
          this._oCard = null;
        }
      }
    });
  }
);
