// ------------------------
//		MENU BAR
// ------------------------



var ui_menu_bar = {
// appends element in ui dialog
	append: function($append) {
		this.content.append($append);
	},
	isDeveloper: function () {
		return ui_data.developers.indexOf(ui_data.god_name) >= 0;
	},
// toggles ui dialog	
	toggle: function(visible) {
		ui_storage.set('uiMenuVisible', !ui_storage.get('uiMenuVisible'));
		if (ui_storage.get('Option:useBackground'))
			$('#fader').hide();
		this.bar.slideToggle("slow", function() {
			if (ui_storage.get('Option:useBackground') == 'cloud') {
				var color = new Array(2);
				if (ui_storage.get('uiMenuVisible')) {
					color[0] = '241,247,253';
					color[1] = '233,243,253';
				} else {
					color[0] = '253,252,255';
					color[1] = '243,248,253';
				}
				var background = 'linear-gradient(to right, rgba(' + color[0] + ',2) 30%, rgba(' + color[1] + ',0) 100%)';
				$('#fader').css('background', background).show();
			}
		});
	},
// creates ui dialog	
	create: function() {
		this.bar = $('<div id="ui_menu_bar" class="hint_bar" style="padding-bottom: 0.7em; display: none;">' + 
					 '<div class="hint_bar_capt"><b>Godville UI+ (v.' + ui_data.currentVersion + ')</b></div>' + 
					 '<div class="hint_bar_content" style="padding: 0.5em 0.8em;"></div>' + 
					 '<div class="hint_bar_close"></div></div>');
		if (ui_storage.get('uiMenuVisible')) this.bar.show();
		this.content = $('.hint_bar_content', this.bar);
		this.append('<div style="text-align: left;">Если что-то работает не так, как должно, — ' +
						(GM_browser == 'Firefox' ? 'загляните в веб-консоль (Ctrl+Shift+K), а также в консоль ошибок (Ctrl+Shift+J)'
												 : 'обновите страницу и проверьте консоль (Ctrl+Shift+J) на наличие ошибок') +
						'. Если обновление страницы и дымовые сигналы не помогли, напишите об этом в ' + 
						'<a href="skype:angly_cat">скайп</a>,' + 
						' богу <a href="http://godville.net/gods/Бэдлак" title="Откроется в новом окне" target="about:blank">Бэдлак</a>' + 
						' или в <a href="https://godville.net/forums/show_topic/2812" title="Откроется в новой вкладке" target="about:blank">данную тему на форуме</a>.</div>');
		if (this.isDeveloper()) {
			this.append($('<span>dump: </span>'));
			this.append(this.getDumpButton('all'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('options', 'Option'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('stats', 'Stats'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('logger', 'Logger'));
		} else this.append('<br>');
		$('.hint_bar_close', this.bar).append(this.getToggleButton('закрыть'));
		$('#menu_bar').after(this.bar);
		$('#menu_bar ul').append($('<li> | </li>')).append(this.getToggleButton('<strong>ui</strong>'));
		
		
		if (ui_storage.get('isStorage') != true) {
			ui_storage.set('uiMenuVisible', true);
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
			ui_storage.set('isStorage', true);			
		}
	},
// gets toggle button
	getToggleButton: function(text) {
		return $('<a>' + text + '</a>').click(function() {ui_menu_bar.toggle(); return false;});
	},
// gets fump button with a given label and selector
	getDumpButton: function(label, selector) {
		return $('<a class="devel_link">' + label + '</a>').click(function() {ui_storage.dump(selector);});
	}
};
