 

// ------------------------
//		TIMEOUT BAR
// ------------------------
var ui_timeout_bar = {
// creates timeout bar element
	create: function() {
		this.elem = $('<div id="timeout_bar" />');
		$('#menu_bar').after(this.elem);
	},
// starts timeout bar
	start: function(timeout) {
		timeout = timeout || 20;
		$elem = this.elem;
		$elem.stop();
		$elem.css('width', '100%');
		if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice')) {
			$('#voice_submit').attr('disabled', 'disabled');
			var startDate = new Date();
			var tick = setInterval(function() {
				var finishDate = new Date();
				if (finishDate.getTime() - startDate.getTime() > timeout * 1000) {
					clearInterval(tick);
					if (!ui_data.isArena && !ui_storage.get('Option:freezeVoiceButton').match('when_empty') || $('#god_phrase').val())
						$('#voice_submit').removeAttr('disabled');
				}
			}, 100);
		}
		$elem.animate({width: 0}, timeout * 1000, 'linear');
	}
};