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
		voiceSubmitted: null,
		Shovel: false,
		create: function(){
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
				ui_utils.addSayPhraseAfterLabel($('#news'), 'Противник', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
			}
			this.appendVoiceLinks();
			$('#hk_clan .l_val').width(Math.floor(100 - 100*$('#hk_clan .l_capt').width() / (ui_data.location != "field" ? $('#m_info .block_content') : $('#stats .block_content')).width()) + '%');
			this.shovelPic();
			this.checkButtonsVisibility();
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
		checkButtonsVisibility: function() {
			
			$('#merge_button,.inspect_button,.voice_generator').hide();
			if (ui_storage.get('Stats:Prana') >= 5 && !ui_storage.get('Option:disableVoiceGenerators')) {
				$('.voice_generator,.inspect_button').show();
				if (LootImprover.trophyList.length) 
					$('#merge_button').show();
				if (ui_data.location == "field"){
					if ($('#hk_distance .l_capt').text() == 'Город' || $('.f_news').text().match('дорогу') || $('#news .line')[0].style.display != 'none') 
						$('#hk_distance .voice_generator').hide();
					if ($('#control .p_val').width() == $('#control .p_bar').width() || $('#news .line')[0].style.display != 'none') $('#control .voice_generator')[0].style.display = 'none';
					if ($('#hk_distance .l_capt').text() == 'Город') $('#control .voice_generator')[1].style.display = 'none';
				}
				if ($('#hk_quests_completed .q_name').text().match(/\(выполнено\)/)) $('#hk_quests_completed .voice_generator').hide();
				if ($('#hk_health .p_val').width() == $('#hk_health .p_bar').width()) $('#hk_health .voice_generator').hide();
			}
		},
		nodeInserted: function() {
			this.appendVoiceLinks();
			this.startBarIfMessage();
			this.shovelPic();
			this.checkButtonsVisibility();
		},
		appendVoiceLinks: function() {

			var $box = $('#cntrl');
			if (!ui_utils.isAlreadyImproved($box)) {
				$('.gp_label').addClass('l_capt');
				$('.gp_val').addClass('l_val');
				if (ui_data.location == "dungeon"){
					var isContradictions = $('#map')[0].textContent.match('Противоречия');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Восток', (isContradictions ? 'walk_w' : 'walk_e'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Восток');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Запад', (isContradictions ? 'walk_e' : 'walk_w'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Запад');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Юг', (isContradictions ? 'walk_s' : 'walk_n'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Юг');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'Север', (isContradictions ? 'walk_n' : 'walk_s'), 'Попросить ' + ui_data.char_sex[0] + ' повести команду на Север');
					if ($('#map')[0].textContent.match('Бессилия'))
						$('#actions').hide();
				} else if (ui_data.location != "field") {
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'молись', 'pray', 'Попросить ' + ui_data.char_sex[0] + ' вознести молитву для пополнения праны');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'лечись', 'heal', 'Посоветовать ' + ui_data.char_sex[1] + ' подлечиться подручными средствами');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
				} else {
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'жертвуй', 'sacrifice', 'Послать ' + ui_data.char_sex[1] + ' требование кровавой или золотой жертвы для внушительного пополнения праны');
					ui_utils.addSayPhraseAfterLabel($box, 'Прана', 'молись', 'pray', 'Попросить ' + ui_data.char_sex[0] + ' вознести молитву для пополнения праны');
					$('#voice_submit').click(function () {VoiceImprover.voiceSubmitted = true;});
					ui_utils.addSayPhraseAfterLabel($('#stats'), 'Уровень', 'учись', 'exp', 'Предложить ' + ui_data.char_sex[1] + ' получить порцию опыта');
					ui_utils.addSayPhraseAfterLabel($('#stats'), 'Здоровье', 'лечись', 'heal', 'Посоветовать ' + ui_data.char_sex[1] + ' подлечиться подручными средствами');
					ui_utils.addSayPhraseAfterLabel($('#stats'), 'Золота', 'копай', 'dig', 'Указать ' + ui_data.char_sex[1] + ' место для копания клада или босса');
					ui_utils.addSayPhraseAfterLabel($('#stats'), 'Задание', 'отмени', 'cancel_task', 'Убедить ' + ui_data.char_sex[0] + ' отменить текущее задание');
					ui_utils.addSayPhraseAfterLabel($('#stats'), 'Задание', 'делай', 'do_task', 'Открыть ' + ui_data.char_sex[1] + ' секрет более эффективного выполнения задания');
					if (!$('#hk_distance .voice_generator').length)
						ui_utils.addSayPhraseAfterLabel($box, 'Столбов от столицы', $('#main_wrapper.page_wrapper_5c').length ? '回' : 'дом', 'town', 'Наставить ' + ui_data.char_sex[0] + ' на путь в ближайший город');
				}
				//hide_charge_button
				if (ui_data.location != "field")
					$('#m_control .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
				else
					$('#control .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
			}
		},
		
		startBarIfMessage: function() {
			if (ui_data.location != "field") 
				return;
			var newMessagesCount = $('#diary .d_msg:not(.parsed)').length;
			if (newMessagesCount) {
				if (VoiceImprover.voiceSubmitted) {
					if (newMessagesCount >= 2)
						ui_timeout_bar.start();
					$('#god_phrase').change();
					VoiceImprover.voiceSubmitted = false;
				}
				for (var i = 0; i < newMessagesCount; i++)
					$('#diary .d_msg').eq(i).addClass('parsed');
			}	
		}
};