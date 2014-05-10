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
			this.nodeInserted();
		},		
		nodeInserted : function(){			
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
