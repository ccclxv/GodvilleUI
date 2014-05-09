// В данном объекте перемешана логика :
// мониторинга событий
var NewsImprover = {
	create: function() {
	},
	nodeInserted: function() {	
		// наверное проверка на то дерется ли герой с монстром
		if ($('#news .line')[0].style.display != 'none') {
			var currentMonster = $('#news .l_val').text();
			var monstersTypes = ['Врачующий', 'Дарующий', 'Зажиточный', 'Запасливый', 'Кирпичный', 'Латающий', 'Лучезарный', 'Сияющий', 'Сюжетный', 'Линяющий'];
			ui_informer.update('monster of the day', ui_utils.monstersOfTheDay.match(currentMonster));
			for (var i = 0; i < monstersTypes.length; i++) {
				ui_informer.update('monster with capabilities', currentMonster.match(monsterTypes[i]));
			}
		}
		ui_informer.update('full prana', $('#control .p_val').width() == $('#control .p_bar').width());
		ui_informer.update('pvp', ui_data.isArena);
		ui_informer.update('much_gold', ui_stats.setFromLabelCounter('Gold', $box, 'Золота', gold_parser) >= (ui_stats.get('Brick') > 1000 ? 10000 : 3000));
		ui_informer.update('dead', ui_stats.setFromLabelCounter('HP', $box, 'Здоровье') == 0);
	},
};