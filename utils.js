// ------------------------
//		UTILS
// ------------------------
var ui_utils = {
	isDeveloper: function () {
		return ui_data.developers.indexOf(ui_data.god_name) >= 0;
	},
// base phrase say algorythm
	sayToHero: function(phrase) {
		$('#god_phrase').val(phrase).change();
	},
// checks if $elem already improved
	isAlreadyImproved: function($elem) {
		if ($elem.hasClass('improved')) return true;
		$elem.addClass('improved');
		return false;
	},
// finds a label with given name
	findLabel: function($base_elem, label_name) {
		return $('.l_capt', $base_elem).filter(function(index) {
			return $(this).text() == label_name;
		});
	},
// finds a label with given name and appends given elem after it
	addAfterLabel: function($base_elem, label_name, $elem) {
		ui_utils.findLabel($base_elem, label_name).after($elem.addClass('voice_generator'));
	},
// generic voice generator
	getGenSayButton: function(title, section, hint) {
		return $('<a title="' + hint + '">' + title + '</a>').click(function() {
					 ui_utils.sayToHero(ui_words.longPhrase(section));
					 ui_words.currentPhrase = "";
					 return false;
				 });
	},
// Хелпер объединяет addAfterLabel и getGenSayButton
// + берет фразы из words['phrases']
	addSayPhraseAfterLabel: function($base_elem, label_name, btn_name, section, hint) {
		ui_utils.addAfterLabel($base_elem, label_name, ui_utils.getGenSayButton(btn_name, section, hint));
	},
// Случайный индекс в массиве
	getRandomIndex: function(arr) {
		return Math.floor(Math.random()*arr.length);
	},
// Случайный элемент массива
	getRandomItem: function(arr) {
		return arr[ui_utils.getRandomIndex(arr)];
	},
// Вытаскивает случайный элемент из массива
	popRandomItem: function(arr) {
		var ind = ui_utils.getRandomIndex(arr);
		var res = arr[ind];
		arr.splice(ind, 1);
		return res;
	},
// Escapes HTML symbols
	escapeHTML: function(str) {
		return str.replace(/[&"<>]/g, function (m) {({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[m]});
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
// gets diff with a value
	diff: function(id, value) {
		var diff = null;
		var old = this.get(id);
		if (old != null) {
			diff = value - old;
		}
		return diff;
	},
// stores value and gets diff with old
	set_with_diff: function(id, value) {
		var diff = this.diff(id, value);
		this.set(id, value);
		return diff;
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

// ------------------------
// Stats storage
// ------------------------
var ui_stats = {
	get: function(key) {
		return ui_storage.get('Stats:' + key);
	},
	
	set: function(key, value) {
		return ui_storage.set('Stats:' + key, value);
	},
	
	setFromProgressBar: function(id, $elem) {	
		var value = $elem.attr('title').replace(/[^0-9]/g, '');
		return this.set(id, value);
	},
	
	setFromLabelCounter: function(id, $container, label, parser) {
		parser = parser || parseInt;
		var $label = ui_utils.findLabel($container, label);
		var $field = $label.siblings('.l_val');
		var value = parser($field.text());
		if (id == 'Brick' || id == 'Wood') return this.set(id, Math.floor(value*10 + 0.5))
		else return this.set(id, value);
	}
};

var ui_data = {
		currentVersion: '0.4.31.0',
		developers: ['Neniu', 'Ryoko', 'Опытный Кролик', 'Бэдлак', 'Ui Developer', 'Шоп'],
	// base variables initialization
		init: function() {
			this.isArena = ($('#m_info').length > 0);
			this.isBoss = ($('#o_info .line').length > 0);
			this.isMap = ($('#map .dml').length > 0);
			if (this.isArena) {
				this.god_name = $('#m_info .l_val')[0].textContent.replace('庙','').replace('畜','').replace('舟','');
				this.char_name = $('#m_info .l_val')[1].textContent;
			} else {
				var $user = $('#stats.block div a[href^="/gods/"]')[0];
				this.god_name = decodeURI($user.href.replace(/http(s)?:\/\/godville\.net\/gods\//, ''));
				this.char_name = $user.textContent;
			}
			ui_storage.set('sex', document.title.match('героиня') ? 'female' : 'male');
			this.char_sex = document.title.match('героиня') ? ['героиню', 'героине'] : ['героя', 'герою'];
			ui_storage.set('ui_s', '');
			
			$('<div>', {id:"motd"}).insertAfter($('#menu_bar')).hide();
			$('#motd').load('news .game.clearfix:first a', function() {
				ui_improver.monstersOfTheDay = $('#motd a').text();
				$('#motd').remove()
			});
		},

	// gets add-on's page and check it's version
		checkLastVersion: function() {
			$.get('forums/show_topic/2812', function(response) {
				
				if (ui_utils.isDeveloper() || ui_storage.get('Option:forbiddenInformers') != null && !ui_storage.get('Option:forbiddenInformers').match('new_posts')) {
					var posts = parseInt(response.match(/Сообщений\: \d+/)[0].match(/\d+/));
					if (posts > ui_storage.get('posts')) {
						ui_storage.set('posts', posts);
						ui_informer.update('new posts', false);
						ui_informer.update('new posts', true);
					}
				}	
				var data, timer = 0;
				this.lastVersion = response.match(/Текущая версия[^<]*<[^<]*<[^<]*/)[0].replace(/[^>]*>[^>]*>/, '');
				var r = new RegExp('<[^>]*>Ссылка на скачивание Godville UI\\+ для ' + GM_browser);
				var link = response.match(r)[0].replace(/^([^\"]*\")/, '').replace(/(".*)$/, '');
				if (this.lastVersion == '') {
					data = '<span>Не удалось узнать номер последней версии. Попробуйте обновить страницу.</span>';
				} else if (this.lastVersion > ui_data.currentVersion) {
					data = 'Найдена новая версия аддона (<b>' + ui_utils.escapeHTML(this.lastVersion) + '</b>). Обновление доступно по <a href="' +
					link + '" title="Откроется в новой вкладке" target="about:blank">этой ссылке</a>.';
					$('<div id="version_check" class="hint_bar" style="position: fixed; top: 40px; left: 0; right: 0; z-index: 301; display: none;"><div class="hint_bar_capt"><b>Godville UI+ version check</b></div><div class="hint_bar_content" style="padding: 0.5em;"></div></div>').insertAfter($('#menu_bar'));
					$('#version_check').css('box-shadow', '2px 2px 15px #' + ((localStorage.getItem('ui_s') == 'th_nightly') ? 'ffffff' : '000000'));
					$('#version_check .hint_bar_content').append(data);
					$('#version_check').fadeToggle(1500, function() {
						setTimeout(function() {
							$('#version_check').fadeToggle(1500, function() {
								$('#version_check').remove();
							});
						}, 5000);
					});
					timer = 8000;
				} else if (this.lastVersion < ui_data.currentVersion) {
					var phrases = ['И пусть весь мир подождет',
									 'На шаг впереди',
									 'Пробуешь все новенькое',
									 'Никому не говори об этом',
									 'Салют ловцам багов',
									 'Ты избранный',
									 'Глюки, глюки повсюду',
									 'Это не баг, а фича',
									 'Откуда ты взял эту',
									 'H̴͜͟҉̸͔̠͚̖̟̾ͦ́̓ę͈̹͈̓̑̿͗ͥͯͩ͝͏͘͢ ̶͔̠ͦ͘̕͜c͇̠̮̃҉̵̕ö͚͖͙̺̘̖́͑ͪ̅͑̉̕҉̷m̨̟̣̺̓ͤͤe̦̭̳̪̠͔̺̕͞͏̧͡s͈̝͗͋̏͆̄̈́͝͏҉'
									]
					var mark = ['.', '.', '?', '...', '!', '.', '!', '.', '?', '.']
					var random = Math.floor(Math.random()*(9 + (GM_browser == 'Firefox')));
					data = 'Публичная версия: <b>' + ui_utils.escapeHTML(this.lastVersion) + '</b>. ' + phrases[random] + ', ' + ui_data.god_name + mark[random];
				} else {
					data = 'У вас установлена последняя версия.';
				}	
				setTimeout(function() {
					ui_informer.update('new version', false);
					ui_informer.update('new version', timer != 0); //timer == 0 as false, timer != 0 as true
					ui_menu_bar.append('<div>' + data + '</div>');
				}, timer);
			})
			.error(function() {
				ui_menu_bar.append('<span>Не удалось узнать номер последней версии. Попробуйте обновить страницу.</span>');
			});
		}
	};