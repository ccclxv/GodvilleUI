
// ------------------------
//		WORDS
// ------------------------
var ui_words = {
	currentPhrase: "",
// gets words from phrases.js file and splits them into sections
	init: function() {
		this.base = getWords();
		var sects = ['heal', 'pray', 'sacrifice', 'exp', 'dig', 'hit', 'do_task', 'cancel_task', 'die', 'town', 'heil', 'walk_s', 'walk_n', 'walk_w', 'walk_e'];
		for (var i = 0; i < sects.length; i++) {
			var t = sects[i];
			var text = ui_storage.get('phrases_' + t);
			if (text && text != "") {
				this.base['phrases'][t] = text.split("||");
			}
		}
	},
	// Случайный индекс в массиве
	_getRandomIndex: function(arr) {
		return Math.floor(Math.random()*arr.length);
	},
// Случайный элемент массива
	_getRandomItem: function(arr) {
		return arr[ui_words._getRandomIndex(arr)];
	},
// Вытаскивает случайный элемент из массива
	_popRandomItem: function(arr) {
		var ind = ui_words._getRandomIndex(arr);
		var res = arr[ind];
		arr.splice(ind, 1);
		return res;
	},
// single phrase gen
	randomPhrase: function(sect) {
		return this._getRandomItem(this.base['phrases'][sect]);
	},
// main phrase constructor
	longPhrase: function(sect, item_name, len) {
		if (ui_storage.get('phrasesChanged')) {
			ui_words.init();
			ui_storage.set('phrasesChanged', 'false');
		}
		var prefix = this._addHeroName(this._addHeil(''));
		var phrases;
		if (item_name) {
			phrases = [this.randomPhrase(sect) + ' ' + item_name + '!'];
		} else if (ui_storage.get('Option:useShortPhrases')) {
			phrases = [this.randomPhrase(sect)];
		} else {
			phrases = this._longPhrase_recursion(this.base['phrases'][sect].slice(), (len || 100) - prefix.length);
		}
		this.currentPhrase = prefix ? prefix + this._changeFirstLetter(phrases.join(' ')) : phrases.join(' ');
		return this.currentPhrase;
	},
// inspect button phrase gen
	inspectPhrase: function(item_name) {
		return this.longPhrase('inspect_prefix', item_name);
	},
// merge button phrase gen
	mergePhrase: function(items) {
		return this.longPhrase('merge_prefix', items);
	},

// Checkers
	isCategoryItem: function(cat, item_name) {
		return this.base['items'][cat].indexOf(item_name) >= 0;
	},
	
	canBeActivatedItemType: function(desc) {
		return ['Этот предмет наделяет героя случайной аурой',
				'Данный предмет можно активировать только во время дуэли',
				'Этот предмет может случайным образом повлиять на героя',
				'Этот предмет ищет для героя босса',	//'Этот предмет помогает герою найти монстра-босса',	//Предыдущая версия
				'Этот предмет заводит герою случайного друга из числа активных героев',
				'Активация инвайта увеличит счетчик доступных приглашений',
				'Этот предмет полностью восстанавливает здоровье героя',
				'Этот предмет добавляет заряд в прано-аккумулятор',
				'Этот предмет на несколько минут отправляет героя в поиск соратников для битвы с ископаемым боссом',
				'Этот предмет убивает атакующего героя монстра, либо пытается выплавить из золота героя золотой кирпич',
				'Этот предмет телепортирует героя в случайный город',
				'Этот предмет превращает один или несколько жирных предметов из инвентаря героя в золотые кирпичи',
				'Этот предмет отправляет героя в мини-квест',
				'Этот предмет сочиняет о герое былину',
				].indexOf(desc);
	},
	
	isHealItem: function($obj) {
		return $obj.css("font-style") == "italic";
	},

	canBeActivated: function($obj) {
		return $obj.text().match(/\(@\)/);
	},
	
	isBoldItem: function($obj) {
		return $obj.css("font-weight") == 700;
	},

	_changeFirstLetter: function(text) {
		return text.charAt(0).toLowerCase() + text.slice(1);
	},

	_addHeroName: function(text) {
		if (!ui_storage.get('Option:useHeroName')) return text;
		return ui_data.char_name + ', ' + this._changeFirstLetter(text);
	},

	_addHeil: function(text) {
		if (!ui_storage.get('Option:useHeil')) return text;
		return this._getRandomItem(this.base['phrases']['heil']) + ', ' + this._changeFirstLetter(text);
	},

// Private (или типа того)
	_longPhrase_recursion: function(source, len) {
		while (source.length) {
			var next = this._popRandomItem(source);
			var remainder = len - next.length - 2; // 2 for ', '
			if (remainder > 0) {
				return [next].concat(this._longPhrase_recursion(source, remainder));
			}
		}
		return [];
	}
};