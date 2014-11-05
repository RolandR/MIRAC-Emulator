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
		element.innerHTML = binToOct(value);
		element.title = "Dec:\t"+binToDec(value) + " \nBin:\t"+ value;
		
		element.className += ' written';
		setTimeout(function(){element.className = "registerValue"}, 10);
	}
	function get(){
		element.className += ' read';
		setTimeout(function(){element.className = "registerValue"}, 10);
		
		return value;
	}
	
	return{
		 set:set
		,get:get
	}
}