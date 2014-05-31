var Logger = {
	need_separator: false,
	elem: null,
	_old: {},
	_old_sum: null,
	create: function(){
		this.elem = $('<ul id="stats_log" />');
		$('#menu_bar').after(this.elem);
		this.elem.append('<div id="fader" style="position: absolute; left: 0; float: left; width: 50px; height: 100%;" />');
		// инициализация для изменений до загрузки.
		for (var id in this.stats) {
			var value = ui_storage.get("Stats:" + id);
			if (value) {
				this._old[id] = value;
			}
		}
		
		var hp_parser = function(val) {
			if (val == "повержен")
				val = 0;
			return parseInt(val);
		};
		
		if (ui_data.location == "dungeon") {
			this._old["Map_All_HP"] = this._sum("Map_Friend_HP");
			var s = 0;
			$("#alls .opp_h").each(function(index, value){s += hp_parser(value);});
			this.changed("Map_All_HP", s);	
		} else if (ui_data.location == "boss") {
			this._old["Hero_All_HP"] = this._sum("Hero_Friend_HP");
			var s = 0;
			$("#alls .opp_h").each(function(index, value){s += hp_parser(value);});
			this.changed("Hero_All_HP", s);			
		}
		
	},
	changed: function(id, value) {
		console.log(id, value);
		if (this._old[id] == undefined)
			this._old[id] = ui_storage.get("Stats:" + id);
		var diff = value - this._old[id];
		this._old[id] = value;
		if (diff) {
			this._writeLogItem(id, diff);
		}
		// Здесь надо как-то обновить в первый раз AllHP
	},
	_change_sum: function() {
		if (ui_data.location == "dungeon") {
			this.changed("Map_All_HP", this._sum("Map_Friend_HP"));
		} else if (ui_data.location != "field") {
			this.changed("Hero_All_HP", this._sum("Hero_Friend_HP"));
		}
	},
	diaryMessageAdded : function() {
		this._change_sum();
		this.need_separator = true;
	},
	_sum: function(sum_id) {
		var s = 0;
		var i = 0;
		do {	
			var c = ui_storage.get("Stats:" + sum_id + i);
			i++;
			if (c === null)
				return s;
			s += parseInt(c) || 0;
		} while (true);
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

	_writeLogItem : function(id, diff) {
		var el = this.stats[id];
		if (el === undefined)
			return;
		var name = el[0];
		var descr = el[1];
		var css = (el.length>2)? el[2]:id.toLowerCase();

		// Если нужно, то преобразовываем в число с одним знаком после запятой
		if (parseInt(diff) != diff) 
			diff = diff.toFixed(1);
		// Добавление плюсика
		var s = (diff > 0) ? '+' + diff : diff;  
				//? ("exp".match(name) ? '→' + ui_storage.get("Stats:" + id) : diff)
		this.appendStr(id, css, name + s, descr);
	},
	stats: 	{	
		// ID      label     decription   css_class  
		'Map_HP': ['hp', 'Здоровье героя', 'hp'],
		'Map_Inv': ['inv', 'Инвентарь', 'inv'],
		'Map_Gold': ['gld', 'Золото', 'gold'],
		'Map_Battery': ['bt', 'Заряды', 'battery'],
		//'Map_Friend_HP': ['a:hp', 'Здоровье союзников', 'brick'],
		'Map_All_HP': ['a:hp', 'Здоровье союзников', 'brick'],
		'Map_Level': ['lvl', 'Уровень'],
		'Map_Prana': ['pr', 'Прана (проценты)'],
		'Hero_Level': ['lvl', 'Уровень'],
		'Hero_Prana': ['pr', 'Прана (проценты)'],
		'Hero_HP': ['h:hp', 'Здоровье героя', 'hp'],
		'Enemy_HP': ['e:hp', 'Здоровье соперника', 'death'],
		//'Hero_Friend_HP': ['a:hp', 'Здоровье союзников', 'brick'],
		'Hero_All_HP': ['a:hp', 'Здоровье союзников', 'brick'],
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