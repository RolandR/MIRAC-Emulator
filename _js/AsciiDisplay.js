/*
	A dot matrix display.
	
	Address | Mode
	--------+----------------
	    040 | push ASCII character
	    041 | set or replace character at caret
*/

var AsciiDisplay = new function(){
	
	var width = 10;
	var text = [];
	var elements = [];
	var idPrefix = "displayChar";
	var caret = 0; // Where text will be written in mode 040
	
	function init(){
		for(var i = 0; i < width; i++){
			elements[i] = document.getElementById(idPrefix + i);
			setCharAt(i, ' ');
		}
	}
	
	function update(){
		var mode = binToOct(Reg.pabr.get());
		switch(mode){
			case "040": // push character to display
				var character = Reg.pdout.get();
				character = binToDec(character);
				if(isPrintable(character)){
					character = String.fromCharCode(character);
					setCharAt(caret, character);
					caret++;
					if(caret >= width){
						caret = 0;
					}
				} else {
					handleControlCharacter(character);
				}
			break;
			case "041": // Replace current character
				var character = Reg.pdout.get();
				character = binToDec(character);
				if(isPrintable(character)){
					character = String.fromCharCode(character);
					setCharAt(caret, character);
				} else {
					handleControlCharacter(character);
				}
			break;
		}
	}
	
	function isPrintable(character){
		return (character > 31 && character < 127);
	}
	
	function setCharAt(index, value){
		if(0 > index || index >= width){
			console.error("AsciiDisplay: Index out of range: "+index);
			return false;
		}
		text[i] = value;
		document.getElementById(idPrefix + index).innerHTML = value;
	}
	
	function handleControlCharacter(charcode){
		switch(charcode){
			case "127": // Backspace
				caret--;
				if(caret < 0){
					caret = width - 1;
				}
				setCharAt(caret, ' ');
			break;
		}
	}
	
	function reset(){
		caret = 0;
		for(var i = 0; i < width; i++){
			setCharAt(i, ' ');
		}
	}
	
	return {
		 update: update
		,reset: reset
	};
}