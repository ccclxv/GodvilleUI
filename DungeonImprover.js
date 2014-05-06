var DungeonImprover = {
	create: function(){
		this.nodeInserted();
	},				
	nodeInserted: function() {
		if (ui_data.isMap){
			var $box = $('#cntrl .voice_generator');
			var $boxM = $('#map .dml');
			var kRow = $boxM.length;
			var kColumn = $boxM[0].textContent.length;
			//	Для клада
			//	NW - NE			N
			//	 |	 |		W		E
			//	SW - SE			S
			
			//	Гласы направления делаем невидимыми
			for (var i = 0; i < 4; i++){
				$box[i].style.visibility = 'hidden';
			}
			var isJumping = $('#map')[0].textContent.match('Прыгучести'); 
			//	Отрсовываем возможный клад 
			var MaxMap = 1;
			var MapArray = [];
			for (var i = 0; i < kRow; i++){
				MapArray[i] = [];
				for (var j = 0; j < kColumn; j++)
					MapArray[i][j] = ($boxM[i].textContent[j] == '?' || $boxM[i].textContent[j] == '!') ? 1 : 0;
			}

			for (var i = 0; i < kRow; i++){
				//	Ищем где мы находимся
				var j = $boxM[i].textContent.indexOf('@');
				if (j != -1){ 
					//	Проверяем куда можно пройти
					if ($boxM[i-1].textContent[j] != '#' || isJumping && (i == 1 || i != 1 && $boxM[i-2].textContent[j] != '#'))
						$box[0].style.visibility = '';	//	Север
					if ($boxM[i+1].textContent[j] != '#' || isJumping && (i == kRow - 2 || i != kRow - 2 && $boxM[i+2].textContent[j] != '#'))
						$box[1].style.visibility = '';	//	Юг
					if ($boxM[i].textContent[j-1] != '#' || isJumping && $boxM[i].textContent[j-2] != '#')
						$box[2].style.visibility = '';	//	Запад
					if ($boxM[i].textContent[j+1] != '#' || isJumping && $boxM[i].textContent[j+2] != '#')
						$box[3].style.visibility = '';	//	Восток
				}
				j = $boxM[i].textContent.indexOf('→');	//	E
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var jk = j + 1; jk < kColumn; jk++){
						var istep = parseInt((Math.abs(jk - j) - 1)/5);
						for (var ik = (i < istep ? 0 : i - istep); ik <= (i + istep < kRow ? i + istep : kRow - 1); ik++){
							MapArray[ik][jk] = MapArray[ik][jk] + 1;
							if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
						}
					}
				}
				j = $boxM[i].textContent.indexOf('←');	//	W
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var jk = 0; jk < j - 1; jk++){
						var istep = parseInt((Math.abs(jk - j) - 1)/5);
						for (var ik = (i < istep ? 0 : i - istep); ik <= (i + istep < kRow ? i + istep : kRow - 1); ik++){
							MapArray[ik][jk] = MapArray[ik][jk] + 1;
							if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↓');	//	S
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = i + 1; ik < kRow; ik++){
						var jstep = parseInt((Math.abs(ik - i) - 1)/5);
						for (var jk = (j < jstep ? 0 : j - jstep); jk <= (j + jstep < kColumn ? j + jstep : kColumn - 1); jk++){
							MapArray[ik][jk] = MapArray[ik][jk] + 1;
							if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↑');	//	N
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = 0; ik < i - 1; ik++){
						var jstep = parseInt((Math.abs(ik - i) - 1)/5);
						for (var jk = (j < jstep ? 0 : j - jstep); jk <= (j + jstep < kColumn ? j + jstep : kColumn - 1); jk++){
							MapArray[ik][jk] = MapArray[ik][jk] + 1;
							if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
						}
					}
				}

				j = $boxM[i].textContent.indexOf('↘');	//	SE
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = i + 1; ik < kRow; ik++){
						for (var jk = j +1; jk < kColumn; jk++){
							var istep = parseInt((Math.abs(jk - j) - 1)/5);
							var jstep = parseInt((Math.abs(ik - i) - 1)/5);
							if (ik > i + istep)
								if (jk > j + jstep){
									MapArray[ik][jk] = MapArray[ik][jk] + 1;
									if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
								}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↙');	//	SW
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = i + 1; ik < kRow; ik++){
						for (var jk = 0; jk < j - 1; jk++){
							var istep = parseInt((Math.abs(jk - j) - 1)/5);
							var jstep = parseInt((Math.abs(ik - i) - 1)/5);
							if (ik > i + istep)
								if (jk < j - jstep){
									MapArray[ik][jk] = MapArray[ik][jk] + 1;
									if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
								}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↖');	//	NW
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = 0; ik < i - 1; ik++){
						for (var jk = 0; jk < j - 1; jk++){
							var istep = parseInt((Math.abs(jk - j) - 1)/5);
							var jstep = parseInt((Math.abs(ik - i) - 1)/5);
							if (ik < i - istep)
								if (jk < j - jstep){
									MapArray[ik][jk] = MapArray[ik][jk] + 1;
									if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
								}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('↗');	//	NE
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					for (var ik = 0; ik < i - 1; ik++){
						for (var jk = j + 1; jk < kColumn; jk++){
							var istep = parseInt((Math.abs(jk - j) - 1)/5);
							var jstep = parseInt((Math.abs(ik - i) - 1)/5);
							if (ik < i - istep)
								if (jk > j + jstep){
									MapArray[ik][jk] = MapArray[ik][jk] + 1;
									if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
								}
						}
					}
				}

				//	✺ - очень горячо(1-2);
				//	☀ - горячо(3-5);
				//	♨ - тепло(6-9);
				//	☁ - свежо(10-13);
				//	❄ - холодно(14-18)
				//	✵ - очень холодно(19);
				var step = 0;
				j = $boxM[i].textContent.indexOf('✺');	//	очень горячо
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 2; 
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('☀');	//	горячо
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 5;
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('♨');	//	тепло
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 9;
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('☁');	//	свежо
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 13;
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
				j = $boxM[i].textContent.indexOf('❄');	//	холодно
				if (j != -1){
					$('#map .dmc')[i * kColumn + j].style.color = 'green';
					step = 18;
					for (var ik = ((i - step) > 0 ? i - step : 0); ik < ((i + step) < kRow ? i + step : kRow); ik++){
						for (var jk = ((j - step) > 0 ? j - step : 0); jk < ((j + step) < kColumn ? j + step : kColumn); jk++){
					//for (var ik = 0; ik < kRow; ik++){
						//for (var jk = 0; jk < kColumn; jk++){
							var kstep = Math.abs(jk - j) + Math.abs(ik - i);
							if (kstep <= step){
								MapArray[ik][jk] = MapArray[ik][jk] + 1;
								if (MapArray[ik][jk] > MaxMap) MaxMap = MapArray[ik][jk];
							}
						}
					}
				}
			}
			//	Отрсовываем возможный клад 
			if (MaxMap != 1)
				for (var i = 0; i < kRow; i++)
					for (var j = 0; j < kColumn; j++){
						if ($boxM[i].textContent[j] == '?' || $boxM[i].textContent[j] == '!')
							if (MapArray[i][j] == MaxMap)
								$('#map .dmc')[i * kColumn + j].style.color = 'red';
			}
		}
	},
};