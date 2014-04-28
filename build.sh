#!/bin/bash
# automatic extension building script


# find out which browsers is installed
chrome="`which chrome || which chromium`"
firefox="`which firefox`"
#constants
jquery_file="build/jquery-2.1.0.min.js"
jquery_link="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"
path=`pwd`
name="godville-ui+"
tmp_dir="$path/build/godville_ui"

if [ "$chrome" ]; then
	mkdir -p build
	mkdir -p $tmp_dir
	rm -f build/$name.crx
	cp *.js *.json *.css *.png $tmp_dir
	cp -r images $tmp_dir

	# if the developer key exists add the key parameter 
	key=`find $path/build/*.pem | head -1`
	if [[ $key != *"No such file or directory"* ]]; then
		key_param="--pack-extension-key=$key";
	fi	
	
	# if jquery library does not exists download it
	if [ ! -f $jquery_file ]; then
		echo "...trying to download jquery library..."
		wget $jquery_link  -q -O $jquery_file
		if [ -f $jquery_file ]; then
			echo "Jquery library has been successfully downloaded to the build directory!"
		else
			echo "downloading was unsuccessful!"				
		fi
	fi
	# if jquery library exists pack the extension
	if [ -f $jquery_file ]; then
		cp $jquery_file $tmp_dir
		$chrome --pack-extension=$tmp_dir $key_param --no-message-box
		rm -r $tmp_dir
	else	
		echo "Please download jquery-2.1.0.min.js and put it to the build directory!"
	fi
fi
if [ $firefox != '' ]; then
    echo compilation $firefox
fi