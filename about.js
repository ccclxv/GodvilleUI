// ------------------------
//		MENU BAR
// ------------------------
/*
Отключаем некритичную функциональность
this.create делает все само. зависимостей больше нет

var ui_menu_bar = {
// appends element in ui dialog
	append: function($append) {
		this.content.append($append);
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
		if (ui_utils.isDeveloper()) {
			this.append($('<span>dump: </span>'));
			this.append(this.getDumpButton('all'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('options', 'Option'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('stats', 'Stats'));
			this.append($('<span>, </span>'));
			this.append(this.getDumpButton('logger', 'Logger'));
		} else this.append('<br>')
		ui_data.checkLastVersion();
		$('.hint_bar_close', this.bar).append(this.getToggleButton('закрыть'));
		$('#menu_bar').after(this.bar);
		$('#menu_bar ul').append($('<li> | </li>')).append(this.getToggleButton('<strong>ui</strong>'));
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
*/