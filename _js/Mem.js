/*
	Memory.
	Can be instantiated with variable size.
	Renders a visualisation in HTML.
*/
var Mem = function(
	 s 			// Size
	,tbodyId	// ID of tbody to render to in HTML
	,cellIdStr	// Prefix for cell IDs in HTML
	,cols		// Column count for HTML render
	,addrReg	// reference to address register
	,dInReg		// reference to data in register
	,dOutReg	// reference to data out register
){
	var size = s;
	var memory = [];
	for(var i = 0; i < size; i++){
		memory.push("00000000");
	}
	
	var memTableCols = cols;
	var tableString = "";
	
	for(var y = 0; y < Math.ceil(memory.length/memTableCols); y++){
		tableString += "<tr>";
		for(var x = 0; x < memTableCols; x++){
			var addr = y*memTableCols + x;
			tableString += '<td id="'+cellIdStr+(y*memTableCols + x)+'" title=" Octal Address '+decToOct(addr)+'">';
				if(memory[addr] != null){
					tableString += binToOct(memory[addr]);
				}
			tableString += "</td>";
		}
		tableString += "</tr>";
	}
	
	document.getElementById(tbodyId).innerHTML = tableString;
	
	function write(){
		var addr = Math.round(binToDec(addrReg.get()));
		if(addr >= size || addr < 0){
			return false;
		}
		memory[addr] = dOutReg.get();
		
		document.getElementById(cellIdStr+addr).innerHTML = binToOct(memory[addr]);
		
		document.getElementById(cellIdStr+addr).className += ' written';
		setTimeout(function(){document.getElementById(cellIdStr+addr).className = ""}, 10);
	}
	
	function read(){
		var addr = binToDec(addrReg.get());
		if(addr > size || addr < 0){
			return "00000000";
		}
		dInReg.set(memory[addr]);
		document.getElementById(cellIdStr+addr).className += ' read';
		setTimeout(function(){document.getElementById(cellIdStr+addr).className = ""}, 10);
	}
	
	function getSize(){
		return size;
	}
	
	return{
		 write: write
		,read: read
		,getSize: getSize
		,memory: memory
	}
}