
var Monitor = {
		create: function() {
		},
		changed: function(data) {
			ui_informer.update('much_gold', ui_storage.get('Stats:Gold') >= (ui_storage.get('Stats:Brick') > 1000 ? 10000 : 3000));
			ui_informer.update('dead', ui_storage.get('Stats:HP') == 0);			
		},
		diaryMessageAdded: function() {	
			this.updateInformers();	
		},
		
		updateInformers: function() {
			var monsterWithCapabilities = false;
			var monstersOfTheDay = false;
			
			// Если герой дерется с монстром
			if (ui_data.location == "field") {
				if ($('#news .line')[0].style.display != 'none') {
					var currentMonster = $('#news .l_val').text();
					var monsterTypes = ['Врачующий', 'Дарующий', 'Зажиточный', 'Запасливый', 'Кирпичный', 'Латающий', 'Лучезарный', 'Сияющий', 'Сюжетный', 'Линяющий'];
					var monstersOfTheDay = ui_data.monstersOfTheDay.match(currentMonster);
					for (var i = 0; i < monsterTypes.length; i++) {
						if (currentMonster.match(monsterTypes[i])) {
							monsterWithCapabilities = true;
							break;
						}
					}
				}
			}
			ui_informer.update('monster of the day', monstersOfTheDay);
			ui_informer.update('monster with capabilities', monsterWithCapabilities);
			ui_informer.update('full prana', $('#control .p_val').width() == $('#control .p_bar').width());
			ui_informer.update('pvp', ui_data.location != "field");
		},
		GroupHP: function(flag) {		
			var seq = 0;
			var $box = flag ? $('#alls .opp_h') : $('#opps .opp_h');
			var GroupCount =	$box.length;
			if (GroupCount > 0)
			{
				for (var i = 0; i < GroupCount; i++) {
					if (parseInt($box[i].textContent)) seq += parseInt($box[i].textContent);					
				}
			}
			return seq; 
		},	
	};
