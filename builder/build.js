
var fso = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("Shell.Application");
var wsShell = new ActiveXObject("WScript.Shell");

var CurrentDirectory = WScript.ScriptFullName.slice(0, WScript.ScriptFullName.length - WScript.ScriptName.length);
// мы находимся в подпапке, поднимаемся на уровень вверх, чтобы оказаться в папке с исходниками
CurrentDirectory = fso.GetAbsolutePathName(CurrentDirectory + "..\\");

var name = "godville_ui"; // имя выходного файла
var buildPath = CurrentDirectory + "\\build";
var tmpPath = CurrentDirectory + "\\build\\"+ name;

var message = "";

// Зипует всё содержимое указанной папки	
var zip = function(source, destination) {

	var zipFileHeader = "PK\x05\x06\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"
	var f = fso.CreateTextFile(destination, true);
	f.Write(zipFileHeader);
	f.Close(); 
	
	var zipFile = shell.NameSpace(destination);
	var currentFolder = fso.GetFolder(source);
	var folders = currentFolder.SubFolders;
	
	var files = new Enumerator(currentFolder.Files);
	files.moveFirst();
	while (files.atEnd() == false)
	{
		zipFile.CopyHere(files.item().Path);
		files.moveNext();
		WScript.Sleep(500);	
	}
	
	var folders = new Enumerator(currentFolder.SubFolders);
	folders.moveFirst();
	while (folders.atEnd() == false)
	{
		zipFile.CopyHere(folders.item().Path);
		folders.moveNext();
		WScript.Sleep(500);	
	}

}

var initBuildFolders = function() {
	if (!fso.FolderExists(buildPath)) {
		fso.CreateFolder(buildPath);
	}
	if (fso.FolderExists(tmpPath)) {
		fso.DeleteFolder(tmpPath);
	}
	fso.CreateFolder(tmpPath);
}

var buildFirefox = function() {

	initBuildFolders();
	var contentPath = fso.BuildPath(tmpPath, "content"); 
	fso.CreateFolder(contentPath);
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "*.js"), contentPath, false);
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "*.css"), fso.BuildPath(tmpPath, "content"), false);
	fso.CreateFolder(fso.BuildPath(contentPath, "images"));
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "images\\*"), fso.BuildPath(contentPath, "images"), false);
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "logo48.png"), fso.BuildPath(tmpPath, "icon.png"), false);
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "firefox\\icon64.png"), fso.BuildPath(contentPath, "images\\icon64.png"), false);
	fso.DeleteFile(fso.BuildPath(contentPath, "images\\favicon_dummy.png"));

	fso.CopyFile(fso.BuildPath(CurrentDirectory, "firefox\\content\\*"), contentPath, true);
	
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "firefox\\chrome.manifest"), tmpPath + "\\");
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "firefox\\install.rdf"), tmpPath + "\\");
	var addonPath = fso.BuildPath(buildPath, name + ".xpi");
	if (fso.FileExists(addonPath)) {
		fso.DeleteFile(addonPath);
	}
	zip(tmpPath, fso.BuildPath(buildPath, name + ".zip"));
	fso.MoveFile(fso.BuildPath(buildPath, name + ".zip"), addonPath);
	fso.DeleteFolder(tmpPath);
	if (fso.FileExists(addonPath)) {	
		message += "Сохранено: " + addonPath + "\n";
		message += "-----Плагин для firefox собран удачно!-----\n\n\n";
	}
}

var strConv = function(txt, sourceCharset, destCharset)
 {
	with(new ActiveXObject("ADODB.Stream"))
	{
		type=2, mode=3, charset=destCharset;
		open();
		writeText(txt);
		position=0, charset=sourceCharset;
		return readText();
	}
 }	
 
var buildChrome = function() {

	var chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
	if (!fso.fileExists(chrome)) {
		WScript.Echo("Браузер Google Chrome не найден!");
		return;
	}
	initBuildFolders();
	
	if (fso.FileExists(fso.BuildPath(buildPath, name + ".crx"))) {
		fso.DeleteFile(fso.BuildPath(buildPath, name + ".crx"));
	}	

	fso.CopyFile(fso.BuildPath(CurrentDirectory, "*.js"), tmpPath);
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "*.json"), tmpPath);
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "*.css"), tmpPath);
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "*.png"), tmpPath);
	fso.CreateFolder(fso.BuildPath(tmpPath, "\\images"));
	fso.CopyFile(fso.BuildPath(CurrentDirectory, "images\\*"), fso.BuildPath(tmpPath, "images"));

	var keyParam = "";
	var keyFolder = fso.GetFolder(buildPath);	
	var files = new Enumerator(keyFolder.Files);
	files.moveFirst();
	while (files.atEnd() == false)
	{
		var key = files.item().Path;
		if (fso.GetExtensionName(key) == "pem") {
			keyParam = "--pack-extension-key=\"" + key + "\"";
			message += "Ключ: " + key + "\n";
		}
		files.moveNext();
	}
	
	var execString = chrome + " --pack-extension=\"" + tmpPath + "\"  " + keyParam; //--no-message-box

	var execObject = wsShell.Exec(execString);
	WScript.Sleep(4000);	

	message += "" + strConv(execObject.StdOut.ReadAll(),"utf-8", "windows-1251");

	fso.DeleteFolder(tmpPath);
	if (fso.FileExists(fso.BuildPath(buildPath, name + ".crx"))) {	
		message += "-----Плагин для chrome собран удачно!-----\n"
	}	
	
}

if (!fso.FileExists(fso.BuildPath(CurrentDirectory, "jquery-2.1.0.min.js"))){
	WScript.Echo("Пожалуйста, загрузите jquery-2.1.0.min.js и поместите в папку с исходным кодом!");
	WScript.Quit(1);
}

buildFirefox();
buildChrome();
WScript.Echo(message);


