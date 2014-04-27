

// ------------------------
// Oneline logger
// ------------------------
// ui_logger.create -- создать объект
// ui_logger.appendStr -- добавить строчку в конец лога
// ui_logger.needSepratorHere -- перед первой же следующей записью вставится разделитель
// Modifications:
// AUOE: code simplification  27.04.14


var Logger = function() {
	this.updating = false;
	
	
	var need_separator = false;
	var elem = $('<ul id="stats_log" />');
	$('#menu_bar').after(elem);
	elem.append('<div id="fader" style="position: absolute; left: 0; float: left; width: 50px; height: 100%;" />');
	
	
	
	// Updates logger data
	this.update = function() {
		if (ui_data.isMap) {
			updateStats('dungeon');
		}
		if (ui_data.isArena && !ui_data.isMap) {
			updateStats('arena');
		}
		updateStats('general');
		need_separator = true;	
	};
	
	// Updates stats by category
	var updateStats = function(category) {
		for (var key in constants["stats"][category]) {
			var el = constants["stats"][category][key];
			watchStatsValue(key, el[0], el[1], (el.length>2)? el[2]:el[0]);
		}
	};
	
	// Appends element to logger
	var appendStr = function(id, cssClass, label, descr) {
		// append separator if needed
		if (need_separator) {
			need_separator = false;
			if (elem.children().length > 0) {
				elem.append('<li class="separator">|</li>');
			}
		}
		// append string	
		elem.append('<li class="' + cssClass + '" title="' + descr + '">' + label + '</li>');
		elem.scrollLeft(10000); //Dirty fix	???	
		while ($('#stats_log li').position().left + $('#stats_log li').width() < 0 
				|| $('#stats_log li')[0].className == "separator") { //change to :first
			$('#stats_log li:first').remove();
		}
		if ($('#fader').position().left != 0) {
			$('#fader').css("left", parseFloat($('#fader').css("left").replace('px', '')) - $('#fader').position().left);
		}
		
	};

	var watchStatsValue = function(id, name, descr, css) {
		css = (css || id).toLowerCase();
		var diff = ui_storage.set_with_diff('Logger:' + id, ui_stats.get(id));
		if (diff) {
			// Если нужно, то преобразовываем в число с одним знаком после запятой
			if (parseInt(diff) != diff) 
				diff = diff.toFixed(1);
			// Добавление плюсика
			var s = (diff < 0) 
					? ("exp,tsk".match(name) ? '→' + ui_stats.get(id) : diff) 
					: '+' + diff;
			appendStr(id, css, name + s, descr);
		}
	};

};