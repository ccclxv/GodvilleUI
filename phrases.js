function getWords() {
	 return {
	// Этот параметр показывает текущую версию файла
	// Меняется только при _структурных_ изменениях.
	// Например: добавление, удаление, переименование секций.
	// Добавление фраз -- НЕ структурное изменение
	"version" : 7,

	// Фразы
	"phrases" : {
		// Ключевые корни: лечис, зелёнка
		"heal" : [
			"Лечись прям сейчас!", "Лечись зелёнкой!", "Жуй лечебные корешки!", "Выдели время на лечение!",
			"Намажь раны зелёнкой!", "Вылечись до 100%", "Позови медбрата, тебе нужно лечение!",
			"Зови врачей, у них есть зелёнка!", "Ищи лечебные корешки!", "Пей зелёнку!", "Лечись корешками!",
			"Зелёнку пей, на голову лей!", "Выдави из корешков зелёнку!", "Наложи бинты с зелёнкой!", "Капай зелёнку в нос!",
			"Зелёнка и бинты — товарищи твои.", "Лечи раны зелеными корешками!", "Головка вава, пей зеленку!"
		],

		// Ключевые корни: молись,
		"pray" : [
			"Молись!", "Помолись!", "Молись, преклони колени!", "Нужна молитва.",
			"Нужна прана, молись!", "Помолишься - получишь десерт!", "Помолись, кто, если не ты?", "Поклоняйся, я требую поклонения!",
			"Молитвы пополняют прану!"
		],

		// Ключевые корни: жертва
		"sacrifice" : [
			"Мне нужна жертва!", "Жертвуй!", "Пожертвуй кого-нибудь или что-нибудь!",
			"Жертву давай!", "Жертвуй монстра!", "Пожертвуй ненужное!", "Пожертвуй хоть что-нибудь!", "Пожертвуешь - возьму на ручки."
		],

		// Ключевые корни: опыт
		"exp" : [
			"Набирайся опыта!",	"Учись!", "Набирайся знаний.", "Нужен опыт!", "Давай, ищи опыт."
		],

		// Ключевые корни: золото клад
		"dig" : [
			"Копай клад.", "Ищи клад.", "Бери лопату и копай.", "Нужен клад.", "Ищи клад, копай лопатой!",
			"Копай золото вот тут, под деревом!", "Выкопай клад!", "Нужно золото, копай!", "Лопату в руки и копать!",
			"Ищи золотую руду!", "Копай метро!"
		],

		// Работает: бей, ударь, ударов
		// Не работает: бить, удар
		"hit" : [
			"Бей противника два раза!", "Ударь два раза.", "Ударь без очереди!", "Бей с оттягом!",
			"Ударь от всей души!", "Бей, не жалей!", "Ударь противника прямо в глаз!",
			"Бей по слабым местам!", "Не жалей ударов!", "Избей противника до беспамятства!", "Не жди очереди, бей!"
		],

		"do_task" : [
			"Выполняй задание!", "Делай квест!", "Делай задание.", "Выполни квест.",
			"Квест в первую очередь!"
		],

		"cancel_task" : [
			"Отмени задание!", "Останови квест!"
		],

		"die" : [
			"Умри!"
		],

		"town" : [
			"Возвращайся в город!", "Иди обратно в город.", "Иди назад.", "Обратно в город!"
		],	

		// Ключевые корни:	Север
		"walk_s" : [
			"Север!"
		],

		// Ключевые корни:	Юг
		"walk_n" : [
			"Юг!"
		],

		// Ключевые корни: Запад
		"walk_w" : [
			"Запад!"
		],

		// Ключевые корни:	Восток
		"walk_e" : [
			"Восток!"
		],

		// Начало для фраз-вопросиков
		"inspect_prefix" : [
			"Исследуй", "Осмотри", "Рассмотри"
		],
		
		"merge_prefix" : [
			"Склей", "Собери", "Скрафти", "Соедини"
		],
		
		// Префиксы во имя
		"heil" : [
			"Во имя богов", "Ради меня", "Во исполнение моей воли"
		]
	},

	"items" : {
		// Сами за себя говорящие категории активируемых предметов
		"good box" : [
			"бездвоздмездный подарок", "коробок с ленточкой", "мешок Андед-Мороза", "подарок судьбы", "подарочный сертификат", "юбилейный золотой"
		],
				
		"to arena box" : [
			"золотой билет", "перчатку вызова"
		]
	}
};
};
