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
	create: function() {
		// При входе из поля в подземелье чистим соответствующие записи
		if (ui_storage.get("Logger:LocationPrev") == "field" && ui_data.location == "dungeon") {
			ui_storage.clearWithPrefix("Stats:Map_");
		// Не в поле при смене режима чистим соответствующие записи
		} else if (ui_storage.get("Logger:LocationPrev") != ui_data.location && ui_data.location != "field") {
				ui_storage.clearWithPrefix("Stats:Hero_");
				ui_storage.clearWithPrefix("Stats:Enemy_");
		}
	},	
	getModuleName: function(module){
		if (module.moduleProperties) {
			if (module.moduleProperties['name']) {
				return module.moduleProperties['name']; 
			}
		}
		return "";
	},
	registerModule : function(module) {
		moduleName = "";
		if (module.moduleProperties) {
			if (module.moduleProperties['locations']) {
				if (!module.moduleProperties['locations'].match(ui_data.location))
					return;
			}
		}
		this._modules.push(module);
		if (module["create"]) {
			try {
				module.create();
			} catch(e) {
				Debug.error("(" + this.getModuleName(module) + ":" + Debug.lineNumber(e) + ") |constructor| " + e);
			}
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
	fire: function(event, arg1, arg2) {
		for (var i = 0; i < this._modules.length; i++) {
			var module = this._modules[i];
			if (module[event]) {
				try {
					if (arg2 !== undefined) {
						module[event](arg1, arg2);
					} else if (arg1 !== undefined) {
						module[event](arg1);
					} else {
						module[event]();
					}
				} catch(e) {
					Debug.error("(" + this.getModuleName(module) + ":" + Debug.lineNumber(e) + ") |fire: " + event + "| " + e);
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
		if ((id == "Gold" || id == "Enemy_Gold" || id == "Hero_Gold" || id == "Map_Gold" ) && $(this).text() == "") {
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
		var parser = Dispatcher.parsers[id];
		var value = parser($(this).text());
		if (id && value === parser($(this).text())) {
			ui_storage.set("Stats:" + id, value);
			Dispatcher.fire("changed", id, value);
		}
	},
	// Индивидуальные наблюдатели
	monsterVisible: false,
	lastMonster: "",
	watchMonster: function(obj) {	
		if ($(obj).is(":visible") != Dispatcher.monsterVisible || $(obj).is(":visible") && Dispatcher.lastMonster !== $('#news .line .l_val').text()) {
			Dispatcher.monsterVisible = $(obj).is(":visible");
			Dispatcher.lastMonster = $('#news .line .l_val').text();
			if (Dispatcher.monsterVisible) {
				Dispatcher.fire("monster", Dispatcher.lastMonster);
			} else {
				Dispatcher.fire("monster", "");
			} 
		}
	},
	setMonsterWatcher: function() {
		var MutationObserver = window.MutationObserver
	    || window.WebKitMutationObserver
	    || window.MozMutationObserver;
		var observer = new MutationObserver(function(mutations) {  
			    mutations.map(function(mutation){
			    	Dispatcher.watchMonster(mutation.target);
			    });
			  });
			 
		observer.observe($('#news .line')[0], {attributes: true, subtree: true});
		this.watchMonster($('#news .line')[0]);
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

var hp_parser = function(val) {
	if (val == "повержен")
		val = 0;
	return parseInt(val);
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
					Dispatcher.watchProgress({"target":$pbar[0]});
				}
			}
		}
		else if (type == 'value') {
			for (var id in params[type]) {
				Dispatcher.parsers[id] = params[type][id][1] || parseInt;
				var $obj = $(params[type][id][0]);
				$obj.addClass(GVUI_PREFIX + id);
				$obj.on("DOMSubtreeModified", Dispatcher.watchValue);	
				// передает начальное значение					
				$obj.trigger("DOMSubtreeModified");				
			}
		}			
	}
};


// wait for stats  
var starter = setInterval(function() {
	if ($('#m_info').length || $('#stats').length) {
		var start = new Date();
		clearInterval(starter);
		$("#main_wrapper").append("<div id='tmp_element' style='display: none'>");
		
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
		    if ($element.prop("tagName") == "LI" && $element.parent().parent().attr("id") == "inv_block_content") {
		    	//Debug.log("+ inventory", e.target);
		    	//Dispatcher.fire("diaryMessageAdded", $element);
		    }
		    //console.log('!LOG! Inserted| ', 'id: ' + $element.attr('id'), 'class: ' + $element.attr('class'), e.target);
		});
		$(document).bind('DOMNodeRemoved', function(e) {
			var $element = $(e.target);
			if ($element.prop("tagName") == "LI" && $element.parent().parent().attr("id") == "inv_block_content") {
		    	//Debug.log("- inventory", e.target);
		    	//Dispatcher.fire("diaryMessageAdded", $element);
		    }
			//console.log('!LOG! Removed| ', 'id: ' + $element.attr('id'), 'class: ' + $element.attr('class'), e.target);
		});
		if (typeof ui_menu_bar !== 'undefined') Dispatcher.registerModule(ui_menu_bar);
		else Debug.error("Невозможно найти модуль ui_menu_bar");
		if (typeof Debug !== 'undefined') Dispatcher.registerModule(Debug);
		else Debug.error("Невозможно найти модуль Debug");
		if (typeof Monitor !== 'undefined') Dispatcher.registerModule(Monitor);
		else Debug.error("Невозможно найти модуль Monitor");
		if (typeof ButtonRelocator !== 'undefined') Dispatcher.registerModule(ButtonRelocator);
		else Debug.error("Невозможно найти модуль ButtonRelocator");
		if (typeof EquipmentImprover !== 'undefined') Dispatcher.registerModule(EquipmentImprover);
		else Debug.error("Невозможно найти модуль EquipmentImprover");
		if (typeof ChatImprover !== 'undefined') Dispatcher.registerModule(ChatImprover);
		else Debug.error("Невозможно найти модуль ChatImprover");
		if (typeof LootImprover !== 'undefined') Dispatcher.registerModule(LootImprover);
		else Debug.error("Невозможно найти модуль LootImprover");
		if (typeof VoiceImprover !== 'undefined') Dispatcher.registerModule(VoiceImprover);
		else Debug.error("Невозможно найти модуль VoiceImprover");
		if (typeof DungeonImprover !== 'undefined') Dispatcher.registerModule(DungeonImprover);
		else Debug.error("Невозможно найти модуль DungeonImprover");
		if (typeof Logger !== 'undefined') Dispatcher.registerModule(Logger);
		else Debug.error("Невозможно найти модуль Logger");
		if (typeof PetImprover !== 'undefined') Dispatcher.registerModule(PetImprover);
		else Debug.error("Невозможно найти модуль PetImprover");
		if (typeof InterfaceImprover !== 'undefined') Dispatcher.registerModule(InterfaceImprover);
		else Debug.error("Невозможно найти модуль InterfaceImprover");
		
		

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
					'Equip1': ['#eq_0 .eq_level'],
					'Equip2': ['#eq_1 .eq_level'],
					'Equip3': ['#eq_2 .eq_level'],
					'Equip4': ['#eq_3 .eq_level'],
					'Equip5': ['#eq_4 .eq_level'],
					'Equip6': ['#eq_5 .eq_level'],
					'Equip7': ['#eq_6 .eq_level'],
					'Battery': ['#control .acc_val', parseFloat],
				}
			});
			Dispatcher.setMonsterWatcher();	
		} else {
			if (ui_data.location == "dungeon") {
				watchElements({
					'label': {
						'#m_info': {				
							'Map_Gold': ['Золота', gold_parser],
							'Map_Inv': ['Инвентарь'],
							'Map_HP': ['Здоровье'],
						},
						'#cntrl':{
							'Map_Prana': ['Прана'],
						}
					},
					'value': {
						'Map_Battery': ['#control .acc_val', parseFloat],
					},		
				});
				var values = {'value':{}};
				var $box = $('#alls .opp_h');
				for (var i = 0; i < $box.length; i++) {
					values['value']["Map_Friend_HP" + i] = ['#alls .opp_h:eq('+ i + ')', hp_parser];				
				}
				watchElements(values);	
			} else {
				watchElements({
					'label': {
						'#m_info': {				
							'Hero_Gold': ['Золота', gold_parser],
							'Hero_Inv': ['Инвентарь'],
							'Hero_HP': ['Здоровье'],
						},
						'#o_info': {
							'Enemy_HP': ['Здоровье'],
							'Enemy_Gold': ['Золота', gold_parser],
							'Enemy_Inv': ['Инвентарь']
						},
						'#cntrl':{
							'Hero_Prana': ['Прана'],
						}
					},
					'value': {
						'Hero_Battery': ['#control .acc_val', parseFloat],
					},		
				});
				var values = {'value':{}};
				var $box = $('#alls .opp_h');
				for (var i = 0; i < $box.length; i++) {
					values['value']["Hero_Friend_HP" + i] = ['#alls .opp_h:eq('+ i + ')', hp_parser];				
				}
				watchElements(values);					
					/*var values = {'value':{}};
					var $box = $('#opps .opp_h');
					for (var i = 0; i < $box.length; i++) {
						values['value']["Enemy_HP" + i] = ['#opps .opp_h:eq('+ i + ')'];				
					}
					watchElements(values);*/
			}
		}		
		ui_storage.set("Logger:LocationPrev", ui_data.location);
		var finish = new Date();		
		GM_log('Godville UI+ initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
		
	}
}, 200);
