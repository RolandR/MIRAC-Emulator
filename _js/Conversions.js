/*
	A collection of functions for converting between bases 2, 8 and 10.
*/

function binToOct(bin){
	bin = bin.split("");
	oct = "";
	for(var i = bin.length-1; i >= 0; i -= 3){
		var dec = 0;
		if(bin[i] == "1"){
			dec += 1;
		}
		if(bin[i-1] == "1"){
			dec += 2;
		}
		if(bin[i-2] == "1"){
			dec += 4;
		}
		oct = dec + oct;
	}
	return oct;
}

function binToDec(bin){
	bin = bin.split("");
	var dec = 0;
	var e = 0;
	for(var i = bin.length-1; i >= 0; i--){
		dec += bin[i] * Math.pow(2, e);
		e++;
	}
	return dec+"";
}

function binToSigned(bin){
	if(bin.substring(0, 1) == "1"){
		bin = ALU.subtract(bin, "00000001", false);
		bin = ALU.not(bin, false);
		return "-"+binToDec(bin);
	} else {
		return binToDec(bin);
	}
}

function octToDec(oct){
	oct = oct.split("");
	var dec = 0;
	var e = 0;
	for(var i = oct.length-1; i >= 0; i--){
		dec += oct[i] * Math.pow(8, e);
		e++;
	}
	return dec+"";
}

function octToBin(oct){
	oct = oct.split("");
	var bin = "";
	for(i in oct){
		var o = 3;
		while(o--){
			if(oct[i] >= Math.pow(2, o)){
				bin += "1";
				oct[i] -= Math.pow(2, o);
			} else {
				bin += "0";
			}
		}
	}
	return bin.substring(1, bin.length);
}

function decToBin(dec){
	dec = Math.round(dec); // Handily also de-stringifies it
	bin = "";
	var i = 8;
	while(i--){
		if(dec >= Math.pow(2, i)){
			bin += "1";
			dec -= Math.pow(2, i);
		} else {
			bin += "0";
		}
	}
	
	return bin;
}

function decToOct(dec){
	return binToOct(decToBin(dec));
}
