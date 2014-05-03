

// ------------------------
// Oneline logger
// ------------------------
// ui_logger.create -- создать объект
// ui_logger.appendStr -- добавить строчку в конец лога
// ui_logger.needSepratorHere -- перед первой же следующей записью вставится разделитель
// 

/*
 * Refactoring
 * Тут я убрал череду стройных вызовов одного метода, вынеся данные в массив. 
 * 
 * stats = статистика? Графики рисовать будем или диаграммы? Переименовать!
 * Например: info, parameter, state
 *  
 */
// !requires ui_data.isArena ui_data.isMap ui_storage.set_with_diff


var Logger = {
	updating : true,
	need_separator : false,
	elem : null,
	
	create : function(){
		this.elem = $('<ul id="stats_log" />');
		$('#menu_bar').after(this.elem);
		this.elem.append('<div id="fader" style="position: absolute; left: 0; float: left; width: 50px; height: 100%;" />');
	},
	
	
	// Updates logger data
	update : function() {
		if (ui_data.isMap) {
			this.updateStats('dungeon');
		}
		if (ui_data.isArena && !ui_data.isMap) {
			this.updateStats('arena');
		}
		this.updateStats('general');
		this.need_separator = true;	
	},
	
	// Обновляет данные героя по определенной категории
	updateStats : function(category) {
		for (var key in constants["stats"][category]) {
			var el = constants["stats"][category][key];
			this.watchStatsValue(key, el[0], el[1], (el.length>2)? el[2]:key);
		}
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
		var diff = ui_storage.set_with_diff('Logger:' + id, ui_stats.get(id));
		if (diff) {
			// Если нужно, то преобразовываем в число с одним знаком после запятой
			if (parseInt(diff) != diff) 
				diff = diff.toFixed(1);
			// Добавление плюсика
			var s = (diff < 0) 
					? ("exp,tsk".match(name) ? '→' + ui_stats.get(id) : diff) 
					: '+' + diff;
			this.appendStr(id, css, name + s, descr);
		}
	},
	
	mousemove : function() {
		// Update logger when user moves the mouse pointer
		if (this.updating) {
			this.updating = true;
			if (!ui_data.isArena)
				this.update();
			setTimeout(function() {
				this.updating = false;
			}, 500);
		}
	},
	nodeInserted : function() {
		if (ui_data.isArena) {
			this.update();
		}
	}

};