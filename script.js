
// Обработчик событий. Рассылает всем модулям уведомления.
// Позже можно организовать приоритеты
// потом можно отдельно на каждое событие делать массив (для оптимизации) 
// Касаясь уже jquery'вского bind'a, убрать лучше, если в тек версии jq есть on 			
var Dispatcher = {
	_modules: [],
	parsers: {},
	_states : {"nodeInserted": false},
	create: function() {
	},	
	// Вызывает обработчик соответствующего события
	fire: function(event, args) {
		for (var i = 0; i < this._modules.length; i++) {
			if (this._modules[i][event]) {
				if (args) {
					this._modules[i][event](args);
				} else {
					this._modules[i][event]();
				}
			}
		}
		this._states[event] = false;
	},	
	registerModule : function(module) {
		if (module.moduleProperties)
			if (module.moduleProperties['locations'])
				if (!module.moduleProperties['locations'].match(ui_data.location))
					return;
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
	watchLabel: function() {
		var id = $(this).attr("id");
		var parser = Dispatcher.parsers[id];
		var value = parser($(this).text());		
		if (id == 'Brick' || id == 'Wood')
			value = Math.floor(value*10 + 0.5);
		
		// Я хз зачем, но разрабы обнуляют gold перед изменением
		if (id == "Gold" && $(this).text() == "") {
			return;
		}
		Dispatcher.fire("changed", {"id": id, "value": value});
	},
	watchProgress: function(mutation) {
		var id = $(mutation.target).attr("id");
		var value = $(mutation.target).attr('title').replace(/[^0-9]/g, '');		
		Dispatcher.fire("changed", {"id": id, "value": value});
	},	
};
var gold_parser = function(val) {
	return parseInt(val.replace(/[^0-9]/g, '')) || 0;
};

var watchElements= function(params) {
	for (var type in params) {
		if (type == 'label') {
			for (var container in params[type]) {
				var a = params[type][container];
				var $container = $(container);
				for (var id in a) {
					var $label = ui_utils.findLabel($container, a[id][0]);
					var $field = $label.siblings('.l_val');
					$field.attr("id", id);
					Dispatcher.parsers[id] = a[id][1] || parseInt;
					$field.on("DOMSubtreeModified", Dispatcher.watchLabel);	
					// передает начальное значение					
					$field.trigger("DOMSubtreeModified");
				}
			}
		}
		if (type == 'progress') {
			for (var id in params[type]) {
				var $pbar = $(params[type][id]);
				if ($pbar.length > 0) {
					var value = $pbar.attr('title').replace(/[^0-9]/g, '');
					$pbar.attr("id", id);
					var MutationObserver = window.MutationObserver
				    || window.WebKitMutationObserver
				    || window.MozMutationObserver;
					var observer = new MutationObserver(function(mutations) {  
						    mutations.map(function(obj){
						    	Dispatcher.watchProgress(obj);
						    });
						  });
						 
					observer.observe($pbar[0], {attributes: true});				
				}
			}
		}
	}
};


// wait for stats  
var starter = setInterval(function() {
	if ($('#m_info').length || $('#stats').length) {
		var start = new Date();
		clearInterval(starter);
		
		
		ui_data.create();
		ui_storage.clearStorage();
		if ($('#ui_css').length == 0) {
			GM_addGlobalStyleURL('godville-ui.css', 'ui_css');
		}  // why here?
		ui_words.init();
		ui_timeout_bar.create(); // надо сделать lazy init или прямо в voiceImprover
		ui_informer.init();
			
		// Инициализируем диспетчер.
		Dispatcher.create();

		$(document).bind("DOMNodeInserted", function(){
			if (!Dispatcher._states["nodeInserted"]) {
				Dispatcher._states["nodeInserted"] = true;
				setTimeout(function(){Dispatcher.fire("nodeInserted");},500);	
			}
		});		
		
		Dispatcher.registerModule(Monitor);
		Dispatcher.registerModule(ButtonRelocator);
		Dispatcher.registerModule(EquipmentImprover);
		Dispatcher.registerModule(ChatImprover);
		Dispatcher.registerModule(DungeonImprover);
		Dispatcher.registerModule(LootImprover);
		Dispatcher.registerModule(VoiceImprover);
		Dispatcher.registerModule(Logger);
		Dispatcher.registerModule(ui_menu_bar);
		Dispatcher.registerModule(PetImprover);
		Dispatcher.registerModule(InterfaceImprover);
		/*
		params = {
				'label': { 
					'#id_блока': {				
						'внутренний_id_значения': ['Текст, после которого идет значение',
						 парсер(gold_parser/parseInt/parseFloat)],
					},
				},
				'progress': {		
					'внутренний_id_значения': 'селектор',
				},
			}
			 */
		if (ui_data.location == "field") {
			watchElements({
				'label': {
					'#stats': {				
						'Gold': ['Золота', gold_parser],
						'Inv': ['Инвентарь', parseInt],
						'HP': ['Здоровье', parseInt],
						'Level': ['Уровень', parseInt],
						'Monster': ['Убито монстров', parseInt],
						'Death': ['Смертей', parseInt],
						'Brick': ['Кирпичей для храма', parseFloat],
						'Wood': ['Дерева для ковчега', parseFloat],
						'Retirement': ['Сбережения', gold_parser]
					},
					'#cntrl':{
						'Prana': ['Прана', parseInt],
					}
				},
				'progress': {		
					'Exp': '#hk_level .p_bar',
					'Task': '#hk_quests_completed .p_bar'
				},
			});
		} else {
			watchElements({
				'label': {
					'#m_info': {				
						'Gold': ['Золота', gold_parser],
						'Inv': ['Инвентарь', parseInt],
						'HP': ['Здоровье', parseInt],
						'Level': ['Уровень', parseInt],
						'Death': ['Смертей', parseInt],
					},
					'#cntrl':{
						'Prana': ['Прана', parseInt],
					}
				},
				'progress': {		
					'Exp': '#hk_level .p_bar',
					'Task': '#hk_quests_completed .p_bar'
				},
			});			
		}		
		var finish = new Date();		
		GM_log('Godville UI+ initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
		
	}
});