var InterfaceImprover = {
	create: function(){
		$('a[href=#]').removeAttr('href');
		ui_storage.set('windowWidth', $(window).width());
		$(window).resize(function() {
			if ($(this).width() != ui_storage.get('windowWidth')) {
				ui_storage.set('windowWidth', $(window).width());
				InterfaceImprover.improveWindowWidthChangeAndNewElementsInsertionRelatedStuff();
			}
		});
		this.nodeInserted();
	},		
	nodeInserted : function(){
		if (ui_storage.get('Option:useBackground') == 'cloud') {
			if (!$('#fader.cloud').length) {
				$('body').css('background-image', 'url(' + GM_getResource("images/background.jpg") + ')');
				var color = new Array(2);
				if (ui_storage.get('uiMenuVisible')) {color[0] = '241,247,253'; color[1] = '233,243,253';}
				else {color[0] = '253,252,255'; color[1] = '243,248,253';}
				var background = 'linear-gradient(to right, rgba(' + color[0] + ',2) 30%, rgba(' + color[1] + ',0) 100%)';
				$('#fader').show().css('background', background).addClass('cloud').removeClass('custom');
			}
		} else if (ui_storage.get('Option:useBackground')) {
			//Mini-hash to check if that is the same background
			var hash = 0, ch, str = ui_storage.get('Option:useBackground');
			for (var i = 0; i < str.length; i++) {
				ch = str.charCodeAt(i);
				hash = ((hash<<5)-hash)+ch;
				hash = hash & hash; // Convert to 32bit integer
			}
			if (hash != this.hash) {
				this.hash = hash;
				$('body').css('background-image', 'url(' + ui_utils.escapeHTML(str) + ')');
				$('#fader').hide().removeClass('cloud').addClass('custom');
			}
		} else if ($('#fader.cloud, #fader.custom').length) {
			$('#fader').show();
			$('body').css('background-image', '');
			var color;
			if (ui_storage.get('ui_s') == 'th_nightly') color = '0,0,0';
			else color = '255,255,255';
			var background = 'linear-gradient(to right, rgba(' + color + ',2) 30%, rgba(' + color + ',0) 100%)';
			$('#fader').css('background', background).removeClass('cloud').removeClass('custom');
		}
		
		if (localStorage.getItem('ui_s') != ui_storage.get('ui_s')) {
			VoiceImprover.Shovel = false;
			ui_storage.set('ui_s', localStorage.getItem('ui_s'));
			if (!ui_storage.get('Option:useBackground')) {
				var color;
				if (ui_storage.get('ui_s') == 'th_nightly') color = '0,0,0';
				else color = '255,255,255';
				var background = 'linear-gradient(to right, rgba(' + color[0] + ',2) 30%, rgba(' + color[1] + ',0) 100%)';
				$('#fader').css('background', background);
			}
		}
		this.improveWindowWidthChangeAndNewElementsInsertionRelatedStuff();
	},
	improveWindowWidthChangeAndNewElementsInsertionRelatedStuff: function() {
		if (ui_storage.get('Option:useBackground')) {
			//background offset
			if (ui_storage.get('Option:useBackground') == 'cloud')
				$('body').css('background-position', ($('#fader').offset().left ? ($('#fader').offset().left - 163.75) : 0) + 'px 0');
			//body widening
			$('body').width($(window).width() < $('#main_wrapper').width() ? $('#main_wrapper').width() : '');
		}
		
		//proper message tabs appearance
		if ($('.frDockCell').length && $('.frDockCell:last').position().top != 0) {
			var row_capacity;
			$('.frDockCell').css('clear', '');
			for (var i = 0; i < $('.frDockCell').length; i++) {
				if ($('.frDockCell').eq(i).position().top != 0) {
					row_capacity = i;
					break;
				}
			}
			for (var i = $('.frDockCell').length%row_capacity; i < $('.frDockCell').length; i+=row_capacity)
				$('.frDockCell').eq(i).css('clear', 'right');
		}
		
		//padding for page settings link
		var padding_bottom = $('.frDockCell:last').length ? Math.floor($('.frDockCell:last').position().top/26.3 + 0.5)*$('.frDockCell').height() : 0;
		padding_bottom = Math.floor(padding_bottom*10)/10 + 40;
		padding_bottom = (padding_bottom < 0) ? 0 : padding_bottom + 'px';
		$('.reset_layout').css('padding-bottom', padding_bottom);
		
		//settings dialod
		if (!ui_utils.isAlreadyImproved($('#facebox'))) {
			$('#facebox').css('left', ($(window).width() - $('#facebox').width())/2 + 'px');
			$('#facebox').css('top', ($(window).height() - $('#facebox').height())/2 + 'px');
		}
	}
};