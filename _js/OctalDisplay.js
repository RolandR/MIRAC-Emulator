/*
	Three-digit octal display, capable of displaying one byte of
	data.
	
	Address | Mode
	--------+----------------
	    020 | Display pdin
*/

var OctalDisplay = new function(){
	
	var segments = [
		 document.getElementById("displaySegment0")
		,document.getElementById("displaySegment1")
		,document.getElementById("displaySegment2")
	]
	
	function update(){
		var oct = binToOct(Reg.pdout.get());
		var oct = oct.split("");
		
		for(var i in segments){
			segments[i].style.backgroundPosition = 0 - ~~(oct[i])*20 + "px 0px";
		}
	}
	
	function reset(){
		for(var i in segments){
			segments[i].style.backgroundPosition = "0px 0px";
		}
	}
	
	return {
		 update: update
		,reset: reset
	};
}