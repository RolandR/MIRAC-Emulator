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
		memory.push({
			 data: "00000000"
			,element: null
		});
	}
	
	var memTableCols = cols;
	var tableString = "";
	
	for(var y = 0; y < Math.ceil(memory.length/memTableCols); y++){
		tableString += "<tr>";
		var row = document.createElement("tr");
		for(var x = 0; x < memTableCols; x++){
			var addr = y*memTableCols + x;
			memory[addr].element = document.createElement("td");
			memory[addr].element.id = cellIdStr + addr;
			memory[addr].element.title = "Octal Address: "+decToOct(addr);
			memory[addr].element.innerHTML = "000";
			
			row.appendChild(memory[addr].element);
		}
		document.getElementById(tbodyId).appendChild(row);
	}
	
	function write(){
		var addr = Math.round(binToDec(addrReg.get()));
		if(addr >= size || addr < 0){
			return false;
		}
		memory[addr].data = dOutReg.get();
		
		memory[addr].element.innerHTML = binToOct(memory[addr].data);
		
		memory[addr].element.className += ' written';
		setTimeout(function(){memory[addr].element.className = ""}, 10);
	}
	
	function read(){
		var addr = binToDec(addrReg.get());
		if(addr > size || addr < 0){
			return "00000000";
		}
		dInReg.set(memory[addr].data);
		memory[addr].element.className += ' read';
		setTimeout(function(){memory[addr].element.className = ""}, 10);
	}
	
	function getSize(){
		return size;
	}
	
	function reset(){
		for(var i = 0; i < size; i++){
			memory[i].data = "00000000";
			memory[i].element.innerHTML = "000";
		}
	}
	
	return{
		 write: write
		,read: read
		,getSize: getSize
		,memory: memory
		,reset: reset
	}
}
