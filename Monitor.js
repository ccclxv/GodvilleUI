
var Monitor = {
		create: function() {
			if (ui_data.isArena) {
				// Это типа чтобы изменения до загрузки не отображались?
				ui_storage.set('Logger:Hero_HP', ui_stats.get('Hero_HP'));
				ui_storage.set('Logger:Hero_Gold', ui_stats.get('Hero_Gold'));
				ui_storage.set('Logger:Hero_Inv', ui_stats.get('Hero_Inv'));
				ui_storage.set('Logger:Hero_Battery',ui_stats.get('Hero_Battery'));
				ui_storage.set('Logger:Enemy_HP', ui_stats.get('Enemy_HP'));
				ui_storage.set('Logger:Enemy_Gold', ui_stats.get('Enemy_Gold'));
				ui_storage.set('Logger:Enemy_Inv', ui_stats.get('Enemy_Inv'));
				ui_storage.set('Logger:Hero_Alls_HP', ui_stats.get('Hero_Alls_HP'));
			} else if (ui_data.isMap && ui_storage.get('Logger:LocationPrev') == 'Pole') {
				ui_storage.set('Logger:LocationPrev', 'Map');
				ui_storage.set('Logger:Map_HP', ui_stats.get('Map_HP'));
				ui_storage.set('Logger:Map_Gold', ui_stats.get('Map_Gold'));
				ui_storage.set('Logger:Map_Inv', ui_stats.get('Map_Inv'));
				ui_storage.set('Logger:Map_Battery', ui_stats.get('Map_Battery'));
				ui_storage.set('Logger:Map_Alls_HP', ui_stats.get('Map_Alls_HP'));
			} else {
				ui_storage.set('Logger:LocationPrev', 'Pole');
			}
			
		},
		nodeInserted: function() {	
			//	Парсер строки с золотом
			var gold_parser = function(val) {
				return parseInt(val.replace(/[^0-9]/g, '')) || 0;
			};
			
			if (ui_data.isMap || ui_data.isArena) {
				ui_stats.saveElements({
					'label': {
						'#m_info': {
							'Hero_HP': ['Здоровье', parseInt],
							'Hero_Gold': ['Золота', gold_parser],
							'Hero_Inv': ['Инвентарь', parseInt]
						}
					},
					'value': {
						'Map_Battery': parseFloat($('#m_control .acc_val').text()),
						'Map_Alls_HP': this.GroupHP(true)
					}
				});
			}
			if (ui_data.isArena) {
				ui_stats.saveElements({
					'label': {
						'#o_info': {
							'Enemy_Gold': ['Золота', gold_parser],
							'Enemy_Inv': ['Инвентарь', parseInt]
						}
					},
					'value': {
						'Enemy_HP': this.GroupHP(false)				
					}
				});
			}
			if (!ui_data.isArena && !ui_data.isMap) {
				for (var i = 0; i < 7; i++) {
					ui_stats.set('Equip' + (i+1), parseInt($('#eq_' + i + ' .eq_level').text()) || 0);
				}
			}
			ui_stats.saveElements({
				'label': {
					'#stats': {				
						'Gold': ['Золота', gold_parser],
						'Inv': ['Инвентарь', parseInt],
						'HP': ['Здоровье', parseInt],
						'Level': ['Уровень', parseInt],
						'Monster': ['Убито монстров', parseInt],
						'Death': ['Смертей', parseInt],
						'Brick': ['Кирпичей для храма', parseFloat],
						'Wood': ['Дерева для ковчега', parseFloat],
						'Retirement': ['Сбережения', gold_parser]
					},
					'#cntrl':{
						'Prana': ['Прана', parseInt],
					}
				},
				'progress': {		
					'Exp': '#hk_level .p_bar',
					'Task': '#hk_quests_completed .p_bar'
				},
				'value': {
					'Battery': parseFloat ($('#control .acc_val').text())
				}
			});	
			
			this.updateInformers();
			
		},
		updateInformers: function() {
			// наверное проверка на то дерется ли герой с монстром
			if ($('#news .line')[0].style.display != 'none') {
				var currentMonster = $('#news .l_val').text();
				var monsterTypes = ['Врачующий', 'Дарующий', 'Зажиточный', 'Запасливый', 'Кирпичный', 'Латающий', 'Лучезарный', 'Сияющий', 'Сюжетный', 'Линяющий'];
				ui_informer.update('monster of the day', ui_utils.monstersOfTheDay.match(currentMonster));
				for (var i = 0; i < monsterTypes.length; i++) {
					ui_informer.update('monster with capabilities', currentMonster.match(monsterTypes[i]));
				}
			}
			ui_informer.update('full prana', $('#control .p_val').width() == $('#control .p_bar').width());
			ui_informer.update('pvp', ui_data.isArena);
			ui_informer.update('much_gold', ui_stats.get('Gold') >= (ui_stats.get('Brick') > 1000 ? 10000 : 3000));
			ui_informer.update('dead', ui_stats.get('HP') == 0);
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
