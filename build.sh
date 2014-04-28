#! /bin/sh
# automatic extension building script

mkdir -p build
mkdir -p build/tmp
path=`pwd`
name="godville-ui+"
rm -f build/$name.crx
cp *.js *.json *.css *.png build/tmp
cp -r images build/tmp

chromium --pack-extension=$path/build/tmp --pack-extension-key=$path/gv.pem --no-message-box
mv build/tmp.crx build/$name.crx
rm -r build/tmp
