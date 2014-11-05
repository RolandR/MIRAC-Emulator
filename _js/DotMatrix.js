/*
	A dot matrix display.
	
	Address | Mode
	--------+----------------
	    030 | Flip pixel at pdout XXXX YYYY
	    031 | Turn on  pixel at pdout XXXX YYYY
	    032 | Turn off pixel at pdout XXXX YYYY
		033 | Feed pdout to dot matrix, each byte controlling a pixel.
		034 | Fill matrix with pattern in pdout
*/

var DotMatrix = new function(){
	
	var size = 16;
	var canvas = document.getElementById("dotMatrixCanvas");
	var context = canvas.getContext("2d");
	var pixelSize = canvas.width / size;
	var dots = [];
	var fillCount = 0; // In mode 033, how many times a byte has been fed to the display before
	
	initGrid();
	function initGrid(){
		var x = 0;
		while(x < size){
			dots.push([]);
			var y = 0;
			while(y < size){
				dots[x][y] = false;
				y++;
			}
			x++;
		}
	}
	
	function update(){
		var mode = binToOct(Reg.pabr.get());
		switch(mode){
			case "030": // Flip at coords
				var c = decodeCoords();
				var value = !(dots[c.x][c.y]);
				setDot(c.x, c.y, value);
			break;
			
			case "031": // On at coords
				var c = decodeCoords();
				setDot(c.x, c.y, true);
			break;
			
			case "032": // Off at coords
				var c = decodeCoords();
				setDot(c.x, c.y, false);
			break;
			
			case "033": // Insert pattern from byte
				var pattern = Reg.pdout.get();
				pattern = pattern.split("");
				var columns = size / pattern.length;
				var y = Math.floor(fillCount / columns) % size;
				var x = (fillCount % columns) * pattern.length;
				for(var i in pattern){
					var value = false;
					if(pattern[i] == "1"){
						value = true;
					}
					setDot(~~x + ~~i, y, value);
				}
				fillCount++;
			break;
			
			case "034": // fill pattern
				var pattern = Reg.pdout.get();
				pattern = pattern.split("");
				var columns = size / pattern.length;
				var y = 0;
				while(y < size){
					var x = 0;
					while(x < size){
						for(var i in pattern){
							var value = false;
							if(pattern[i] == "1"){
								value = true;
							}
							setDot(~~x + ~~i, y, value);
						}
						x += pattern.length;
					}
					y++;
				}
			break;
		}
	}
	
	function decodeCoords(){
		var coords = Reg.pdout.get();
		var x = "0000" + coords.substr(4, 4);
		var y = "0000" + coords.substr(0, 4);
		x = binToDec(x);
		y = binToDec(y);
		return {x: x, y: y};
	}
	
	function reset(){
		initGrid();
		var y = 0;
		while(y < size){
			var x = 0;
			while(x < size){
				setDot(x, y, false);
				x++;
			}
			y++;
		}
		fillCount = 0;
	}
	
	function setDot(x, y, value){
		dots[x][y] = value;
		if(value){
			context.fillStyle = "#ffa07a";
		} else {
			context.fillStyle = "#300e00";
		}
		context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
	}
	
	return {
		 update: update
		,reset: reset
	};
}