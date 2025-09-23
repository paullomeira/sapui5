sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (UIComponent, JSONModel, Device) {
	"use strict";

	return UIComponent.extend("com.todoapp.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			console.log("Component init started");
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			console.log("Component init after base");

			// set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");

			console.log("Device model set");

			// create the tasks model
			var oTasksModel = new JSONModel();
			oTasksModel.setData({
				tasks: [],
				filteredTasks: [],
				kpis: {
					overdue: 0,
					today: 0,
					tomorrow: 0
				},
				filter: null // null = mostrar todas, "overdue", "today", "tomorrow"
			});
			this.setModel(oTasksModel);

			console.log("Tasks model set");

			// enable routing
			this.getRouter().initialize();

			console.log("Router initialized");

			// Initialize filtered tasks
			this._updateFilteredTasks();
		},

		_loadTasksFromStorage: function () {
			var sData = localStorage.getItem("todoAppData");
			if (sData) {
				var oData = JSON.parse(sData);
				
				// Carregar tarefas
				if (oData.tasks) {
					var aTasks = oData.tasks.filter(function(oTask) {
						return oTask.dueDate && !isNaN(new Date(oTask.dueDate));
					}).map(function(oTask) {
						return {
							id: oTask.id,
							description: oTask.description,
							priority: oTask.priority,
							dueDate: new Date(oTask.dueDate),
							completed: oTask.completed
						};
					});
					this.getModel().setProperty("/tasks", aTasks);
				}
				
				// Carregar filtro
				if (oData.filter !== undefined) {
					this.getModel().setProperty("/filter", oData.filter);
				}
			}
			this._updateFilteredTasks();
			this._updateKPIs();
		},

		_updateKPIs: function () {
			var aTasks = this.getModel().getProperty("/tasks");
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

			this.getModel().setProperty("/kpis", oKPIs);
			this._updateFilteredTasks();
		},

		_updateFilteredTasks: function () {
			var aTasks = this.getModel().getProperty("/tasks");
			var sFilter = this.getModel().getProperty("/filter");
			
			var aFilteredTasks;
			if (!sFilter || sFilter === "all") {
				// Mostrar todas as tarefas por padrão
				aFilteredTasks = aTasks;
			} else {
				// Filtrar tarefas baseado no tipo
				var oToday = new Date();
				oToday.setHours(0, 0, 0, 0);
				var oTomorrow = new Date(oToday);
				oTomorrow.setDate(oTomorrow.getDate() + 1);

				aFilteredTasks = aTasks.filter(function (oTask) {
					var oDueDate = new Date(oTask.dueDate);
					oDueDate.setHours(0, 0, 0, 0);
					
					switch (sFilter) {
						case "overdue":
							return oDueDate < oToday && !oTask.completed;
						case "today":
							return oDueDate.getTime() === oToday.getTime() && !oTask.completed;
						case "tomorrow":
							return oDueDate.getTime() === oTomorrow.getTime() && !oTask.completed;
						default:
							return true;
					}
				});
			}
			
			this.getModel().setProperty("/filteredTasks", aFilteredTasks);
		},

		saveTasksToStorage: function () {
			var oData = {
				tasks: this.getModel().getProperty("/tasks"),
				filter: this.getModel().getProperty("/filter")
			};
			localStorage.setItem("todoAppData", JSON.stringify(oData));
		}
	});
});