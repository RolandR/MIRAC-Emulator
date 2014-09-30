/*
	A register holds one byte of data.
	Each register has a representation in HTML, which has to be
	defined beforehand.
*/
function Register(id){
	var id = id;
	var value;

	set("00000000");
	
	function set(v){
		value = v.substring(v.length - 8, v.length);
		document.getElementById("r"+id).innerHTML = binToOct(value);
		
		document.getElementById("r"+id).className += ' written';
		setTimeout(function(){document.getElementById("r"+id).className = "registerValue"}, 10);
	}
	function get(){
		document.getElementById("r"+id).className += ' read';
		setTimeout(function(){document.getElementById("r"+id).className = "registerValue"}, 10);
		
		return value;
	}
	
	return{
		 set:set
		,get:get
	}
}