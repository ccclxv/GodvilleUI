

// ------------------------
// Oneline logger
// ------------------------
// ui_logger.create -- создать объект
// ui_logger.appendStr -- добавить строчку в конец лога
// ui_logger.needSepratorHere -- перед первой же следующей записью вставится разделитель
// 


var Logger = {
	need_separator : false,
	elem : null,
	create : function(){
		this.elem = $('<ul id="stats_log" />');
		$('#menu_bar').after(this.elem);
		this.elem.append('<div id="fader" style="position: absolute; left: 0; float: left; width: 50px; height: 100%;" />');
	},
	changed: function(data) {
		var id = data.id;
		var el = this.stats[id];
		this.watchStatsValue(id, el[0], el[1], (el.length>2)? el[2]:id.toLowerCase());
	},
	
	// Appends element to logger
	appendStr : function(id, cssClass, label, descr) {
		// append separator if needed
		if (this.need_separator) {
			this.need_separator = false;
			if (this.elem.children().length > 0) {
				this.elem.append('<li class="separator">|</li>');
			}
		}
		// append string	
		this.elem.append('<li class="' + cssClass + '" title="' + descr + '">' + label + '</li>');
		this.elem.scrollLeft(10000); //Dirty fix	???	
		while ($('#stats_log li').position().left + $('#stats_log li').width() < 0 
				|| $('#stats_log li')[0].className == "separator") { //change to :first
			$('#stats_log li:first').remove();
		}
		if ($('#fader').position().left != 0) {
			$('#fader').css("left", parseFloat($('#fader').css("left").replace('px', '')) - $('#fader').position().left);
		}
		
	},

	watchStatsValue : function(id, name, descr, css) {
		var diff = ui_storage.get('Stats:' + id) - ui_storage.getOld('Stats:' + id);
		if (diff) {
			// Если нужно, то преобразовываем в число с одним знаком после запятой
			if (parseInt(diff) != diff) 
				diff = diff.toFixed(1);
			// Добавление плюсика
			var s = (diff < 0) 
					? ("exp".match(name) ? '→' + ui_storage.get("Stats:" + id) : diff) 
					: '+' + diff;
			this.appendStr(id, css, name + s, descr);
		}
	},
	
	nodeInserted : function() {
		this.need_separator = true;
	},
	stats: 	{	
		// ID      label     decription   css_class  
		'Map_HP': ['hp', 'Здоровье героя', 'hp'],
		'Map_Inv': ['inv', 'Инвентарь', 'inv'],
		'Map_Gold': ['gld', 'Золото', 'gold'],
		'Map_Battery': ['bt', 'Заряды', 'battery'],
		'Map_Alls_HP': ['a:hp', 'Здоровье союзников', 'brick'],
		'Hero_HP': ['h:hp', 'Здоровье героя', 'hp'],
		'Enemy_HP': ['e:hp', 'Здоровье соперника', 'death'],
		'Hero_Alls_HP': ['a:hp', 'Здоровье союзников', 'brick'],
		'Hero_Inv': ['h:inv', 'Инвентарь', 'inv'],
		'Hero_Gold': ['h:gld', 'Золото', 'gold'],
		'Hero_Battery': ['h:bt', 'Заряды', 'battery'],
		'Enemy_Gold': ['e:gld', 'Золото', 'monster'],
		'Enemy_Inv': ['e:inv', 'Инвентарь', 'monster'],	
		'Level': ['lvl', 'Уровень'],
		'HP': ['hp', 'Здоровье'],
		'Prana': ['pr', 'Прана (проценты)'],
		'Battery': ['bt', 'Заряды', 'battery'],
		'Exp': ['exp', 'Опыт (проценты)'],
		'Task': ['tsk', 'Задание (проценты)'],
		'Monster': ['mns', 'Монстры'],
		'Inv': ['inv', 'Инвентарь'],
		'Gold': ['gld', 'Золото'],
		'Brick': ['br', 'Кирпичи'],
		'Wood': ['wd', 'Дерево'],
		'Retirement': ['rtr', 'Сбережения (тысячи)'],
		'Equip1': ['eq1', 'Оружие', 'equip'],
		'Equip2': ['eq2', 'Щит', 'equip'],
		'Equip3': ['eq3', 'Голова', 'equip'],
		'Equip4': ['eq4', 'Тело', 'equip'],
		'Equip5': ['eq5', 'Руки', 'equip'],
		'Equip6': ['eq6', 'Ноги', 'equip'],
		'Equip7': ['eq7', 'Талисман', 'equip'],
		'Death': ['death', 'Смерти']
	}

};