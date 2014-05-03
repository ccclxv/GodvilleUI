#!/bin/sh
# Скрипт автоматической сборки расширений для браузера

# переходим в папку с исходным кодом на уровень вверх
cd ..

# Находим путь к браузеру Google Chrome или Chromium
chrome="`which chrome || which chromium`"

path=`pwd`
jquery_file="$path/jquery-2.1.0.min.js"
# место сборки
build_path="$path/build"
# имя файла расширения
name="godville_ui"
# при смене tmp_path перемещать расширение chrome в build_path!!! 
tmp_path="$build_path/$name"

# проверяем наличие библиотеки jquery  
if [ ! -f $jquery_file ]; then
	echo "Загрузите, пожалуйста, jquery-2.1.0.min.js и поместите файл в папку с исходниками!"	
	exit 1
fi

# если chrome/chromium установлен
if [ -n "$chrome" ]; then
	
	# создаем папки
	rm -rf $tmp_path
	mkdir -p $build_path
	mkdir -p $tmp_path
	
	# удаляем предыдущую сборку
	rm -f $build_path/$name.crx
	
	# копируем исходные файлы
	cp *.js *.json *.css *.png $tmp_path
	rm $tmp_path/TestModule.js
	cp -r $path/images $tmp_path
	
	# если ключ разработчика есть в папке build передаем его в параметре 
	key=`find ./ -name "*.pem" -print -quit`
	if [ -n "$key" ]; then
			key_param="--pack-extension-key=$key";
			echo "Ключ: $key"
	fi	
	
	# вызываем chrome/chromium для запаковки
	$chrome --pack-extension=$tmp_path $key_param --no-message-box
	
	# удаляем временные файлы
	rm -r $tmp_path

fi

# Запаковываем расширение для firefox
echo -e "\nСоздаём плагин для firefox..."

# создаем папки
rm -rf $tmp_path
mkdir -p $build_path
mkdir -p $tmp_path

# удаляем предыдущую сборку
rm -f $build_path/$name.xpi

# копируем исходные файлы
cp -r firefox/content/ $tmp_path/content/
cp -n *.js *.css *.png $tmp_path/content/
rm $tmp_path/content/TestModule.js
cp -r images $tmp_path/content/
cp logo48.png $tmp_path/icon.png
cp firefox/icon64.png $tmp_path/content/images/icon64.png
rm -f $tmp_path/content/images/favicon_dummy.png
 	
cp firefox/chrome.manifest firefox/install.rdf $tmp_path/
cd $tmp_path

# запаковываем расширение
zip -qr $build_path/$name.xpi .

# удаляем временные файлы
rm -rf $tmp_path

# проверяем было ли создано расширение
if [ -f $build_path/$name.xpi ]; then
	echo "Плагин для firefox был создан: $build_path/$name.xpi"
else
	echo "Не удалось создать плагин для firefox!"
fi
