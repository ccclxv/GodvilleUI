/*
 * Refactoring
 * Отсюда я все разнес по файлам. Добавил Dispatcher.
 */

// Обработчик событий. Рассылает всем модулям уведомления.
// Позже можно организовать приоритеты
// потом можно отдельно на каждое событие делать массив (для оптимизации)
// Если вызывать функцию через [""], то не работает this. Не вижу смысла ради двух функций мучиться 
// с bind'ами
// Касаясь уже jquery'вского bind'a - убрать лучше, если в тек версии jq есть on 
var Dispatcher = {
	_modules: [],
	
	create: function() {
		$('html').mousemove(function(){
			if (this._modules) {
				for (var i = 0; i < this._modules.length; i++) {
					if (this._modules[i]["mousemove"]) {
						this._modules[i].mousemove();
					}
				}
			}	
		}.bind(this));
		
		$(document).bind("DOMNodeInserted",function(){
			if (this._modules) {
				for (var i = 0; i < this._modules.length; i++) {
					if (this._modules[i]["nodeInserted"]) {
						this._modules[i].nodeInserted();
					}
				}
			}	
		}.bind(this));
	},	
	
	registerModule : function(module) {
		this._modules.push(module);
		module.create();
	},
	
	unregisterModule : function(module) {
		if (module["destroy"]) {
			module.destroy();
		}
		var index = this._modules.indexOf(module);
		if (index > -1) {
		    array.splice(index, 1);
		}
	},
};



// wait for stats  
var starter = setInterval(function() {
	// 	#m_info = #stats in duel mode (left block containing hero info)
	if ($('#m_info').length || $('#stats').length) {
				
		// stop waiting
		var start = new Date();
		clearInterval(starter);
		
		ui_data.init();
		ui_storage.clearStorage();
		ui_improver.add_css();  // why here?
		ui_words.init();
		ui_timeout_bar.create();
		ui_informer.init();
		
		// Инициализируем диспетчер.
		Dispatcher.create();
		Dispatcher.registerModule(ui_improver);
		Dispatcher.registerModule(Logger);
		
		var finish = new Date();		
		GM_log('Godville UI+ initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
	}
}, 200);

