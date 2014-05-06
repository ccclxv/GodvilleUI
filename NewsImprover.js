var NewsImprover = {
	monstersOfTheDay: '',
	nodeInserted: function() {
		if (ui_data.isArena) return;
		if (!ui_utils.isAlreadyImproved($('#news'))) {
			ui_utils.addSayPhraseAfterLabel($('#news'), 'Противник', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
		}
		var currentMonster = $('#news .line')[0].style.display != 'none' ? $('#news .l_val').text() : '';
		ui_informer.update('monster of the day', currentMonster != '' && NewsImprover.monstersOfTheDay.match(currentMonster));
		ui_informer.update('monster with capabilities', currentMonster != '' && (currentMonster.match('Врачующий') || currentMonster.match('Дарующий')
			|| currentMonster.match('Зажиточный') || currentMonster.match('Запасливый') || currentMonster.match('Кирпичный') || currentMonster.match('Латающий')
			|| currentMonster.match('Лучезарный') || currentMonster.match('Сияющий') || currentMonster.match('Сюжетный') || currentMonster.match('Линяющий')));
		if (this.isFirstTime) {
			this.news = $('.f_news.line').text() + ui_storage.get('Stats:HP');
			this.lastNews = new Date();
			
			var refresher = setInterval (function() {
				if (ui_storage.get('Option:forcePageRefresh')) {
					if (!NewsImprover.news.match($('.f_news.line').text()) || !ui_improver.news.match(ui_storage.get('Stats:HP'))) {
						NewsImprover.news = $('.f_news.line').text() + ui_storage.get('Stats:HP');
						NewsImprover.lastNews = new Date();
					}
					var now = new Date();
					if (now.getTime() - ui_improver.lastNews.getTime() > 180000) {
						if ($('.t_red').length) {
							GM_log('RED ALERT! HARD RELOADING!');
							location.reload();
						}
						GM_log('Soft reloading');
						$('#d_refresh').click();
					}
				}
			}, 60000);
		}
	},
};