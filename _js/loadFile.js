function loadFile(url, callback){
	
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4){
			callback(xmlhttp.responseText, xmlhttp.status, url);
		}
	};

	if(!xmlhttp.withCredentials){
		xmlhttp.abort();

		var errorsElement = document.getElementById("errors");
		errorsElement.innerHTML = "Could not load file "+url;
		Control.showPopup('errorPopup');
		
	} else {
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}
}