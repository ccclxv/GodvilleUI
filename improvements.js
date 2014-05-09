// ------------------------------------
//	Improvements !!
// ------------------------------------
// -------- Hero Loot -----------------
/*
 * Refactoring:
 * Запихнул я эту красоту в модуль. Добавлены методы:
 * create(), nodeInserted(); 
 */
// надо еще сделать проверку, чтобы все время не заменять

var ButtonRelocator = {
	create: function(){
		this.nodeInserted();
	},	
	nodeInserted: function() {
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
			// Арена
			if (buttons.match('arena') && $('.arena_link_wrap').css('display') != "none") {
				getControlWraper().append($('.arena_link_wrap'));
			}
			// Тренировочный бой
			if (buttons.match('chf')) {
				getControlWraper().append($('.chf_link_wrap .popover-button'));
			}
		} 
		if (ui_storage.get('Stats:Prana') >= 50){
			$('#relocated_control_wraper').show();
		} else {
			$('#relocated_control_wraper').hide();
		}
	}
	
};

var EquipmentImprover = {
	create: function(){
		this.nodeInserted();
	},		
	nodeInserted: function() {
		if (ui_data.isArena) return;
		// Save stats
		var seq = 0;
		for (var i = 7; i >= 1;) {
			ui_stats.set('Equip' + i--, parseInt($('#eq_' + i + ' .eq_level').text()));
			seq += parseInt($('#eq_' + i + ' .eq_level').text()) || 0;
		}
		if (!ui_utils.isAlreadyImproved($('#equipment'))){
			$('#equipment .block_title').after($('<div id="equip_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>'));
		}
		$('#equip_badge').text((seq / 7).toFixed(1));
	}
};

// Может его в интерфейс сунуть?
var ChatImprover = {
		create: function(){
			this.nodeInserted();
		},		
		nodeInserted: function() {
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
		}
};

var PetImprover = {
	create: function() {
		this.nodeInserted();
	},
	nodeInserted: function() {
		if (ui_data.isArena) return;
		if (ui_utils.findLabel($('#pet'), 'Статус')[0].style.display!='none'){
			if (!ui_utils.isAlreadyImproved($('#pet'))){
				$('#pet .block_title').after($('<div id="pet_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>'));
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
};


// Оно вообще вне контекста логгера используется?
var StatsImprover = {
		Shovel: false,
		create: function(){
			$('#hk_clan .l_val').width(Math.floor(100 - 100*$('#hk_clan .l_capt').width() / (ui_data.isArena ? $('#m_info .block_content') : $('#stats .block_content')).width()) + '%');			
			if (ui_data.isArena) {
				ui_storage.set('Logger:Hero_HP', ui_stats.get('Hero_HP'));
				ui_storage.set('Logger:Hero_Gold', ui_stats.get('Hero_Gold'));
				ui_storage.set('Logger:Hero_Inv', ui_stats.get('Hero_Inv'));
				ui_storage.set('Logger:Hero_Battery',ui_stats.get('Hero_Battery'));
				ui_storage.set('Logger:Enemy_HP', ui_stats.get('Enemy_HP'));
				ui_storage.set('Logger:Enemy_Gold', ui_stats.get('Enemy_Gold'));
				ui_storage.set('Logger:Enemy_Inv', ui_stats.get('Enemy_Inv'));
				ui_storage.set('Logger:Hero_Alls_HP', ui_stats.get('Hero_Alls_HP'));
			}
			this.nodeInserted();
		},		
		nodeInserted : function(){
			//	Парсер строки с золотом
			var gold_parser = function(val) {
				return parseInt(val.replace(/[^0-9]/g, '')) || 0;
			};
				
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
				LootImprover.inventoryChanged = true;
			ui_informer.update('much_gold', ui_stats.setFromLabelCounter('Gold', $box, 'Золота', gold_parser) >= (ui_stats.get('Brick') > 1000 ? 10000 : 3000));

			//Shovel pictogramm start
			var digVoice = $('#hk_gold_we .voice_generator');
			//$('#hk_gold_we .l_val').text('где-то 20 монет');
			if ($('#hk_gold_we .l_val').text().length > 16 - 2*$('#main_wrapper.page_wrapper_5c').length) {
				if (!StatsImprover.Shovel) {
					var path = GM_getResource('images/shovel_');
					var brightness = (ui_storage.get('ui_s') == 'th_nightly') ? 'dark' : 'bright';
					digVoice.empty();
					digVoice.append('<img id="red" src="' + path + 'red_' + brightness + '.gif" style="display: none; cursor: pointer; margin: auto;">' + 
								 '<img id="blue" src="' + path + 'blue_' + brightness + '.gif" style="display: inline; cursor: pointer; margin: auto;">');
					StatsImprover.Shovel = 'blue';
				}
				if ($('#hk_gold_we .l_val').text().length > 20 - 2*$('#main_wrapper.page_wrapper_5c').length) {
					digVoice.css('margin', "4px -4px 0 0");
				} else {
					digVoice.css('margin', "4px 0 0 3px");
				}
				digVoice.hover(function() {
					if (StatsImprover.Shovel == 'blue') {
						StatsImprover.Shovel = 'red';
						$('#red').show();
						$('#blue').hide();
					}
				}, function() {
					if (StatsImprover.Shovel == 'red') {
						StatsImprover.Shovel = 'blue';
						$('#red').hide();
						$('#blue').show();
					}
				});
			} else {
				StatsImprover.Shovel = false;
				digVoice.empty();
				digVoice.append('копай');
				digVoice.css('margin', "");
			}
		//Shovel pictogramm end			
		},
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
};


// ChkVsblt - разнести по соответствующим модулям
var ui_improver = {

	create: function() {
		this.nodeInserted();
	},
	nodeInserted : function() {
		this.checkButtonsVisibility();
	},

	checkButtonsVisibility: function() {
		
		$('#merge_button,.inspect_button,.voice_generator').hide();
		if (ui_storage.get('Stats:Prana') >= 5 && !ui_storage.get('Option:disableVoiceGenerators')) {
			$('.voice_generator,.inspect_button').show();
			if (LootImprover.trophyList.length) 
				$('#merge_button').show();
			if (!ui_data.isArena){
				if ($('#hk_distance .l_capt').text() == 'Город' || $('.f_news').text().match('дорогу') || $('#news .line')[0].style.display != 'none') 
					$('#hk_distance .voice_generator').hide();
				if ($('#control .p_val').width() == $('#control .p_bar').width() || $('#news .line')[0].style.display != 'none') $('#control .voice_generator')[0].style.display = 'none';
				if ($('#hk_distance .l_capt').text() == 'Город') $('#control .voice_generator')[1].style.display = 'none';
			}
			if ($('#hk_quests_completed .q_name').text().match(/\(выполнено\)/)) $('#hk_quests_completed .voice_generator').hide();
			if ($('#hk_health .p_val').width() == $('#hk_health .p_bar').width()) $('#hk_health .voice_generator').hide();
		}
	},
	

		
};
