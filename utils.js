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
				this.set('uiMenuVisible', true);
				$('<div id="first_run" class="hint_bar" style="position: fixed; top: 40px; left: 0; right: 0; z-index: 301; display: none; padding-bottom: 0.7em;">'+
					'<div class="hint_bar_capt"><b>Godville UI+ first run message</b></div>'+
					'<div class="hint_bar_content" style="padding: 0 1em;"></div>'+
					'<div class="hint_bar_close"><a onclick="$(\'#first_run\').fadeToggle(function() {$(\'#first_run\').remove();}); return false;">закрыть</a></div></div>'
					 ).insertAfter($('#menu_bar'));
				var fem = ui_storage.get('sex') == 'female' ? true : false;
				var data = 'Приветствую ' +
							 'бог' + (fem ? 'иню' : 'а') + ', использующ' + (fem ? 'ую' : 'его') + ' аддон расширения интерфейса <b>Godville UI+</b>.<br>'+
							 '<div style="text-align: justify; margin: 0.2em 0 0.3em;">&emsp;<b>Опции</b> находятся в <b>профиле</b> героя, на вкладке <b>Настройки UI</b>. '+
							 'Информация о наличии новых версий аддона отображается в&nbsp;виде <i>всплывающего сообщения</i> (как это) и дублируется' +
							 ' в <i>диалоговом окне</i> (под этим всплывающим сообщением), '+
							 'которое можно открыть/закрыть нажатием на кнопку <b>ui</b>, что чуть правее кнопки <i>выход</i> в верхнем меню.<br style="margin-bottom: 0.5em;">' +
							 '&emsp;Информер можно убрать щелчком мыши по нему (при этом заголовок перестанет мигать) до следующего срабатывания условий информера. Например, Если у вас было <i>больше трех тысяч золота</i> и вы нажали на информер, то он появится в следующий раз только после того, как золота станет меньше, а потом опять больше трех тысяч.</div>' + 
							 'Отображение <b>всех</b> информеров по-умолчанию <b>включено</b>. Возможно, вы захотите отключить информер <b>ВРЕМЕНИ ПЛАВКИ ПРЕДМЕТОВ</b>. Я предупредил.';								 
				$('#first_run').css('box-shadow', '2px 2px 15px #' + ((localStorage.getItem('ui_s') == 'th_nightly') ? 'ffffff' : '000000'));
				$('#first_run .hint_bar_content').append(data);
				$('#first_run').fadeToggle(1500);				
			} catch(error) {
				GM_log(error);
				if (GM_browser == "Firefox")
					GM_log('^happened at ' + error.lineNumber + ' line of ' + error.fileName);
			}
		}
		this.set('isStorage', true);
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