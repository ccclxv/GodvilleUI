// ------------------------
//		UTILS
// ------------------------
var ui_utils = {
	// *SHARED* finds a label with given name 
	findLabel: function($base_elem, label_name) {
		return $('.l_capt', $base_elem).filter(function(index) {
			return $(this).text() == label_name;
		});
	},	
// *SHARED* checks if $elem already improved
// со временем надо убрать	
	isAlreadyImproved: function($elem) {
		if ($elem.hasClass('improved')) return true;
		$elem.addClass('improved');
		return false;
	}
};

// ------------------------
//		STORAGE
// ------------------------
var ui_storage = {
	get_key: function(key) {
		return "GM_" + ui_data.god_name + ':' + key;
	},
// stores a value
	set: function(id, value) {
		localStorage.setItem(this.get_key(id), value);
		return value;
	},
// reads a value
	get: function(id) {
		var val = localStorage.getItem(this.get_key(id));
		if (val) val = val.replace(/^[NSB]\]/, '');
		if (val == 'true') return true;
		if (val == 'false') return false;
		return val;
	},
// dumps all values related to current god_name
	dump: function(selector) {
		var lines = new Array;
		var r = new RegExp('^GM_' + ui_data.god_name + ':' + (selector == null ? '' : selector));
		for(var i = 0; i < localStorage.length; i++) {
			if (localStorage.key(i).match(r)) {
				lines.push(localStorage.key(i) + " = " + localStorage[localStorage.key(i)]);
			}
		}
		lines.sort();
		GM_log("Storage:\n" + lines.join("\n"));
	},
// resets saved options
	clear: function() {
		localStorage.setItem('GM_clean050613', 'false');
		location.reload();
		return "Storage cleared. Reloading...";
	},
	clearWithPrefix: function(prefix) {
		for (var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			var r = new RegExp(this.get_key(prefix + ".*"));
			if (key.match(r)) {
				console.log(key);
				if (localStorage.getItem(key) != null)
					localStorage.setItem(key, "");
			}
		}
	},
// deletes all values related to current god_name
	clearStorage: function() {
		if (localStorage.getItem('GM_clean050613') != 'true') {
			try {
				var idx_lst = [];
				var r = new RegExp('^GM_.*');
				var settings = new RegExp('^GM_[^:]+:Option:(?:forbiddenInformers|forcePageRefresh|freezeVoiceButton|relocateDuelButtons|useBackground|useHeil|useHeroName|useShortPhrases|hideChargeButton)');
				var stuff = new RegExp('^GM_[^:]+:(phrases|Stats|Logger).*');
				for (var i = 0; i < localStorage.length; i++) {
					var key = localStorage.key(i);
					if (key.match(r) && (!(key.match(settings) || key.match(stuff)) || key.match('undefined'))) idx_lst.push(key);
				}
				for(key in idx_lst) {
					localStorage.removeItem(idx_lst[key]);
				}
				localStorage.setItem('GM_clean050613', 'true');			
			} catch(error) {
				GM_log(error);
				if (GM_browser == "Firefox")
					GM_log('^happened at ' + error.lineNumber + ' line of ' + error.fileName);
			}
		}
	}
};

var ui_data = {
		monstersOfTheDay: '',
		currentVersion: '0.4.31.0',
		developers: ['Neniu', 'Ryoko', 'Опытный Кролик', 'Бэдлак', 'Ui Developer', 'Шоп'],
		location: null,
		create: function() {
			// Режим страницы героя
			if ($('#m_info').length == 0) {
				this.location = "field";
			} else if ($('#map .dml').length > 0) {
				this.location = "dungeon";
			} else if ($('#o_info .line').length > 0) {
				this.location = "boss";
			} else {
				this.location = "arena";
			}
			// Имя бога и героя				
			if (this.location != "field") {
				this.god_name = $('#m_info .l_val')[0].textContent.replace('庙','').replace('畜','').replace('舟','');
				this.char_name = $('#m_info .l_val')[1].textContent;
			} else {
				var $user = $('#stats.block div a[href^="/gods/"]')[0];
				this.god_name = decodeURI($user.href.replace(/http(s)?:\/\/godville\.net\/gods\//, ''));
				this.char_name = $user.textContent;
			}
			// Пол героя (используется в настройках, поэтому в storage)
			ui_storage.set('sex', document.title.match('героиня') ? 'female' : 'male');
			this.char_sex = document.title.match('героиня') ? ['героиню', 'героине'] : ['героя', 'герою'];
			// ?????
			ui_storage.set('ui_s', '');
			
			// Монстр дня
			$('<div>', {id:"motd"}).insertAfter($('#menu_bar')).hide();
			$('#motd').load('news .game.clearfix:first a', function() {
				ui_data.monstersOfTheDay = $('#motd a').text();
				$('#motd').remove()
			});
		}
	};