var LootImprover = {
	moduleProperties: {"locations": "field"},	
	hucksterNews: '',
	create: function(){
		this.nodeInserted();
	},		
	trophyList: [],
	_createInspectButton: function(item_name) {
		return $('<a class="inspect_button" style="margin-left:0.3em" title="Упросить ' + ui_data.char_sex[0] + ' потрясти ' + item_name + '">?</a>')
			.click(function() {
				ui_utils.sayToHero(ui_words.inspectPhrase(item_name));
				return false;
			});
	},

	_createMergeButton: function() {
		return $('<a id="merge_button" title="Уговорить ' + ui_data.char_sex[0] + ' склеить два случайных предмета из инвентаря">Склеить что-нибудь</a>')
			.click(function() {
				var rand = Math.floor(Math.random()*LootImprover.trophyList.length);
				item_first = LootImprover.trophyList[rand];
				item_second = (LootImprover.trophyList[rand + 1] && LootImprover.trophyList[rand][0] == LootImprover.trophyList[rand + 1][0])
							? LootImprover.trophyList[rand + 1]
							: LootImprover.trophyList[rand - 1];
				ui_utils.sayToHero(ui_words.mergePhrase(item_first + ' и ' + item_second));
				return false;
			});
	},
	nodeInserted: function() {
		if (ui_storage.get('Stats:Inv') != ui_storage.getOld('Stats:Inv') || $('#inventory li:not(.improved)').length || $('#inventory li:hidden').length){
			setTimeout(function() {
				$('#inventory li:hidden').remove();
			}, 1000);
			var flags = ['aura box', 'arena box', 'black box', 'boss box', 'friend box', 'invite', 'heal box', 'prana box', 'raidboss box', 'smelter', 'teleporter', 'transformer', 'quest box', 'bylina box'];
			var types = new Array(flags.length);
			for (var i = 0; i < types.length; i++)
				types[i] = false;
			var good_box = false;
			var to_arena_box = false;
			var bold_item = false;

			LootImprover.trophyList = [];

			// Parse items
			$('#inventory ul li:visible').each(function(ind, obj) {
				var $obj = $(obj);
				if ($obj.css('overflow') == 'visible') {
					var item_name = this.textContent.replace(/\?/, '')
													.replace(/\(@\)/, '')
													.replace(/\(\d + шт\)$/, '')
													.replace(/^\s + |\s + $/g, '');
					// color items and add buttons
					if (ui_words.canBeActivated($obj)) {
						var desc = $('div.item_act_link_div *', $obj).attr('title').replace(/ \(.*/g, '');
						var sect = ui_words.canBeActivatedItemType(desc);
						if (sect != -1)
							types[sect] = true;
						else {
							GM_log('Описание предмета ' + item_name + 'отсутствует в базе. Пожалуйста, скопируйте следующее описание предмета разработчику аддона:\n"' + desc + '"');
							if (ui_words.isCategoryItem('good box', item_name))
								good_box = true;
							else if (ui_words.isCategoryItem('to arena box', item_name))
								to_arena_box = true;
						}
					} else if (ui_words.isHealItem($obj)) {
						if (!ui_utils.isAlreadyImproved($obj)) {
							$obj.css('color', 'green');
							$obj.addClass('heal_item');
						}
					} else {
						if (ui_words.isBoldItem($obj))
							bold_item = true;
						else
							LootImprover.trophyList.push(item_name);
						if (!ui_utils.isAlreadyImproved($obj))
							$obj.append(LootImprover._createInspectButton(item_name));
					}
				}
			});
			
			if (!ui_utils.isAlreadyImproved($('#inventory'))) {
				this._createMergeButton().insertAfter($('#inventory ul'));
				$('#inventory ul').css('text-align', 'left');
				$('#inventory').css('text-align', 'center');
			}
			
			LootImprover.trophyList.sort();
			for (var i = LootImprover.trophyList.length - 1; i >= 0; i--) {
				if (!((LootImprover.trophyList[i - 1] && LootImprover.trophyList[i][0] == LootImprover.trophyList[i - 1][0]) || (LootImprover.trophyList[i + 1] && LootImprover.trophyList[i][0] == LootImprover.trophyList[i + 1][0]))) {
					LootImprover.trophyList.splice(i, 1);
				}
			}
			
			for (var i = 0; i < flags.length; i++) {
				ui_informer.update(flags[i], types[i]);
			}
			// Не понял зачем это, пока отключаю так как не отключается информер
			//ui_informer.update(flags[11], types[11] && !bold_item);
			//ui_informer.update('transform!', types[11] && bold_item);
			
			ui_informer.update('good box', good_box);		
			ui_informer.update('smelt!', types[9] && ui_storage.get('Stats:Gold') >= 3000);
			ui_informer.update(flags[9], types[9] && !(ui_storage.get('Stats:Gold') >= 3000));
			ui_informer.update('to arena box', to_arena_box);	
		}
		
		if (ui_data.location == "field" && ui_storage.get('Option:forbiddenInformers') && ui_storage.get('Option:forbiddenInformers').match('SMELT_TIME')) {
			if (ui_storage.get('Stats:Prana') == 100 &&
				$('#hk_distance .l_capt').text() == 'Город' &&
				$('#hk_health .p_val').width() == $('#hk_health .p_bar').width() &&
				 !$('#inventory ul li:not(.heal_item)').filter(function() {return $(this).css('overflow') == 'visible';}).length &&
				ui_storage.get('Stats:Gold') > 3000) {
				if (!LootImprover.hucksterNews.length) {
					LootImprover.hucksterNews = "1" + $('.f_news.line').text();
				} else if (LootImprover.hucksterNews[0] == '1' && !LootImprover.hucksterNews.match($('.f_news.line').text())) {
					LootImprover.hucksterNews = "2" + $('.f_news.line').text();
				} else if (LootImprover.hucksterNews[0] == '2' && !LootImprover.hucksterNews.match($('.f_news.line').text())) {
					LootImprover.hucksterNews = '';
				}
			} else {
				LootImprover.hucksterNews = '';
			}
			ui_informer.update('SMELT TIME', LootImprover.hucksterNews && LootImprover.hucksterNews[0] == "2");
			if (ui_informer.flags['SMELT TIME'] == true && !$('#smelt_time').length) {
				$('#fader').append('<audio loop preload="auto" id="smelt_time" src="arena.ogg"></audio>');
				$('#smelt_time')[0].play();
			} else if (ui_informer.flags['SMELT TIME'] != true && $('#smelt_time').length) {
				$('#smelt_time')[0].pause();
				$('#smelt_time').remove();
			}
		}		
	}
};