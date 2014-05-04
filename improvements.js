// ------------------------------------
//	Improvements !!
// ------------------------------------
// -------- Hero Loot -----------------
/*
 * Refactoring:
 * Запихнул я эту красоту в модуль. Добавлены методы:
 * create(), nodeInserted(); 
 * Цель - разбить модуль на части (в умных книжках называется "декомпозиция").
 * Но пока нет тестинга со стороны пользователей, не трогаю.
 */

// Main button creater
var ui_improver = {
	inventoryChanged: true,
	improveInProcess: true,
	Shovel: false,
	isFirstTime: true,
	voiceSubmitted: false,
	monstersOfTheDay: '',
	trophyList: [],
	hucksterNews: '',
	create: function() {
		// пока пусть будет, хотя наверное можно убрать
		setTimeout(this.improve(),0);
	},
	nodeInserted : function() {
		setTimeout(this.improve(),0);     
	},
	improve: function() {
		this.improveInProcess = true;
		try {
			ui_informer.update('pvp', ui_data.isArena);
			if (!ui_storage.get('isStorage')) throw('No users data!');
			this.improveStats();
			this.improvePet();
			this.improveLoot();
			this.improveVoiceDialog();
			this.improveNews();
			this.improveEquip();
			this.improvePantheons();
			this.improveDiary();
			this.improveMap();
			this.improveInterface();
			this.improveChat();
			this.improveWindowWidthChangeAndNewElementsInsertionRelatedStuff();
			this.checkButtonsVisibility();
			this.isFirstTime = false;
		} catch (error) {
			GM_log(error);
			if (GM_browser == "Firefox")
				GM_log('^happened at ' + error.lineNumber + ' line of ' + error.fileName);
		} finally {
			ui_improver.improveInProcess = false;
		}
	},

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
				var rand = Math.floor(Math.random()*ui_improver.trophyList.length);
				item_first = ui_improver.trophyList[rand];
				item_second = (ui_improver.trophyList[rand + 1] && ui_improver.trophyList[rand][0] == ui_improver.trophyList[rand + 1][0])
							? ui_improver.trophyList[rand + 1]
							: ui_improver.trophyList[rand - 1];
				ui_utils.sayToHero(ui_words.mergePhrase(item_first + ' и ' + item_second));
				return false;
			});
	},

	/*_createWalkButton: function(walk) {
		return $('<a	id="' + walk + '_button" title="Попросить ' + ui_data.char_sex[0] + ' повести команду на ' + walk + '">?</a>')
			.click(function() {
				ui_utils.sayToHero(ui_words.walkPhrase(walk));
				return false;
			});
	},*/
	
	improveLoot: function() {
		if (ui_data.isArena) return;
		if (this.inventoryChanged) {
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

			ui_improver.trophyList = [];

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
							ui_improver.trophyList.push(item_name);
						if (!ui_utils.isAlreadyImproved($obj))
							$obj.append(ui_improver._createInspectButton(item_name));
					}
				}
			});
			
			if (!ui_utils.isAlreadyImproved($('#inventory'))) {
				this._createMergeButton().insertAfter($('#inventory ul'));
				$('#inventory ul').css('text-align', 'left');
				$('#inventory').css('text-align', 'center');
			}
			
			ui_improver.trophyList.sort();
			for (var i = ui_improver.trophyList.length - 1; i >= 0; i--) {
				if (!((ui_improver.trophyList[i - 1] && ui_improver.trophyList[i][0] == ui_improver.trophyList[i - 1][0]) || (ui_improver.trophyList[i + 1] && ui_improver.trophyList[i][0] == ui_improver.trophyList[i + 1][0]))) {
					ui_improver.trophyList.splice(i, 1);
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
		
			this.inventoryChanged = false;
		}
		
		if (!ui_data.isArena && ui_storage.get('Option:forbiddenInformers') && ui_storage.get('Option:forbiddenInformers').match('SMELT_TIME')) {
			if (ui_storage.get('Stats:Prana') == 100 &&
				$('#hk_distance .l_capt').text() == 'Город' &&
				$('#hk_health .p_val').width() == $('#hk_health .p_bar').width() &&
				 !$('#inventory ul li:not(.heal_item)').filter(function() {return $(this).css('overflow') == 'visible';}).length &&
				ui_storage.get('Stats:Gold') > 3000) {
				if (!ui_improver.hucksterNews.length) {
					ui_improver.hucksterNews = "1" + $('.f_news.line').text();
				} else if (ui_improver.hucksterNews[0] == '1' && !ui_improver.hucksterNews.match($('.f_news.line').text())) {
					ui_improver.hucksterNews = "2" + $('.f_news.line').text();
				} else if (ui_improver.hucksterNews[0] == '2' && !ui_improver.hucksterNews.match($('.f_news.line').text())) {
					ui_improver.hucksterNews = '';
				}
			} else {
				ui_improver.hucksterNews = '';
			}
			ui_informer.update('SMELT TIME', ui_improver.hucksterNews && ui_improver.hucksterNews[0] == "2");
			if (ui_informer.flags['SMELT TIME'] == true && !$('#smelt_time').length) {
				$('#fader').append('<audio loop preload="auto" id="smelt_time" src="arena.ogg"></audio>');
				$('#smelt_time')[0].play();
			} else if (ui_informer.flags['SMELT TIME'] != true && $('#smelt_time').length) {
				$('#smelt_time')[0].pause();
				$('#smelt_time').remove();
			}
		}
	},

	improveVoiceDialog: function() {
		// Add links and show timeout bar after saying
		if (this.isFirstTime) {
			if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty'))
				$('#voice_submit').attr('disabled', 'disabled');
			$(document).on('change keypress paste focus textInput input', '#god_phrase', function() {
				if (!ui_data.isArena && $(this).val() && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice') && ui_timeout_bar.elem.width())) {
					$('#voice_submit').removeAttr('disabled');
				} else if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) {
					$('#voice_submit').attr('disabled', 'disabled');
				}
			});
		}
		var $box = $('#cntrl');
		if (!ui_utils.isAlreadyImproved($box)) {
			$('.gp_label').addClass('l_capt');
			$('.gp_val').addClass('l_val');
			if (ui_data.isMap){
				var isContradictions = $('#map')[0].textContent.match('Противоречия');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Восток', (isContradictions ? 'walk_w' : 'walk_e'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Восток');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Запад', (isContradictions ? 'walk_e' : 'walk_w'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Запад');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Юг', (isContradictions ? 'walk_s' : 'walk_n'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Юг');
				ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Север', (isContradictions ? 'walk_n' : 'walk_s'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Север');
				if ($('#map')[0].textContent.match('Бессилия'))
					$('#actions').hide();
			} else {
				if (ui_data.isArena) {
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'молись', 'pray', 'Попросить ' + ui_data.char_sex[0] + ' вознести молитву для пополнения праны');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'лечись', 'heal', 'Посоветовать ' + ui_data.char_sex[1] + ' подлечиться подручными средствами');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
				} else {
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'жертвуй', 'sacrifice', 'Послать ' + ui_data.char_sex[1] + ' требование кровавой или золотой жертвы для внушительного пополнения праны');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'молись', 'pray', 'Попросить ' + ui_data.char_sex[0] + ' вознести молитву для пополнения праны');
					$('#voice_submit').click(function () {ui_improver.voiceSubmitted = true;});
				}
			}
			//hide_charge_button
			if (ui_data.isArena)
				$('#m_control .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
			else
				$('#control .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
		}
		
		// Save stats
		//ui_informer.update('pr = 100', ui_stats.setFromLabelCounter('Prana', $box, 'Прана') == 100);
		ui_stats.setFromLabelCounter('Prana', $box, 'Прана');
		ui_informer.update('full prana', $('#control .p_val').width() == $('#control .p_bar').width());
	},

// ----------- Вести с полей ----------------
	improveNews: function() {
		if (ui_data.isArena) return;
		if (!ui_utils.isAlreadyImproved($('#news'))) {
			ui_utils.addSayPhraseAfterLabel($('#news'), 'Противник', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
		}
		var currentMonster = $('#news .line')[0].style.display != 'none' ? $('#news .l_val').text() : '';
		ui_informer.update('monster of the day', currentMonster != '' && ui_improver.monstersOfTheDay.match(currentMonster));
		ui_informer.update('monster with capabilities', currentMonster != '' && (currentMonster.match('Врачующий') || currentMonster.match('Дарующий')
			|| currentMonster.match('Зажиточный') || currentMonster.match('Запасливый') || currentMonster.match('Кирпичный') || currentMonster.match('Латающий')
			|| currentMonster.match('Лучезарный') || currentMonster.match('Сияющий') || currentMonster.match('Сюжетный') || currentMonster.match('Линяющий')));
		if (this.isFirstTime) {
			this.news = $('.f_news.line').text() + ui_storage.get('Stats:HP');
			this.lastNews = new Date();
			
			var refresher = setInterval (function() {
				if (ui_storage.get('Option:forcePageRefresh')) {
					if (!ui_improver.news.match($('.f_news.line').text()) || !ui_improver.news.match(ui_storage.get('Stats:HP'))) {
						ui_improver.news = $('.f_news.line').text() + ui_storage.get('Stats:HP');
						ui_improver.lastNews = new Date();
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

// ---------- Map --------------
	improveMap: function() {
		if (ui_data.isMap){
			var $box = $('#cntrl .voice_generator');
			var $boxM = $('#map .dml');
			var kRow = $boxM.length;
			var kColumn = $boxM[0].textContent.length;
			//	Для клада
			//	NW - NE			N
			//	 |	 |		W		E
			//	SW - SE			S
			
			//	Гласы направления делаем невидимыми
			for (var i = 0; i < 4; i++){
				$box[i].style.visibility = 'hidden';
			}
			var isJumping = $('#map')[0].textContent.match('Прыгучести'); 
			//	Отрсовываем возможный клад 
			var MaxMap = 1;
			var MapArray = [];
			for (var i = 0; i < kRow; i++){
				MapArray[i] = [];
				for (var j = 0; j < kColumn; j++)
					MapArray[i][j] = ($boxM[i].textContent[j] == '?' || $boxM[i].textContent[j] == '!') ? 1 : 0;
			}

			for (var i = 0; i < kRow; i++){
				//	Ищем где мы находимся
				var j = $boxM[i].textContent.indexOf('@');
				if (j != -1){ 
					//	Проверяем куда можно пройти
					if ($boxM[i-1].textContent[j] != '#' || isJumping && (i == 1 || i != 1 && $boxM[i-2].textContent[j] != '#'))
						$box[0].style.visibility = '';	//	Север
					if ($boxM[i+1].textContent[j] != '#' || isJumping && (i == kRow - 2 || i != kRow - 2 && $boxM[i+2].textContent[j] != '#'))
						$box[1].style.visibility = '';	//	Юг
					if ($boxM[i].textContent[j-1] != '#' || isJumping && $boxM[i].textContent[j-2] != '#')
						$box[2].style.visibility = '';	//	Запад
					if ($boxM[i].textContent[j+1] != '#' || isJumping && $boxM[i].textContent[j+2] != '#')
						$box[3].style.visibility = '';	//	Восток
				}
				j = $boxM[i].textContent.indexOf('→');	//	E
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var jk = j + 1; jk < kColumn; jk++){
						var istep = parseInt((Math.abs(jk - j) - 1)/5);
						for (var ik = (i < istep ? 0 : i - istep); ik <= (i + istep < kRow ? i + istep : kRow - 1); ik++){
							MapArray[ik][jk] = MapArray[ik][jk] + 1;
							if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
						}
					}
				}
				j = $boxM[i].textContent.indexOf('←');	//	W
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var jk = 0; jk < j - 1; jk++){
						var istep = parseInt((Math.abs(jk - j) - 1)/5);
						for (var ik = (i < istep ? 0 : i - istep); ik <= (i + istep < kRow ? i + istep : kRow - 1); ik++){
							MapArray[ik][jk] = MapArray[ik][jk] + 1;
							if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↓');	//	S
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = i + 1; ik < kRow; ik++){
						var jstep = parseInt((Math.abs(ik - i) - 1)/5);
						for (var jk = (j < jstep ? 0 : j - jstep); jk <= (j + jstep < kColumn ? j + jstep : kColumn - 1); jk++){
							MapArray[ik][jk] = MapArray[ik][jk] + 1;
							if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↑');	//	N
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = 0; ik < i - 1; ik++){
						var jstep = parseInt((Math.abs(ik - i) - 1)/5);
						for (var jk = (j < jstep ? 0 : j - jstep); jk <= (j + jstep < kColumn ? j + jstep : kColumn - 1); jk++){
							MapArray[ik][jk] = MapArray[ik][jk] + 1;
							if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
						}
					}
				}

				j = $boxM[i].textContent.indexOf('↘');	//	SE
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = i + 1; ik < kRow; ik++){
						for (var jk = j +1; jk < kColumn; jk++){
							var istep = parseInt((Math.abs(jk - j) - 1)/5);
							var jstep = parseInt((Math.abs(ik - i) - 1)/5);
							if (ik > i + istep)
								if (jk > j + jstep){
									MapArray[ik][jk] = MapArray[ik][jk] + 1;
									if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
								}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↙');	//	SW
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = i + 1; ik < kRow; ik++){
						for (var jk = 0; jk < j - 1; jk++){
							var istep = parseInt((Math.abs(jk - j) - 1)/5);
							var jstep = parseInt((Math.abs(ik - i) - 1)/5);
							if (ik > i + istep)
								if (jk < j - jstep){
									MapArray[ik][jk] = MapArray[ik][jk] + 1;
									if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
								}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↖');	//	NW
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = 0; ik < i - 1; ik++){
						for (var jk = 0; jk < j - 1; jk++){
							var istep = parseInt((Math.abs(jk - j) - 1)/5);
							var jstep = parseInt((Math.abs(ik - i) - 1)/5);
							if (ik < i - istep)
								if (jk < j - jstep){
									MapArray[ik][jk] = MapArray[ik][jk] + 1;
									if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
								}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↗');	//	NE
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = 0; ik < i - 1; ik++){
						for (var jk = j + 1; jk < kColumn; jk++){
							var istep = parseInt((Math.abs(jk - j) - 1)/5);
							var jstep = parseInt((Math.abs(ik - i) - 1)/5);
							if (ik < i - istep)
								if (jk > j + jstep){
									MapArray[ik][jk] = MapArray[ik][jk] + 1;
									if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
								}
						}
					}
				}

				//	✺ - очень горячо(1-2);
				//	☀ - горячо(3-5);
				//	♨ - тепло(6-9);
				//	☁ - свежо(10-13);
				//	❄ - холодно(14-18)
				//	✵ - очень холодно(19);
				var step = 0;
				j = $boxM[i].textContent.indexOf('✺');	//	очень горячо
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 2; 
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('☀');	//	горячо
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 5;
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('♨');	//	тепло
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 9;
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('☁');	//	свежо
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 13;
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('❄');	//	холодно
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 18;
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
					//for (var ik = 0; ik < kRow; ik++){
						//for (var jk = 0; jk < kColumn; jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
			}
			//	Отрсовываем возможный клад 
			if (MaxMap != 1)
				for (var i = 0; i < kRow; i++)
					for (var j = 0; j < kColumn; j++){
						if ($boxM[i].textContent[j] == '?' || $boxM[i].textContent[j] == '!')
							if (MapArray[i][j] == MaxMap)
								$('#map .dmc')[i * kColumn + j].style.color = 'red';
			}
		}
	},

// ---------- Stats --------------
	improveStats: function() {
		//	Парсер строки с золотом
		var gold_parser = function(val) {
			return parseInt(val.replace(/[^0-9]/g, '')) || 0;
		};

		if (this.isFirstTime)
			$('#hk_clan .l_val').width(Math.floor(100 - 100*$('#hk_clan .l_capt').width() / (ui_data.isArena ? $('#m_info .block_content') : $('#stats .block_content')).width()) + '%');
		if (ui_data.isMap) {
			ui_stats.setFromLabelCounter('Map_HP', $('#m_info'), 'Здоровье');
			ui_stats.setFromLabelCounter('Map_Gold', $('#m_info'), 'Золота', gold_parser);
			ui_stats.setFromLabelCounter('Map_Inv', $('#m_info'), 'Инвентарь');
			ui_stats.set('Map_Battery',$('#m_control .acc_val').text(), parseFloat);
			ui_stats.set('Map_Alls_HP', this.GroupHP(true));
			if (ui_storage.get('Logger:LocationPrev') == 'Pole') {
				ui_storage.set('Logger:LocationPrev', 'Map');
				ui_storage.set('Logger:Map_HP', ui_stats.get('Map_HP'));
				ui_storage.set('Logger:Map_Gold', ui_stats.get('Map_Gold'));
				ui_storage.set('Logger:Map_Inv', ui_stats.get('Map_Inv'));
				ui_storage.set('Logger:Map_Battery',ui_stats.get('Map_Battery'));
				ui_storage.set('Logger:Map_Alls_HP', ui_stats.get('Map_Alls_HP'));
			}
			return;
		}
		if (ui_data.isArena) {
			ui_stats.setFromLabelCounter('Hero_HP', $('#m_info'), 'Здоровье');
			ui_stats.setFromLabelCounter('Hero_Gold', $('#m_info'), 'Золота', gold_parser);
			ui_stats.setFromLabelCounter('Hero_Inv', $('#m_info'), 'Инвентарь');
			ui_stats.set('Hero_Battery',$('#m_control .acc_val').text(), parseFloat);
			ui_stats.setFromLabelCounter('Enemy_Gold', $('#o_info'), 'Золота', gold_parser);
			ui_stats.setFromLabelCounter('Enemy_Inv', $('#o_info'), 'Инвентарь');
			ui_stats.set('Hero_Alls_HP', this.GroupHP(true));
			ui_stats.set('Enemy_HP', this.GroupHP(false));
			if (this.isFirstTime) {
				ui_storage.set('Logger:Hero_HP', ui_stats.get('Hero_HP'));
				ui_storage.set('Logger:Hero_Gold', ui_stats.get('Hero_Gold'));
				ui_storage.set('Logger:Hero_Inv', ui_stats.get('Hero_Inv'));
				ui_storage.set('Logger:Hero_Battery',ui_stats.get('Hero_Battery'));
				ui_storage.set('Logger:Enemy_HP', ui_stats.get('Enemy_HP'));
				ui_storage.set('Logger:Enemy_Gold', ui_stats.get('Enemy_Gold'));
				ui_storage.set('Logger:Enemy_Inv', ui_stats.get('Enemy_Inv'));
				ui_storage.set('Logger:Hero_Alls_HP', ui_stats.get('Hero_Alls_HP'));
			}
			return;
		}
		if (ui_storage.get('Logger:LocationPrev') != 'Pole')
			ui_storage.set('Logger:LocationPrev', 'Pole');
		var $box = $('#stats');
		if (!ui_utils.isAlreadyImproved($('#stats'))) {
			// Add links
			ui_utils.addSayPhraseAfterLabel($box, 'Уровень', 'учись', 'exp', 'Предложить ' + ui_data.char_sex[1] + ' получить порцию опыта');
			ui_utils.addSayPhraseAfterLabel($box, 'Здоровье', 'лечись', 'heal', 'Посоветовать ' + ui_data.char_sex[1] + ' подлечиться подручными средствами');
			ui_utils.addSayPhraseAfterLabel($box, 'Золота', 'копай', 'dig', 'Указать ' + ui_data.char_sex[1] + ' место для копания клада или босса');
			ui_utils.addSayPhraseAfterLabel($box, 'Задание', 'отмени', 'cancel_task', 'Убедить ' + ui_data.char_sex[0] + ' отменить текущее задание');
			ui_utils.addSayPhraseAfterLabel($box, 'Задание', 'делай', 'do_task', 'Открыть ' + ui_data.char_sex[1] + ' секрет более эффективного выполнения задания');
			//ui_utils.addSayPhraseAfterLabel($box, 'Смертей', 'умри', 'die');	
		}
		if (!$('#hk_distance .voice_generator').length)
			ui_utils.addSayPhraseAfterLabel($box, 'Столбов от столицы', $('#main_wrapper.page_wrapper_5c').length ? '回' : 'дом', 'town', 'Наставить ' + ui_data.char_sex[0] + ' на путь в ближайший город');

		ui_stats.setFromProgressBar('Exp', $('#hk_level .p_bar'));
		ui_stats.setFromProgressBar('Task', $('#hk_quests_completed .p_bar'));
		ui_stats.setFromLabelCounter('Level', $box, 'Уровень');
		ui_stats.setFromLabelCounter('Monster', $box, 'Убито монстров');
		ui_stats.setFromLabelCounter('Death', $box, 'Смертей');
		ui_stats.setFromLabelCounter('Brick', $box, 'Кирпичей для храма', parseFloat);
		ui_stats.setFromLabelCounter('Wood', $box, 'Дерева для ковчега', parseFloat);
		ui_stats.setFromLabelCounter('Retirement', $box, 'Сбережения', gold_parser);
		ui_stats.set('Battery',$('#control .acc_val').text(), parseFloat);
		if (ui_storage.get('Stats:Inv') != ui_stats.setFromLabelCounter('Inv', $box, 'Инвентарь') || $('#inventory li:not(.improved)').length || $('#inventory li:hidden').length)
			this.inventoryChanged = true;
		ui_informer.update('much_gold', ui_stats.setFromLabelCounter('Gold', $box, 'Золота', gold_parser) >= (ui_stats.get('Brick') > 1000 ? 10000 : 3000));
		ui_informer.update('dead', ui_stats.setFromLabelCounter('HP', $box, 'Здоровье') == 0);

		//Shovel pictogramm start
		var digVoice = $('#hk_gold_we .voice_generator');
		//$('#hk_gold_we .l_val').text('где-то 20 монет');
		if ($('#hk_gold_we .l_val').text().length > 16 - 2*$('#main_wrapper.page_wrapper_5c').length) {
			if (!ui_improver.Shovel) {
				var path = GM_getResource('images/shovel_');
				var brightness = (ui_storage.get('ui_s') == 'th_nightly') ? 'dark' : 'bright';
				digVoice.empty();
				digVoice.append('<img id="red" src="' + path + 'red_' + brightness + '.gif" style="display: none; cursor: pointer; margin: auto;">' + 
							 '<img id="blue" src="' + path + 'blue_' + brightness + '.gif" style="display: inline; cursor: pointer; margin: auto;">');
				ui_improver.Shovel = 'blue';
			}
			if ($('#hk_gold_we .l_val').text().length > 20 - 2*$('#main_wrapper.page_wrapper_5c').length) {
				digVoice.css('margin', "4px -4px 0 0");
			} else {
				digVoice.css('margin', "4px 0 0 3px");
			}
			digVoice.hover(function() {
				if (ui_improver.Shovel == 'blue') {
					ui_improver.Shovel = 'red';
					$('#red').show();
					$('#blue').hide();
				}
			}, function() {
				if (ui_improver.Shovel == 'red') {
					ui_improver.Shovel = 'blue';
					$('#red').hide();
					$('#blue').show();
				}
			});
		} else {
			ui_improver.Shovel = false;
			digVoice.empty();
			digVoice.append('копай');
			digVoice.css('margin', "");
		}
	//Shovel pictogramm end
	},
// ---------- Pet --------------
	improvePet: function() {
		if (ui_data.isArena) return;
		if (ui_utils.findLabel($('#pet'), 'Статус')[0].style.display!='none'){
			if (!ui_utils.isAlreadyImproved($('#pet'))){
				$('#pet .block_title').after($('<div id="pet_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>'))
			} 
			$('#pet_badge').text(ui_utils.findLabel($('#pet'), 'Статус').siblings('.l_val').text().replace(/[^0-9:]/g, ''));
			if ($('#pet .block_content')[0].style.display == 'none') 
				$('#pet_badge').show(); 
			else 
				$('#pet_badge').hide();
		}
		else
			if ($('#pet_badge').length == 1) 
				$('#pet_badge').hide();
	},
// ---------- Equipment --------------
	improveEquip: function() {
		if (ui_data.isArena) return;
		// Save stats
		var seq = 0;
		for (var i = 7; i >= 1;) {
			ui_stats.set('Equip' + i--, parseInt($('#eq_' + i + ' .eq_level').text()));
			seq += parseInt($('#eq_' + i + ' .eq_level').text()) || 0;
		}
		if (!ui_utils.isAlreadyImproved($('#equipment'))){
			$('#equipment .block_title').after($('<div id="equip_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>'))
		}
		$('#equip_badge').text((seq / 7).toFixed(1));
	},
// ---------- Group HP --------------
	GroupHP: function(flag) {		
		var seq = 0;
		var $box = flag ? $('#alls .opp_h') : $('#opps .opp_h');
		var GroupCount =	$box.length;
		if (GroupCount > 0)
		{
			for (var i = 0; i < GroupCount;) {
				if (parseInt($box[i].textContent)) seq += parseInt($box[i].textContent);
				i++;
			}
		}
		return seq; 
	},
// ---------- Pantheons --------------	
	improvePantheons: function() {
		if (ui_data.isArena) 
			return;
		
		var controlWraper = null;
		var targets = {"pantheons":"#pantheons_content","invites":"#invite_friend","inventory":"#inv_block_content"};
		var target = targets[ui_storage.get('Option:relocateDuelButtonsTarget')];//"#pantheons_content";
		
		// Создает по требованию обертку
		var getControlWraper = function() {
			if (controlWraper == null) {
				controlWraper = $('#relocated_control_wraper');
				if (controlWraper.length == 0) {
					controlWraper = $('<div id="relocated_control_wraper" style="text-align:center;"></div>').insertBefore($(target)).addClass('p_group_sep');
				}
			}
			return controlWraper;
		};
		
		// Перемещает кнопки
		if (ui_storage.get('Option:relocateDuelButtons') != null) {
			var buttons = ui_storage.get('Option:relocateDuelButtons');
			// Arena
			if (buttons.match('arena') && $('.arena_link_wrap').css('display') != "none") {
				getControlWraper().append($('.arena_link_wrap'));
			}
			// Training
			if (buttons.match('chf')) {
				getControlWraper().append($('.chf_link_wrap .div_link'));
			}
		} 
	},
// ---------- Diary --------------		
	improveDiary: function() {
		if (ui_data.isArena) return;
		
		if (this.isFirstTime) {
			$('#diary .d_msg').addClass('parsed');
		} else {
			var newMessagesCount = $('#diary .d_msg:not(.parsed)').length;
			if (newMessagesCount) {
				if (ui_improver.voiceSubmitted) {
					if (newMessagesCount >= 2)
						ui_timeout_bar.start();
					$('#god_phrase').change();
					ui_improver.voiceSubmitted = false;
				}
				for (var i = 0; i < newMessagesCount; i++)
					$('#diary .d_msg').eq(i).addClass('parsed');
			}
		}
	},
	
	improveInterface : function(){
		if (this.isFirstTime) {
			$('a[href=#]').removeAttr('href');
			ui_storage.set('windowWidth', $(window).width());
			$(window).resize(function() {
				if ($(this).width() != ui_storage.get('windowWidth')) {
					ui_storage.set('windowWidth', $(window).width());
					ui_improver.improveWindowWidthChangeAndNewElementsInsertionRelatedStuff();
				}
			});
		}

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
			ui_improver.Shovel = false;
			ui_storage.set('ui_s', localStorage.getItem('ui_s'));
			if (!ui_storage.get('Option:useBackground')) {
				var color;
				if (ui_storage.get('ui_s') == 'th_nightly') color = '0,0,0';
				else color = '255,255,255';
				var background = 'linear-gradient(to right, rgba(' + color[0] + ',2) 30%, rgba(' + color[1] + ',0) 100%)';
				$('#fader').css('background', background);
			}
		}
	},
	
	improveChat: function() {
		for (var i = 1; i < $('.fr_msg_l:not(.improved)').length; i++) {
			$cur_msg = $('.fr_msg_l:not(.improved)').eq(i);
			$('#fader').append($('.fr_msg_meta', $cur_msg)).append($('.fr_msg_delete', $cur_msg));
			var text = $cur_msg.text();
			$cur_msg.empty();
			$cur_msg.append(text.replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t ]+)/g, '<a href="$1" target="_blank" title="Откроется в новой вкладке">$1</a>'));
			$cur_msg.append($('#fader .fr_msg_meta')).append($('#fader .fr_msg_delete'));
		}
		$('.fr_msg_l:not(.improved)').addClass('improved');
		
		$('.frInputArea textarea:not(.improved)').keypress(function(event) {
			if (event.which == 32 && event.ctrlKey) {
				event.preventDefault();
				var pos = this.selectionStart;
				$(this).val($(this).val().substr(0, pos) + '\n' + $(this).val().substr(pos));
				this.setSelectionRange(pos + 1, pos + 1);
			}
		}).addClass('improved');

	},

	checkButtonsVisibility: function() {
		
		if (ui_storage.get('Stats:Prana') >= 50){
			$('#relocated_control_wraper').show();
		} else {
			$('#relocated_control_wraper').hide();
		}
		
		$('#merge_button,.inspect_button,.voice_generator').hide();
		if (ui_storage.get('Stats:Prana') >= 5 && !ui_storage.get('Option:disableVoiceGenerators')) {
			$('.voice_generator,.inspect_button').show();
			if (ui_improver.trophyList.length) $('#merge_button').show();
			//if ($('.f_news').text() != 'Возвращается к заданию...')
			if (!ui_data.isArena){
				if ($('#hk_distance .l_capt').text() == 'Город' || $('.f_news').text().match('дорогу') || $('#news .line')[0].style.display != 'none') 
					$('#hk_distance .voice_generator').hide();
				//if (ui_storage.get('Stats:Prana') == 100) $('#control .voice_generator').hide();
				if ($('#control .p_val').width() == $('#control .p_bar').width() || $('#news .line')[0].style.display != 'none') $('#control .voice_generator')[0].style.display = 'none';
				if ($('#hk_distance .l_capt').text() == 'Город') $('#control .voice_generator')[1].style.display = 'none';
			}
			if ($('#hk_quests_completed .q_name').text().match(/\(выполнено\)/)) $('#hk_quests_completed .voice_generator').hide();
			if ($('#hk_health .p_val').width() == $('#hk_health .p_bar').width()) $('#hk_health .voice_generator').hide();
		}
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
	},
		
	add_css: function () {
		if ($('#ui_css').length == 0) {
			GM_addGlobalStyleURL('godville-ui.css', 'ui_css');
		}
	}
};
