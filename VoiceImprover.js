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
		if (ui_data.location == "field" && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice')) {
			$('#voice_submit').attr('disabled', 'disabled');
			var startDate = new Date();
			var tick = setInterval(function() {
				var finishDate = new Date();
				if (finishDate.getTime() - startDate.getTime() > timeout * 1000) {
					clearInterval(tick);
					if (ui_data.location == "field" && !ui_storage.get('Option:freezeVoiceButton').match('when_empty') || $('#god_phrase').val())
						$('#voice_submit').removeAttr('disabled');
				}
			}, 100);
		}
		$elem.animate({width: 0}, timeout * 1000, 'linear');
	}
};

var VoiceImprover = {
		moduleProperties: {"name": "VoiceImprover"},
		voiceSubmitted: null,
		_isMonster: false,
		_isEnabled: false,
		Shovel: false,
		sayToHero: function(phrase) {
			$('#god_phrase').val(phrase).change();
		},
		_addAfterLabel: function($base_elem, label_name, $elem) {
			ui_utils.findLabel($base_elem, label_name).after($elem.addClass('voice_generator'));
		},
		addSayPhraseAfterLabel: function($base_elem, label_name, btn_name, section, hint) {
			VoiceImprover._addAfterLabel($base_elem, label_name, VoiceImprover.getGenSayButton(btn_name, section, hint));
		},
		getGenSayButton: function(title, section, hint) {
			return $('<a title="' + hint + '">' + title + '</a>').click(function() {
						 VoiceImprover.sayToHero(ui_words.longPhrase(section));
						 ui_words.currentPhrase = "";
						 return false;
					 });
		},
		create: function(){
			ui_timeout_bar.create();
			ui_words.init();
			if (ui_data.location == "field" && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty'))
				$('#voice_submit').attr('disabled', 'disabled');
			$(document).on('change keypress paste focus textInput input', '#god_phrase', function() {
				if (ui_data.location == "field" && $(this).val() && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice') && ui_timeout_bar.elem.width())) {
					$('#voice_submit').removeAttr('disabled');
				} else if (ui_data.location == "field" && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) {
					$('#voice_submit').attr('disabled', 'disabled');
				}
			});
			if (ui_data.location == "field") {
				$('#diary .d_msg').addClass('parsed');	
			}
			
			if (ui_data.location == "field") {
				VoiceImprover.addSayPhraseAfterLabel($('#news'), 'Противник', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
			}
			this.appendVoiceLinks();
			$('#hk_clan .l_val').width(Math.floor(100 - 100*$('#hk_clan .l_capt').width() / (ui_data.location != "field" ? $('#m_info .block_content') : $('#stats .block_content')).width()) + '%');
			this.shovelPic();
		},	
		shovelPic: function() {
			//Shovel pictogramm start
			var digVoice = $('#hk_gold_we .voice_generator');
			//$('#hk_gold_we .l_val').text('где-то 20 монет');
			if ($('#hk_gold_we .l_val').text().length > 16 - 2*$('#main_wrapper.page_wrapper_5c').length) {
				if (!VoiceImprover.Shovel) {
					var path = GM_getResource('images/shovel_');
					var brightness = (ui_storage.get('ui_s') == 'th_nightly') ? 'dark' : 'bright';
					digVoice.empty();
					digVoice.append('<img id="red" src="' + path + 'red_' + brightness + '.gif" style="display: none; cursor: pointer; margin: auto;">' + 
								 '<img id="blue" src="' + path + 'blue_' + brightness + '.gif" style="display: inline; cursor: pointer; margin: auto;">');
					VoiceImprover.Shovel = 'blue';
				}
				if ($('#hk_gold_we .l_val').text().length > 20 - 2*$('#main_wrapper.page_wrapper_5c').length) {
					digVoice.css('margin', "4px -4px 0 0");
				} else {
					digVoice.css('margin', "4px 0 0 3px");
				}
				digVoice.hover(function() {
					if (VoiceImprover.Shovel == 'blue') {
						VoiceImprover.Shovel = 'red';
						$('#red').show();
						$('#blue').hide();
					}
				}, function() {
					if (VoiceImprover.Shovel == 'red') {
						VoiceImprover.Shovel = 'blue';
						$('#red').hide();
						$('#blue').show();
					}
				});
			} else {
				VoiceImprover.Shovel = false;
				digVoice.empty();
				digVoice.append('копай');
				digVoice.css('margin', "");
			}
		//Shovel pictogramm end	
		},
		_maxPBarValue: function(id) {
			return $(id + ' .p_val').width() == $(id + ' .p_bar').width();
		},
		updateVisibility: function() {
			var hide = function($obj, flag) {
				Debug.log($obj[0], flag);
				if (!flag) {
					$obj.show();
				} else {
					$obj.hide();
				}
			};
			// Скрываем в городе, при поиске дороги и бое с монстром
			hide($('#hk_distance .voice_generator'), $('#hk_distance .l_capt').text() == 'Город' || $('.f_news').text().match('дорогу') || this._isMonster);
			// Скрываем при бое с монстром и полной полоске праны
			hide($($('#control .voice_generator')[0]), this._maxPBarValue('#control') || this._isMonster);
			// В городе не жертвуем
			hide($($('#control .voice_generator')[1]), $('#hk_distance .l_capt').text() == 'Город');
			// Скрываем кнопку ускорения, если задание выполнено
			hide($('#hk_quests_completed .voice_generator'), $('#hk_quests_completed .q_name').text().match(/\(выполнено\)/));
			hide($('#merge_button'), !LootImprover.trophyList.length || ui_data.location != "field"); 
			// При полной полоске не лечимся
			hide($('#hk_health .voice_generator'), this._maxPBarValue('#hk_health'));
		},
		changed: function(id, value) {	
			if (id == "Prana") {
				if (value >= 5 && !ui_storage.get('Option:disableVoiceGenerators')){
					this._isEnabled = true;
					$('.voice_generator,.inspect_button').show();					
					this.updateVisibility();				
				} else {
					this._isEnabled = false;
					$('.inspect_button,.voice_generator').hide();
				}
			} 
			if (this._isEnabled && (id == "Gold" || id == "Inv" || id == "HP")){
				this.updateVisibility();			 
			}
		},
		monster: function(name) {
			if (!this._isEnabled)
				return;
			if (ui_data.location == "field"){				
				this._isMoster = (name != "");
				this.updateVisibility();
			}
		},
		diaryMessageAdded: function($element) {
			if (!this._isEnabled)
				return;
			if (ui_data.location == "field") {
				this.updateVisibility();
				// Индикатор кулдауна
				if ($element.hasClass("m_infl")) {
					this.infl = true;
					this._lastDiaryMessage = Date.getTime();
				} else {
					if (this.voiceSubmitted) {
						if (this.infl && (Date.getTime() - this._lastDiaryMessage) <= 20000) {
							ui_timeout_bar.start();
							this.infl = false;
						}
						$('#god_phrase').change();
						this.voiceSubmitted = false;
					}
				}
			}
		},
		appendVoiceLinks: function() {

			var $box = $('#cntrl');
			if (!ui_utils.isAlreadyImproved($box)) {
				$('.gp_label').addClass('l_capt');
				$('.gp_val').addClass('l_val');
				if (ui_data.location == "dungeon"){
					if (ui_storage.get('Option:relocateMap')){
						$('#map').insertBefore($('#m_control')); 
						$('#m_control').appendTo($('#a_right_block'));
						$('#m_control .block_title').text('Пульт');
					}
					var isContradictions = $('#map')[0].textContent.match('Противоречия');
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'Восток', (isContradictions ? 'walk_w' : 'walk_e'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Восток');
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'Запад', (isContradictions ? 'walk_e' : 'walk_w'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Запад');
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'Юг', (isContradictions ? 'walk_s' : 'walk_n'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Юг');
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'Север', (isContradictions ? 'walk_n' : 'walk_s'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Север');
					if ($('#map')[0].textContent.match('Бессилия'))
						$('#actions').hide();
				} else if (ui_data.location != "field") {
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'молись', 'pray', 'Попросить ' + ui_data.char_sex[0] + ' вознести молитву для пополнения праны');
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'лечись', 'heal', 'Посоветовать ' + ui_data.char_sex[1] + ' подлечиться подручными средствами');
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
				} else {
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'жертвуй', 'sacrifice', 'Послать ' + ui_data.char_sex[1] + ' требование кровавой или золотой жертвы для внушительного пополнения праны');
					VoiceImprover.addSayPhraseAfterLabel($box, 'Прана', 'молись', 'pray', 'Попросить ' + ui_data.char_sex[0] + ' вознести молитву для пополнения праны');
					$('#voice_submit').click(function () {VoiceImprover.voiceSubmitted = true;});
					VoiceImprover.addSayPhraseAfterLabel($('#stats'), 'Уровень', 'учись', 'exp', 'Предложить ' + ui_data.char_sex[1] + ' получить порцию опыта');
					VoiceImprover.addSayPhraseAfterLabel($('#stats'), 'Здоровье', 'лечись', 'heal', 'Посоветовать ' + ui_data.char_sex[1] + ' подлечиться подручными средствами');
					VoiceImprover.addSayPhraseAfterLabel($('#stats'), 'Золота', 'копай', 'dig', 'Указать ' + ui_data.char_sex[1] + ' место для копания клада или босса');
					VoiceImprover.addSayPhraseAfterLabel($('#stats'), 'Задание', 'отмени', 'cancel_task', 'Убедить ' + ui_data.char_sex[0] + ' отменить текущее задание');
					VoiceImprover.addSayPhraseAfterLabel($('#stats'), 'Задание', 'делай', 'do_task', 'Открыть ' + ui_data.char_sex[1] + ' секрет более эффективного выполнения задания');
					if (!$('#hk_distance .voice_generator').length)
						VoiceImprover.addSayPhraseAfterLabel($box, 'Столбов от столицы', $('#main_wrapper.page_wrapper_5c').length ? '回' : 'дом', 'town', 'Наставить ' + ui_data.char_sex[0] + ' на путь в ближайший город');
				}
				//hide_charge_button
				if (ui_data.location != "field")
					$('#m_control .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
				else
					$('#control .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
			}
		}
};

var LootImprover = {
		moduleProperties: {"locations": "field", "name": "LootImprover"},	
		hucksterNews: '',
		_nInvItems: 0,
		create: function(){
			this._createMergeButton().insertAfter($('#inventory ul'));
			$('#inventory ul').css('text-align', 'left');
			$('#inventory').css('text-align', 'center');
			this.diaryMessageAdded();
		},		
		trophyList: [],
		_createInspectButton: function(item_name) {
			return $('<a class="inspect_button" style="margin-left:0.3em" title="Упросить ' + ui_data.char_sex[0] + ' потрясти ' + item_name + '">?</a>')
				.click(function() {
					VoiceImprover.sayToHero(ui_words.inspectPhrase(item_name));
					return false;
				});
		},

		_createMergeButton: function() {
			return $('<a id="merge_button" class="voice_generator" style="float: none;" title="Уговорить ' + ui_data.char_sex[0] + ' склеить два случайных предмета из инвентаря">Склеить что-нибудь</a>')
				.click(function() {
					var rand = Math.floor(Math.random()*LootImprover.trophyList.length);
					item_first = LootImprover.trophyList[rand];
					item_second = (LootImprover.trophyList[rand + 1] && LootImprover.trophyList[rand][0] == LootImprover.trophyList[rand + 1][0])
								? LootImprover.trophyList[rand + 1]
								: LootImprover.trophyList[rand - 1];
								VoiceImprover.sayToHero(ui_words.mergePhrase(item_first + ' и ' + item_second));
					return false;
				});
		},
		diaryMessageAdded: function() {
			var nInvItemsCurrent = ui_storage.get('Stats:Inv');
			if ( nInvItemsCurrent != this._nInvItems || $('#inventory li:not(.improved)').length || $('#inventory li:hidden').length){
				this._nInvItems = nInvItemsCurrent;
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
