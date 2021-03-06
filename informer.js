 
var Monitor = {
		create: function() {
		},
		changed: function(id, value) {
			ui_informer.update('much_gold', ui_storage.get('Stats:Gold') >= (ui_storage.get('Stats:Brick') > 1000 ? 10000 : 3000));
			ui_informer.update('dead', ui_storage.get('Stats:HP') == 0);			
		},
		diaryMessageAdded: function() {				

			if (ui_data.location == "field") {
				
				var monsterWithCapabilities = false;
				var monstersOfTheDay = false;
				// Если герой дерется с монстром
				if ($('#news .line')[0].style.display != 'none') {
					var currentMonster = $('#news .l_val').text();
					var monsterTypes = ['Врачующий', 'Дарующий', 'Зажиточный', 'Запасливый', 'Кирпичный', 'Латающий', 'Лучезарный', 'Сияющий', 'Сюжетный', 'Линяющий'];
					monstersOfTheDay = ui_data.monstersOfTheDay.indexOf(currentMonster) != -1;
					for (var i = 0; i < monsterTypes.length; i++) {
						if (currentMonster.indexOf(monsterTypes[i]) != -1) {
							monsterWithCapabilities = true;
							break;
						}
					}
				}
				ui_informer.update('monster of the day', monstersOfTheDay);
				ui_informer.update('monster with capabilities', monsterWithCapabilities);
			}
			ui_informer.update('full prana', $('#control .p_val').width() == $('#control .p_bar').width());
			ui_informer.update('pvp', ui_data.location != "field");
		},
	};


// ------------------------------------
// Информаер для важной информации
// * мигает заголовком
// * показывает попапы
// ------------------------------------
var ui_informer = {
	flags: {},
	title: null,
	container: null,
	init: function() {

		this.title = document.title;
		// container
		this.container = $('<div id="informer_bar" style="position: fixed; top: 0; z-index: 301;"/>');
		$('#main_wrapper').prepend(this.container);
		// load and draw labels
		this.load();
		for (var flag in this.flags) {
			if (this.flags[flag])
				this.create_label(flag);
		}
		// run flicker
		this.tick();
	},
	
	
	// устанавливает или удаляет флаг
	update: function(flag, value) {
		if (value && (flag == 'pvp' || ui_data.location == "field") && !(ui_storage.get('Option:forbiddenInformers') &&
			ui_storage.get('Option:forbiddenInformers').match(flag.replace(/= /g, '').replace(/> /g, '').replace(/ /g, '_')))) {
			if (!(flag in this.flags)) {
				this.flags[flag] = true;
				this.create_label(flag);
				this.save();
			}
		} else {
			if (flag in this.flags) {
				delete this.flags[flag];
				this.delete_label(flag);
				this.save();
			}
		}
		if (!this.tref)
			this.tick();
	},
	// убирает оповещение о событии
	hide: function(flag) {
		this.flags[flag] = false;
		this.delete_label(flag);
		this.save();
	},
	// PRIVATE
	load: function() {
		var fl = ui_storage.get('informer_flags');
		if (!fl || fl == "") fl = ' {}';
		this.flags = JSON.parse(fl);
	},
	
	save: function() {
		ui_storage.set('informer_flags', JSON.stringify(this.flags));
	},
	
	create_label: function(flag) {
		var $label = $('<div>' + flag + '</div>')
			.click(function() {
						 ui_informer.hide(flag);
						 return false;
					});
		this.container.append($label);
	},
	
	delete_label: function(flag) {
		$('div', this.container)
			.each(function() {
						var $this = $(this);
						if ($this.text() == flag) {
							$this.remove();
					 }
				 });
	},
	
	tick: function() {
		// пройти по всем флагам и выбрать те, которые надо показывать
		var to_show = [];
		for (var flag in this.flags) {
			if (this.flags[flag])
				to_show.push(flag);
		}
		to_show.sort();

		// если есть чё, показать или вернуть стандартный заголовок
		if (to_show.length > 0) {
			this.update_title(to_show);
			this.tref = setTimeout(function() {ui_informer.tick.call(ui_informer);}, 700);
		} else {
			this.clear_title();
			this.tref = undefined;
		}
	},

	clear_title: function() {
		var pm = $('.fr_new_badge_pos:visible').text();
		pm = pm ? '[' + pm + '] ' : '';
		document.title = pm + this.title;
		$('link[rel="shortcut icon"]').remove();
		$('head').append('<link rel="shortcut icon" href="images/favicon.ico" />');
	},
	
	// мигающий favicon + заголовок
	update_title: function(arr) {
		this.odd_tick = ! this.odd_tick;
		var sep, favicon;
		if (this.odd_tick) {
			sep = '...';
			favicon = 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAAF0lEQVRIx2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=';
		} else {
			sep = '!!!';
			favicon = "images/favicon.ico";
		}
		document.title = sep + ' ' + arr.join('! ') + ' ' + sep;
		$('link[rel="shortcut icon"]').remove();
		$('head').append('<link rel="shortcut icon" href=' + favicon + ' />');		
	}
};
