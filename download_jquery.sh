#!/bin/sh
jquery_link="http://code.jquery.com/jquery-2.1.0.min.js"
jquery_file="jquery-2.1.0.min.js"
	
# if jquery library does not exists download it
if [ ! -f $jquery_file ]; then
	wget $jquery_link
fi
