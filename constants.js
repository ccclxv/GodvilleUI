/*
 * refactoring
 * Это выделено для облегчения разработки логгера.
 * Потом, возможно перенесу обратно.
 * По крайней мере, пока данные эти используются только логгером, им лучше лежать в нем.
 * 
 */
var constants = {
	"stats":
	{	
		'dungeon':		
			{
					// ID      label     decription   css class  
					'Map_HP': ['hp', 'Здоровье героя', 'hp'],
					'Map_Inv': ['inv', 'Инвентарь', 'inv'],
					'Map_Gold': ['gld', 'Золото', 'gold'],
					'Map_Battery': ['bt', 'Заряды', 'battery'],
					'Map_Alls_HP': ['a:hp', 'Здоровье союзников', 'brick']
			},
			'arena':
			{
				'Hero_HP': ['h:hp', 'Здоровье героя', 'hp'],
				'Enemy_HP': ['e:hp', 'Здоровье соперника', 'death'],
				'Hero_Alls_HP': ['a:hp', 'Здоровье союзников', 'brick'],
				'Hero_Inv': ['h:inv', 'Инвентарь', 'inv'],
				'Hero_Gold': ['h:gld', 'Золото', 'gold'],
				'Hero_Battery': ['h:bt', 'Заряды', 'battery'],
				'Enemy_Gold': ['e:gld', 'Золото', 'monster'],
				'Enemy_Inv': ['e:inv', 'Инвентарь', 'monster']	
			},
			'general':
			{
				'Level': ['lvl', 'Уровень'],
				'HP': ['hp', 'Здоровье'],
				'Prana': ['pr', 'Прана (проценты)'],
				'Battery': ['bt', 'Заряды', 'battery'],
				'Exp': ['exp', 'Опыт (проценты)'],
				'Task': ['tsk', 'Задание (проценты)'],
				'Monster': ['mns', 'Монстры'],
				'Inv': ['inv', 'Инвентарь'],
				'Gold': ['gld', 'Золото', 'gold'],
				'Brick': ['br', 'Кирпичи', 'brick'],
				'Wood': ['wd', 'Дерево'],
				'Retirement': ['rtr', 'Сбережения (тысячи)'],
				'Equip1': ['eq1', 'Оружие', 'equip'],
				'Equip2': ['eq2', 'Щит', 'equip'],
				'Equip3': ['eq3', 'Голова', 'equip'],
				'Equip4': ['eq4', 'Тело', 'equip'],
				'Equip5': ['eq5', 'Руки', 'equip'],
				'Equip6': ['eq6', 'Ноги', 'equip'],
				'Equip7': ['eq7', 'Талисман', 'equip'],
				'Death': ['death', 'Смерти']
			}
	}
}