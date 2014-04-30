var adTypeBinary = 1;
var adSaveCreateOverWrite = 2;

var fso = new ActiveXObject("Scripting.FileSystemObject");

var CurrentDirectory = WScript.ScriptFullName.slice(0, WScript.ScriptFullName.length - WScript.ScriptName.length);
CurrentDirectory = fso.GetAbsolutePathName(CurrentDirectory + "..\\");
var jqueryFileName = "jquery-2.1.0.min.js";
var url = "http://code.jquery.com/jquery-2.1.0.min.js";

try {
	var xHttp = new ActiveXObject("Microsoft.XMLHTTP");
	var bStrm = new ActiveXObject("Adodb.Stream");

	xHttp.Open("GET", url, false);
	xHttp.Send();

	bStrm.type = adTypeBinary;
	bStrm.open();
	bStrm.write(xHttp.responseBody);
	bStrm.savetofile(fso.BuildPath(CurrentDirectory, jqueryFileName), adSaveCreateOverWrite);
}        
catch(ex) {
	WScript.Echo("К сожалению, не удалось загрузить JQuery. Загрузите самостоятельно по ссылке " + url);
}

if (fso.FileExists(fso.BuildPath(CurrentDirectory, jqueryFileName))){
	WScript.Echo("Загрузка прошла успешно!");
} else {
	WScript.Echo("К сожалению, не удалось загрузить JQuery. Загрузите самостоятельно по ссылке " + url);
}