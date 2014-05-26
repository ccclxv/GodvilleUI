var DungeonImprover = {
	create: function(){
		this.diaryMessageAdded();
	},				
	diaryMessageAdded: function() {
		if (ui_data.location == "dungeon"){
			var $box = $('#cntrl .voice_generator');
			var $boxML = $('#map .dml');
			var $boxMC = $('#map .dmc');
			var kRow = $boxML.length;
			var kColumn = $boxML[0].textContent.length;
			//	Гласы направления делаем невидимыми
			for (var i = 0; i < 4; i++){
				$box[i].style.visibility = 'hidden';
			}
			var isJumping = $('#map')[0].textContent.match('Прыгучести'); 

			var MaxMap = 0;	//	Счетчик указателей
			//	Карта возможного клада
			var MapArray = [];
			for (var i = 0; i < kRow; i++){
				MapArray[i] = [];
				for (var j = 0; j < kColumn; j++)
					MapArray[i][j] = ('?!@'.indexOf($boxML[i].textContent[j]) != - 1) ? 0 : -1;
			}

			for (var si = 0; si < kRow; si++){
				//	Ищем где мы находимся
				var j = $boxML[si].textContent.indexOf('@');
				if (j != -1){ 
					//	Проверяем куда можно пройти
					if ($boxML[si-1].textContent[j] != '#' || isJumping && (si == 1 || si != 1 && $boxML[si-2].textContent[j] != '#'))
						$box[0].style.visibility = '';	//	Север
					if ($boxML[si+1].textContent[j] != '#' || isJumping && (si == kRow - 2 || si != kRow - 2 && $boxML[si+2].textContent[j] != '#'))
						$box[1].style.visibility = '';	//	Юг
					if ($boxML[si].textContent[j-1] != '#' || isJumping && $boxML[si].textContent[j-2] != '#')
						$box[2].style.visibility = '';	//	Запад
					if ($boxML[si].textContent[j+1] != '#' || isJumping && $boxML[si].textContent[j+2] != '#')
						$box[3].style.visibility = '';	//	Восток
				}
				//	Ищем указатели
				for (var sj = 0; sj < kColumn; sj++) {
					var Pointer = $boxML[si].textContent[sj];
					if ('←→↓↑↙↘↖↗'.indexOf(Pointer) != - 1) {
						MaxMap++;
						$boxMC[si * kColumn + sj].style.color = 'green';
						for (var ik = 0; ik < kRow; ik++) 
							for (var jk = 0; jk < kColumn; jk++) {
								var istep = parseInt((Math.abs(jk - sj) - 1) / 5);
								var jstep = parseInt((Math.abs(ik - si) - 1) / 5);
								if ('←→'.indexOf(Pointer) != - 1 && ik >= si - istep && ik <= si + istep ||
										Pointer == '↓' && ik >= si + istep ||
										Pointer == '↑' && ik <= si - istep ||
										'↙↘'.indexOf(Pointer) != - 1 && ik > si + istep ||
										'↖↗'.indexOf(Pointer) != - 1 && ik < si - istep)
									if (Pointer == '→' && jk >= sj + jstep ||
											Pointer == '←' && jk <= sj - jstep ||
											'↓↑'.indexOf(Pointer) != - 1 && jk >= sj - jstep && jk <= sj + jstep ||
											'↘↗'.indexOf(Pointer) != - 1 && jk > sj + jstep ||
											'↙↖'.indexOf(Pointer) != - 1 && jk < sj - jstep)
										if (MapArray[ik][jk] >= 0)
											MapArray[ik][jk]++;
							}
					}
					if ('✺☀♨☁❄✵'.indexOf(Pointer) != - 1) {
						MaxMap++;
						$boxMC[si * kColumn + sj].style.color = 'green';
						var TermoMinStep = 0;	//	Минимальное количество шагов до клада
						var TermoMaxStep = 0;	//	Максимальное количество шагов до клада
						switch(Pointer){
							case '✺': TermoMinStep = 1; TermoMaxStep = 2; break;	//	✺ - очень горячо(1-2)
							case '☀': TermoMinStep = 3; TermoMaxStep = 5; break;	//	☀ - горячо(3-5)
							case '♨': TermoMinStep = 6; TermoMaxStep = 9; break;	//	♨ - тепло(6-9)
							case '☁': TermoMinStep = 10; TermoMaxStep = 13; break;	//	☁ - свежо(10-13)
							case '❄': TermoMinStep = 14; TermoMaxStep = 18; break;	//	❄ - холодно(14-18)
							case '✵': TermoMinStep = 19; TermoMaxStep = 0; break;	//	✵ - очень холодно(19)
						}
						//	Функция итерации
						var MapIteration = function (MapTermo, iPointer, jPointer, step) {
							step++;
							for (var iStep = -1; iStep <= 1; iStep++)
								for (var jStep = -1; jStep <= 1; jStep++)
									if (iStep != jStep & (iStep == 0 || jStep == 0)){
										 var iNext = iPointer + iStep;
										 var jNext = jPointer + jStep;
										 if (iNext >= 0 & iNext < kRow & jNext >= 0 & jNext < kColumn)
												if (MapTermo[iNext][jNext] != -1)
													if (MapTermo[iNext][jNext] > step || MapTermo[iNext][jNext] == 0) {
														MapTermo[iNext][jNext] = step;
														MapIteration(MapTermo, iNext, jNext, step);
													}
									}
						};
						//	Временная карта возможных ходов
						var MapTermo = [];
						for (var ik = 0; ik < kRow; ik++) {
							MapTermo[ik] = [];
							for (var jk = 0; jk < kColumn; jk++)
								MapTermo[ik][jk] = ($boxML[ik].textContent[jk] == '#' || ((Math.abs(jk - sj) + Math.abs(ik - si)) > TermoMaxStep & TermoMaxStep != 0)) ? -1 : 0;
						}
						//	Запускаем итерацию
						MapIteration(MapTermo, si, sj, 0);
						//	Метим возможный клад
						for (var ik = ((si - TermoMaxStep) > 0 ? si - TermoMaxStep : 0); ik <= ((si + TermoMaxStep) < kRow ? si + TermoMaxStep : kRow - 1); ik++)
							for (var jk = ((sj - TermoMaxStep) > 0 ? sj - TermoMaxStep : 0); jk <= ((sj + TermoMaxStep) < kColumn ? sj + TermoMaxStep : kColumn - 1); jk++)
								if (MapTermo[ik][jk] >= TermoMinStep & (MapTermo[ik][jk] <= TermoMaxStep || TermoMaxStep == 0))
									if (MapArray[ik][jk] >= 0)
										MapArray[ik][jk]++;
					}
					//	На будущее
					//	↻	↬
				}
			}
			//	Отрсовываем возможный клад 
			if (MaxMap != 0)
				for (var i = 0; i < kRow; i++)
					for (var j = 0; j < kColumn; j++){
						if (MapArray[i][j] == MaxMap)
							$boxMC[i * kColumn + j].style.color = ($boxML[i].textContent[j] == '@') ? 'blue' : 'red';
			}
		}
	},
};
