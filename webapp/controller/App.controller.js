sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.todoapp.controller.App", {
		onInit: function () {
			console.log("App controller onInit");
		}
	});
});