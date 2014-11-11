/*
	A flag is a single-bit register for a specific purpose.
	Each flag has a representation in HTML, which has to be
	defined beforehand.
*/
function Flag(id){
	var id = id;
	var value;
	var element = document.getElementById("f"+id);

	set("0");
	
	function set(v){
		value = v.substring(v.length - 1, v.length);
		element.innerHTML = value;
		
		if(Config.useAnimations){
			element.className += ' written';
			setTimeout(function(){element.className = ""}, 10);
		}
	}
	function get(){
		if(Config.useAnimations){
			element.className += ' read';
			setTimeout(function(){element.className = ""}, 10);
		}
		
		return value;
	}
	
	return{
		 set:set
		,get:get
	}
}