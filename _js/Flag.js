/*
	A flag is a single-bit register for a specific purpose.
	Each flag has a representation in HTML, which has to be
	defined beforehand.
*/
function Flag(id){
	var id = id;
	var value;

	set("0");
	
	function set(v){
		value = v.substring(v.length - 1, v.length);
		document.getElementById("f"+id).innerHTML = value;
		
		document.getElementById("f"+id).className += ' written';
		setTimeout(function(){document.getElementById("f"+id).className = ""}, 10);
	}
	function get(){
		document.getElementById("f"+id).className += ' read';
		setTimeout(function(){document.getElementById("f"+id).className = ""}, 10);
		
		return value;
	}
	
	return{
		 set:set
		,get:get
	}
}