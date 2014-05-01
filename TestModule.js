/*
 *  Тестовый модуль.
 *  
 *  
 * 
 */

var TestModule = {
	create : function() {
		console.log("Module loaded");	
	},

	mousemove : function () {
		console.log("Mouse move event");
	},
	/* Ненужные события можно не обрабатывать

	nodeInserted : function () {
		console.log("nodeInserted move event");
	},
	*/
	
	destroy : function() {
		console.log("Module destroyed");
	}
};