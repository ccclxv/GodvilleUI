/*
 * Refactoring
 * Отсюда я все разнес по файлам. Добавил Dispatcher.
 */

// Обработчик событий. Рассылает всем модулям уведомления.
// Позже можно организовать приоритеты
// потом можно отдельно на каждое событие делать массив (для оптимизации) 
// Касаясь уже jquery'вского bind'a - убрать лучше, если в тек версии jq есть on 
			
			
var Dispatcher = {
	_modules: [],
	_states : {"mousemove":false, "nodeInserted":false},
	create: function() {
	},	
	// Вызывает обработчик соответствующего события
	fire: function(event) {
		for (var i = 0; i < this._modules.length; i++) {
			if (this._modules[i][event]) {
				this._modules[i][event]();
			}
		}
		this._states[event] = false;
	},	
	registerModule : function(module) {
		this._modules.push(module);
		if (module["create"]) {
			module.create();
		}
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
		if ($('#ui_css').length == 0) {
			GM_addGlobalStyleURL('godville-ui.css', 'ui_css');
		}  // why here?
		ui_words.init();
		ui_timeout_bar.create();
		ui_informer.init();
		
		
		// Инициализируем диспетчер.
		Dispatcher.create();
		$('html').mousemove(function(){
			if (!Dispatcher._states["mousemove"]) {
				Dispatcher._states["mousemove"] = true;
				setTimeout(function(){Dispatcher.fire("mousemove");},500);	
			}
		});

		$(document).bind("DOMNodeInserted", function(){
			if (!Dispatcher._states["nodeInserted"]) {
				Dispatcher._states["nodeInserted"] = true;
				setTimeout(function(){Dispatcher.fire("nodeInserted");},200);	
			}
		});		

		Dispatcher.registerModule(ButtonRelocator);
		Dispatcher.registerModule(EquipmentImprover);
		Dispatcher.registerModule(ChatImprover);
		Dispatcher.registerModule(DungeonImprover);
		Dispatcher.registerModule(LootImprover);
		Dispatcher.registerModule(VoiceImprover);
		Dispatcher.registerModule(ui_improver);
		Dispatcher.registerModule(Logger);
		Dispatcher.registerModule(ui_menu_bar);
		Dispatcher.registerModule(PetImprover);
		Dispatcher.registerModule(InterfaceImprover);
		Dispatcher.registerModule(DiaryImprover);
		Dispatcher.registerModule(StatsImprover);
		
		// что-то типа оповещения об апдейтах
		if (ui_utils.isDeveloper()) {
			setInterval(function() {
				$('#fader').load('forums/show/2 td', function() {
					var posts = parseInt($('#fader .entry-title:contains("Аддоны для Firefox и Chrome - дополнения в интерфейс игры")').parent().next().text());
					if (posts > ui_storage.get('posts')) {
						ui_storage.set('posts', posts);
						ui_informer.update('new posts', false);
						ui_informer.update('new posts', true);
					}
					$('#fader').empty();
				});
			}, 300000);
		}
		
		var finish = new Date();		
		GM_log('Godville UI+ initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
	}
}, 200);

