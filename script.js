
var logger = null;
// wait for stats  
var starter = setInterval(function() {
	// 	#m_info = #stats in duel mode (left block containing hero info)
	if ($('#m_info').length || $('#stats').length) {
		
		// stop waiting
		var start = new Date();
		clearInterval(starter);
		
		// init objects
		ui_data.init();
		ui_storage.clearStorage();
		ui_improver.add_css();  // why here?
		ui_words.init();
		logger = new Logger();
		ui_timeout_bar.create();
		ui_menu_bar.create();
		ui_informer.init();
		
		// improve interface
		ui_improver.improve();
		
		// check for update ???
		if (ui_utils.isDeveloper()) {
			setInterval(function() {
				$('#fader').load('forums/show/2 td', function() {
					var posts = parseInt($('#fader .entry-title:contains("Аддоны для Firefox и Chrome - дополнения в интерфейс игры")').parent().next().text());
					if (posts > ui_storage.get('posts')) {
						ui_storage.set('posts', posts);
						ui_informer.update('new posts', false);
						ui_informer.update('new posts', true);
					}
					$('#fader').empty();
				});
			}, 300000);
		}
		
		var finish = new Date();		
		GM_log('Godville UI+ initialized in ' + (finish.getTime() - start.getTime()) + ' msec.');
	}
}, 200);

// Update improvements when new node inserted (to diary?)
$(document).bind("DOMNodeInserted", function() {
	if(!ui_improver.improveInProcess){
		ui_improver.improveInProcess = true;
		setTimeout(function() {
			ui_improver.improve();
			if (ui_data.isArena) {
				logger.update();
			}
		}, 0);
	}
});

// Update logger when user moves the mouse pointer
$('html').mousemove(function() {
	if (!logger)
		return;
	if (!logger.updating) {
		logger.updating = true;
		if (!ui_data.isArena)
			logger.update();
		setTimeout(function() {
			logger.updating = false;
		}, 500);
	}
});
