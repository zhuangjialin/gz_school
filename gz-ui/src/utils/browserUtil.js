

export function checkIE9UpBrowser(){
    var browser = navigator.appName;
	    if ((browser != "Netscape" && browser !="Microsoft Internet Explorer")){
	    		return false;
	    }
	    if(navigator.userAgent.indexOf("MSIE") < 0){
	    		return false;
	    }
	var version = navigator.appVersion.split(";");
	var trim_Version = version[1].replace(/[ ]/g,"");
	if(trim_Version == 'MSIE8.0' || trim_Version == 'MSIE7.0' || trim_Version == 'MSIE6.0'){
	    return false;
	}
	return true;
}