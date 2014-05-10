var VoiceImprover = {
		voiceSubmitted: null,
		create: function(){
			if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty'))
				$('#voice_submit').attr('disabled', 'disabled');
			$(document).on('change keypress paste focus textInput input', '#god_phrase', function() {
				if (!ui_data.isArena && $(this).val() && !(ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('after_voice') && ui_timeout_bar.elem.width())) {
					$('#voice_submit').removeAttr('disabled');
				} else if (!ui_data.isArena && ui_storage.get('Option:freezeVoiceButton') && ui_storage.get('Option:freezeVoiceButton').match('when_empty')) {
					$('#voice_submit').attr('disabled', 'disabled');
				}
			});
			if (!ui_data.isArena) {
				$('#diary .d_msg').addClass('parsed');	
			}
			
			if (!ui_data.isArena) {
				ui_utils.addSayPhraseAfterLabel($('#news'), 'Противник', 'бей', 'hit', 'Подсказать ' + ui_data.char_sex[1] + ' о возможности нанесения сильного удара вне очереди');
			}
			this.appendVoiceLinks();

		},		
		nodeInserted: function() {
			this.appendVoiceLinks();
			this.startBarIfMessage();
		},
		appendVoiceLinks: function() {

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
				} else if (ui_data.isArena) {
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
				if (ui_data.isArena)
					$('#m_control .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
				else
					$('#control .hch_link')[0].style.visibility = ui_storage.get('Option:hideChargeButton') ? 'hidden' : '';
			}
		},
		
		startBarIfMessage: function() {
			if (ui_data.isArena) 
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