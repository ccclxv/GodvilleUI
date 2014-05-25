GVUI_PREFIX = "GVUI_";
/* Обработчик событий. 
 * Рассылает всем модулям уведомления при:
 * - изменении значения элемента, для которого зарегистрированны наблюдатели
 * - добавлении новой записи в дневник
 * - добавлении сообщения в чат
 * Инициализирует все зарегистрированные модули.
 * Поддерживает условную загрузку в зависимости от режима страницы (поле/босс/арена/подземелье)
 */
// Возможно нужны будут когда-нибудь зависимости
// Фильтрация событий
var Dispatcher = {
	_modules: [],
	parsers: {},
	_sums: {},
	create: function() {
		var i = 0;
		do {
			c = ui_storage.get("Stats:" + "Friend_HP" + i);
		    if (c != null) {
		    	ui_storage.set("Stats:" + "Friend_HP" + i, null);
		    }
		    i++;
		} while (c != null);
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
	},	
	// наблюдатели
	watchLabel: function() {
		var id = Dispatcher.getId(this);
		var parser = Dispatcher.parsers[id];
		var value = parser($(this).text());		
		if (id == 'Brick' || id == 'Wood')
			value = Math.floor(value*10 + 0.5);
		
		// Я хз зачем, но разрабы обнуляют gold перед изменением
		if (id == "Gold" && $(this).text() == "") {
			return;
		}
		ui_storage.set("Stats:" + id, value);
		Dispatcher.fire("changed", id, value);

	},
	watchProgress: function(mutation) {
		var id = Dispatcher.getId(mutation.target);
		var value = $(mutation.target).attr('title').replace(/[^0-9]/g, '');
		ui_storage.set("Stats:" + id, value);
		Dispatcher.fire("changed", id, value);
	},	
	watchValue: function() {		
		var id = Dispatcher.getId(this);
		var value = $(this).text();
		if (id) {
			ui_storage.set("Stats:" + id, value);
			Dispatcher.fire("changed", id, value);
			var obj = Dispatcher._sum(id);
			if (obj != null)
				Dispatcher.fire("changed", obj.id, obj.value);
		}
	},
	// сумматор для onchanged с id ID
	_sum: function(id) {
		for (var sum_id in this._sums) {
			if (id.match(sum_id)) {
				var s = 0;
				for (var i = 0; i < this._sums[sum_id]; i++) {	
					var c = ui_storage.get("Stats:" + sum_id + i);
					if (c == null)
						return null;
					s += parseInt(c);
				}
				return {"id": sum_id, "value": s};
			}
		}
		return null;
	},
	// возвращает внутренний id для элемента
	getId: function(element) {
		var classes = element.classList;
		for (var i = 0; i < classes.length; i++) {
			if (classes[i].match(GVUI_PREFIX)){
				return classes[i].replace(GVUI_PREFIX, "");
			}
		}
		return null;
	},	
};
var gold_parser = function(val) {
	return parseInt(val.replace(/[^0-9]/g, '')) || 0;
};

// связывает наблюдателей с элементами
var watchElements= function(params) {
	for (var type in params) {
		if (type == 'label') {
			for (var container in params[type]) {
				var a = params[type][container];
				var $container = $(container);
				for (var id in a) {
					var $label = ui_utils.findLabel($container, a[id][0]);
					var $field = $label.siblings('.l_val');
					$field.addClass(GVUI_PREFIX + id);
					Dispatcher.parsers[id] = a[id][1] || parseInt;
					$field.on("DOMSubtreeModified", Dispatcher.watchLabel);	
					// передает начальное значение					
					$field.trigger("DOMSubtreeModified");
				}
			}
		}
		else if (type == 'progress') {
			for (var id in params[type]) {
				var $pbar = $(params[type][id]);
				if ($pbar.length > 0) {
					var value = $pbar.attr('title').replace(/[^0-9]/g, '');
					$pbar.addClass(GVUI_PREFIX + id);
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
		else if (type == 'value') {
			for (var id in params[type]) {
				var $obj = $(params[type][id]);
				$obj.addClass(GVUI_PREFIX + id);
				$obj.on("DOMSubtreeModified", Dispatcher.watchValue);	
				// передает начальное значение					
				$obj.trigger("DOMSubtreeModified");				
			}
		}	
		else if (type == 'sum') {
			for (var id in params[type]) {
				Dispatcher._sums[id] = $(params[type][id]).length;		
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
		ui_informer.init();
			
		// Инициализируем диспетчер.
		Dispatcher.create();	
		
		$(document).bind('DOMNodeInserted', function(e) {
		    var $element = $(e.target);
		    if ($element.hasClass("fr_msg_l")) {
		    	Dispatcher.fire("chatMessageAdded", $element);
		    }
		    if ($element.hasClass("d_msg")) {
		    	Dispatcher.fire("diaryMessageAdded", $element);
		    }		    
		});
		
		Dispatcher.registerModule(Monitor);
		Dispatcher.registerModule(ButtonRelocator);
		Dispatcher.registerModule(EquipmentImprover);
		Dispatcher.registerModule(ChatImprover);
		Dispatcher.registerModule(LootImprover);
		Dispatcher.registerModule(VoiceImprover);
		Dispatcher.registerModule(DungeonImprover);		
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
				'value': {
					'Equip1': '#eq_0 .eq_level',
					'Equip2': '#eq_1 .eq_level',
					'Equip3': '#eq_2 .eq_level',
					'Equip4': '#eq_3 .eq_level',
					'Equip5': '#eq_4 .eq_level',
					'Equip6': '#eq_5 .eq_level',
					'Equip7': '#eq_6 .eq_level'
				}
			});
		} else {
			watchElements({
				'label': {
					'#m_info': {				
						'Hero_Gold': ['Золота', gold_parser],
						'Hero_Inv': ['Инвентарь'],
						'Hero_HP': ['Здоровье'],
						'Level': ['Уровень'],		
					},
					'#o_info': {
						'Enemy_HP': ['Здоровье'],
						'Enemy_Gold': ['Золото', gold_parser],
						'Enemy_Inv': ['Инвентарь']
					},
					'#cntrl':{
						'Prana': ['Прана'],
					}
				},
				'progress': {		
					'Exp': '#hk_level .p_bar',
					'Task': '#hk_quests_completed .p_bar'
				},
				'sum': {
					'Friend_HP': '#alls .opp_h'
				//	'Enemy_HP'
				}
			});	
			var values = {'value':{}};
			var $box = $('#alls .opp_h');
			for (var i = 0; i < $box.length; i++) {
				values['value']["Friend_HP" + i] = '#alls .opp_h:eq('+ i + ')';				
			}
			watchElements(values);
			var values = {'value':{}};
			var $box = $('#opps .opp_h');
			for (var i = 0; i < $box.length; i++) {
				values['value']["Enemy_HP" + i] = '#opps .opp_h:eq('+ i + ')';				
			}
			watchElements(values);
		}		
		var finish = new Date();		
		GM_log('Godville UI+ initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
		
	}
});