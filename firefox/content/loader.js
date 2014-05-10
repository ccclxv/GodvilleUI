var loader = {

contentLoad: function(event) {
	var doc = event.originalTarget;
	var windowStats = new WeakMap();
	//alert(doc.location.href);
	if (/http(s)?:\/\/godville\.net\/superhero.*/.test(doc.location.href)) {
		if (windowStats.get(doc) == null) {
			windowStats.set(doc,'scriptsLoaded');
			loader.createScript(doc, 'chrome://godvilleui/content/phrases.js');
			loader.createScript(doc, 'chrome://godvilleui/content/gm_func.js');
			loader.createScript(doc, 'chrome://godvilleui/content/script.js');
			loader.createScript(doc, 'chrome://godvilleui/content/Monitor.js');
			loader.createScript(doc, 'chrome://godvilleui/content/utils.js');
			loader.createScript(doc, 'chrome://godvilleui/content/improvements.js');
			loader.createScript(doc, 'chrome://godvilleui/content/DungeonImprover.js');
			loader.createScript(doc, 'chrome://godvilleui/content/LootImprover.js');
			loader.createScript(doc, 'chrome://godvilleui/content/VoiceImprover.js');
			loader.createScript(doc, 'chrome://godvilleui/content/NewsImprover.js');
			loader.createScript(doc, 'chrome://godvilleui/content/InterfaceImprover.js');
			loader.createScript(doc, 'chrome://godvilleui/content/informer.js');
			loader.createScript(doc, 'chrome://godvilleui/content/words.js');
			loader.createScript(doc, 'chrome://godvilleui/content/logger.js');
			loader.createScript(doc, 'chrome://godvilleui/content/timeout_bar.js');
			loader.createScript(doc, 'chrome://godvilleui/content/constants.js');
			loader.createScript(doc, 'chrome://godvilleui/content/about.js');
			
		}
	}
	if (/http(s)?:\/\/godville\.net\/user\/(profile|rk_success).*/.test(doc.location.href)) {
		if (windowStats.get(doc) == null) {
			windowStats.set(doc,'scriptsLoaded');
			loader.createScript(doc, 'chrome://godvilleui/content/jquery-2.1.0.min.js');
			loader.createScript(doc, 'chrome://godvilleui/content/phrases.js');
			loader.createScript(doc, 'chrome://godvilleui/content/gm_func.js');
			loader.createScript(doc, 'chrome://godvilleui/content/options-page.js');
			setTimeout(function(){loader.createScript(doc, 'chrome://godvilleui/content/options.js');}, 1000)     
		}
	}
},

createScript:function(doc, uri) {
	var head = doc.getElementsByTagName('head')[0];
	var scr1 = doc.createElement('script');
	scr1.type = 'text/javascript';
	scr1.src = uri;
	scr1.id = 'GodvilleUI';
	head.appendChild(scr1);
},
};

gBrowser.addEventListener("load", loader.contentLoad, true);