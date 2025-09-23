sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, MessageToast, MessageBox, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.todoapp.controller.Main", {
		onInit: function () {
			console.log("Main controller onInit");
			var oModel = this.getOwnerComponent().getModel();
			oModel.setProperty("/newTask", {
				description: "",
				priority: "medium",
				dueDate: ""
			});
			var oToday = new Date();
			oToday.setHours(0, 0, 0, 0);
			oModel.setProperty("/today", oToday);

			// Attach Enter key to add task
			this.byId("taskInput").attachBrowserEvent("keypress", function (oEvent) {
				if (oEvent.key === "Enter") {
					this.onAddTask();
				}
			}.bind(this));

			this._updateKPIs();
		},

		onAddTask: function () {
			var oModel = this.getOwnerComponent().getModel();
			var oNewTask = oModel.getProperty("/newTask");

			// Validation
			if (!oNewTask.description.trim()) {
				MessageToast.show("Descrição é obrigatória");
				return;
			}
			var oDueDate = this.byId("dueDatePicker").getDateValue();
			if (!oDueDate) {
				MessageToast.show("Data de entrega é obrigatória");
				return;
			}

			// Add task
			var aTasks = oModel.getProperty("/tasks") || [];
			aTasks.push({
				id: Date.now(),
				description: oNewTask.description,
				priority: oNewTask.priority,
				dueDate: oDueDate.toISOString(),
				completed: false
			});
			oModel.setProperty("/tasks", aTasks);

			// Clear form
			oModel.setProperty("/newTask", {
				description: "",
				priority: "medium",
				dueDate: ""
			});

			// Update KPIs
			this._updateKPIs();

			// Save to storage
			this.getOwnerComponent().saveTasksToStorage();

			MessageToast.show("Tarefa adicionada com sucesso");
		},

		onCompleteTask: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();
			if (oContext) {
				var sPath = oContext.getPath();
				var oModel = this.getOwnerComponent().getModel();
				var bCompleted = oModel.getProperty(sPath + "/completed");
				oModel.setProperty(sPath + "/completed", !bCompleted);
				this._updateKPIs();
				this.getOwnerComponent().saveTasksToStorage();
			}
		},

		onDeleteTask: function (oEvent) {
			var oContext = oEvent.getSource().getBindingContext();
			if (oContext) {
				var sPath = oContext.getPath();
				MessageBox.confirm("Tem certeza que deseja excluir esta tarefa?", {
					title: "Confirmar Exclusão",
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.OK) {
							var oModel = this.getOwnerComponent().getModel();
							var aTasks = oModel.getProperty("/tasks");
							var iIndex = parseInt(sPath.split("/")[2]);
							aTasks.splice(iIndex, 1);
							oModel.setProperty("/tasks", aTasks);
							this._updateKPIs();
							this.getOwnerComponent().saveTasksToStorage();
							MessageToast.show("Tarefa excluída");
						}
					}.bind(this)
				});
			}
		},

		onKPIPress: function (oEvent) {
			var oModel = this.getOwnerComponent().getModel();
			var sCurrentFilter = oModel.getProperty("/filter");
			var sSourceId = oEvent.getSource().getId();
			var sNewFilter = null;

			// Determinar qual filtro aplicar baseado no tile clicado
			if (sSourceId.indexOf("overdueTile") !== -1) {
				sNewFilter = sCurrentFilter === "overdue" ? null : "overdue";
			} else if (sSourceId.indexOf("todayTile") !== -1) {
				sNewFilter = sCurrentFilter === "today" ? null : "today";
			} else if (sSourceId.indexOf("tomorrowTile") !== -1) {
				sNewFilter = sCurrentFilter === "tomorrow" ? null : "tomorrow";
			}

			// Aplicar o filtro
			oModel.setProperty("/filter", sNewFilter);
			this.getOwnerComponent()._updateFilteredTasks();
			this.getOwnerComponent().saveTasksToStorage();

			// Feedback visual
			var sMessage = sNewFilter ? 
				"Filtro aplicado: " + (sNewFilter === "overdue" ? "Atrasadas" : sNewFilter === "today" ? "Hoje" : "Amanhã") :
				"Filtro removido - mostrando tarefas pendentes";
			MessageToast.show(sMessage);
		},

		onClearFilter: function () {
			var oModel = this.getOwnerComponent().getModel();
			oModel.setProperty("/filter", "all");
			this.getOwnerComponent()._updateFilteredTasks();
			this.getOwnerComponent().saveTasksToStorage();
			MessageToast.show("Mostrando todas as tarefas");
		},

		formatDate: function(oDate) {
			var d = new Date(oDate);
			if (d instanceof Date && !isNaN(d)) {
				return d.toLocaleDateString('pt-BR');
			}
			return '';
		},

		formatPriority: function(sPriority) {
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			return oBundle.getText(sPriority);
		},

		_updateKPIs: function () {
			var oModel = this.getOwnerComponent().getModel();
			var aTasks = oModel.getProperty("/tasks");
			var oKPIs = { overdue: 0, today: 0, tomorrow: 0 };
			var oToday = new Date();
			oToday.setHours(0, 0, 0, 0);
			var oTomorrow = new Date(oToday);
			oTomorrow.setDate(oTomorrow.getDate() + 1);

			aTasks.forEach(function (oTask) {
				if (oTask.completed) return; // Filtrar apenas tarefas não concluídas
				
				var oDueDate = new Date(oTask.dueDate);
				oDueDate.setHours(0, 0, 0, 0);
				if (oDueDate < oToday) {
					oKPIs.overdue++;
				} else if (oDueDate.getTime() === oToday.getTime()) {
					oKPIs.today++;
				} else if (oDueDate.getTime() === oTomorrow.getTime()) {
					oKPIs.tomorrow++;
				}
			});

			oModel.setProperty("/kpis", oKPIs);
		}
	});
});