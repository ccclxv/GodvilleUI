
// надо еще сделать проверку, чтобы все время не заменять
var ButtonRelocator = {
	moduleProperties: {"locations": "field"},
	create: function(){
		this.nodeInserted();
	},	
	nodeInserted: function() {
		
		var controlWraper = null;
		var targets = {"pantheons":"#pantheons_content", "invites":"#invite_friend", "inventory":"#inv_block_content"};
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
	moduleProperties: {"locations": "field"},	
	create: function(){
		this.nodeInserted();
	},		
	nodeInserted: function() {
		// Save stats
		var seq = 0;
		for (var i = 1; i < 8; i++) {
			seq += parseInt(ui_storage.get('Stats:Equip' + i));
		}
		
		if (!ui_utils.isAlreadyImproved($('#equipment'))){
			$('#equipment .block_title').after($('<div id="equip_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>'));
		}
		$('#equip_badge').text((seq / 7).toFixed(1));
	}
};

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
	moduleProperties: {"locations": "field"},
	create: function() {
		this.nodeInserted();
	},
	nodeInserted: function() {
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
		else if ($('#pet_badge').length == 1) 
				$('#pet_badge').hide();
	},
};
