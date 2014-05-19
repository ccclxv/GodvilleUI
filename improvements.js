
// Перемещает выбранные пользователям ссылки в другой блок
var ButtonRelocator = {
	moduleProperties: {"locations": "field"},
	
	create: function() {
		
		var targets = {"pantheons":"#pantheons_content", "invites":"#invite_friend", "inventory":"#inv_block_content"};
		var target = targets[ui_storage.get('Option:relocateDuelButtonsTarget')];
		var controlWraper = $('<div id="relocated_control_wraper" style="text-align:center;"></div>').insertBefore($(target)).addClass('p_group_sep');
		
		// Перемещает кнопки
		if (ui_storage.get('Option:relocateDuelButtons') != null) {
			var buttons = ui_storage.get('Option:relocateDuelButtons');
			// Арена
			if (buttons.match('arena')) {
				controlWraper.append($('.arena_link_wrap'));
			}
			// Тренировочный бой
			if (buttons.match('chf')) {
				controlWraper.append($('.chf_link_wrap .popover-button'));
			}
		} 			
	},	
	
	changed: function(args) {
		if (args["id"] != "Prana")
			return;
		if (args["value"] >= 50){
			$('#relocated_control_wraper').show();
		} else {
			$('#relocated_control_wraper').hide();
		}
	}
};

// Помещает значок со средним уровнем снаряжения в заголовок блока снаряжения
var EquipmentImprover = {
		
	create: function() {
		$('#equipment .block_title').after($('<div id="equip_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>'));
	},
	
	changed: function(args) {
		if (!args["id"].match("Equip"))
			return;
		
		var s = 0;
		for (var i = 1; i < 8; i++) {
			s += parseInt(ui_storage.get('Stats:Equip' + i));
		}	
		
		$('#equip_badge').text((s / 7).toFixed(1));
	}
};

// Делает ссылки кликабельными, добавляет переход на новую строку по ctrl + пробел
var ChatImprover = {
		
		create: function(){
			// Событие 	keypress не работает в хроме с ctrl
			$(document).on("keydown", '.frInputArea textarea', function(event) {
				if (event.which == 32 && event.ctrlKey) {
					event.preventDefault();
					var pos = this.selectionStart;
					$(this).val($(this).val().substr(0, pos) + '\n' + $(this).val().substr(pos));
					this.setSelectionRange(pos + 1, pos + 1);
				}
			});
		},
		
		chatMessageAdded: function($element) {
			if (!$element.hasClass("improved")) {
				$element.addClass("improved");
				$('#fader').append($('.fr_msg_meta', $element)).append($('.fr_msg_delete', $element));
				var text = $element.text();
				$element.empty();
				$element.append(text.replace(/(https?:\/\/[^ \n\t]*[^\?\!\.\n\t ]+)/g, '<a href="$1" target="_blank" title="Откроется в новой вкладке">$1</a>'));
				$element.append($('#fader .fr_msg_meta')).append($('#fader .fr_msg_delete'));	
			}
		}
};

// Показывает время, в течении которого еще можно воскресить питомца, когда блок свернут.
var PetImprover = {
	moduleProperties: {"locations": "field"},
	
	create: function() {
		$('#pet .block_title').after($('<div id="pet_badge" class="fr_new_badge gc_new_badge gu_new_badge_pos" style="display: block;">0</div>').hide());
	},
	
	diaryMessageAdded: function($element) {
		if (ui_utils.findLabel($('#pet'), 'Статус')[0].style.display != 'none'){
			$('#pet_badge').text(ui_utils.findLabel($('#pet'), 'Статус').siblings('.l_val').text().replace(/[^0-9:]/g, ''));
			if ($('#pet .block_content')[0].style.display == 'none') 
				$('#pet_badge').show(); 
			else 
				$('#pet_badge').hide();
		}
		else if ($('#pet_badge').length == 1) 
				$('#pet_badge').hide();
	}
};
