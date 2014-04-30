#!/bin/sh
# automatic extension building script


# find out which browsers is installed
chrome="`which chrome || which chromium`"

#constants
jquery_file="jquery-2.1.0.min.js"

path=`pwd`
build_path="$path/build"
name="godville_ui"
#при смене tmp_path перемещать расширение chrome в build_path!!! 
tmp_path="$build_path/$name"

# check jquery library 
if [ ! -f $jquery_file ]; then
	echo "Please download jquery-2.1.0.min.js and put it to the build directory!"	
	exit 1
fi


if [ -n "$chrome" ]; then
	rm -rf $tmp_path
	mkdir -p $build_path
	mkdir -p $tmp_path
	rm -f $build_path/$name.crx

	cp *.js *.json *.css *.png $tmp_path
	cp -r images $tmp_path
	
	# if the developer key exists add the key parameter 
	key=`find ./ -name "*.pem" -print -quit`
	if [ -n "$key" ]; then
			key_param="--pack-extension-key=$key";
			echo "Using developer key: $key"
	fi	
					
	cp $jquery_file $tmp_path
	$chrome --pack-extension=$tmp_path $key_param --no-message-box
	rm -r $tmp_path

fi

# Запаковываем расширение для firefox
echo "\nPacking firefox extension..."
rm -rf $tmp_path
mkdir $tmp_path
cp -r firefox/content/ $tmp_path/
cp -n *.js *.css *.png $tmp_path/content/
cp -r images $tmp_path/content/
cp logo48.png $tmp_path/icon.png
cp firefox/icon64.png $tmp_path/content/images/icon64.png
rm -f $tmp_path/content/images/favicon_dummy.png
 	
cp firefox/chrome.manifest firefox/install.rdf $tmp_path/
cd $tmp_path
rm -f $build_path/$name.xpi
zip -qr $build_path/$name.xpi .
rm -rf $tmp_path
if [ -f $build_path/$name.xpi ]; then
	echo "Successfully packed!\nOutput file: $build_path/$name.xpi"
fi
