/*
	A register holds one byte of data.
	Each register has a representation in HTML, which has to be
	defined beforehand.
*/
function Register(id){
	var id = id;
	var value;
	var element = document.getElementById("r"+id);

	set("00000000");
	
	function set(v){
		value = v.substring(v.length - 8, v.length);

		if(Config.displayValues){
			element.innerHTML = binToOct(value);
			var signed = "";
			if(value.substring(0, 1) == "1"){
				signed = " ("+binToSigned(value)+")";
			}
			element.title = "Dec: "+binToDec(value) + signed + "\nBin:  "+ value;
		}
		
		if(Config.useAnimations){
			element.className = 'registerValue written';
			setTimeout(function(){element.className = "registerValue"}, 50);
		}
	}
	function get(){
		if(Config.useAnimations){
			element.className = 'registerValue read';
			setTimeout(function(){element.className = "registerValue"}, 50);
		}
		
		return value;
	}
	
	return{
		 set:set
		,get:get
	}
}
