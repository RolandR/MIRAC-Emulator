/*
	Defines the MIRAC Arithmetic Logic Unit
*/
var ALU = {
	add: function(a, b, useFlags){
		a = a.split("");
		b = b.split("");
		
		carry = "0";
		
		if(useFlags){
			carry = Flags.c;
		}
		
		result = "";
		for(var i = a.length-1; i >= 0; i--){
			var sum = 0;
			if(a[i]=="1"){
				sum++;
			}
			if(b[i]=="1"){
				sum++;
			}
			if(carry=="1"){
				sum++;
			}
			if(sum == 0){
				carry = "0";
				result = "0" + result;
			}
			if(sum == 1){
				carry = "0";
				result = "1" + result;
			}
			if(sum == 2){
				carry = "1";
				result = "0" + result;
			}
			if(sum == 3){
				carry = "1";
				result = "1" + result;
			}
		}
		
		if(useFlags){
			Flags.c.set(carry);
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
	,and: function(a, b, useFlags){
		var result;
		var carry;
		
		if(useFlags){
			Flags.c.set(carry);
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
			// ,new Opcode('060', 'ando', Ins.ando)
		// ,new Opcode('061', 'orop', Ins.orop)
		// ,new Opcode('062', 'xoro', Ins.xoro)
		// ,new Opcode('063', 'nand', Ins.nand)
		// ,new Opcode('064', 'noro', Ins.noro)
		// ,new Opcode('065', 'xnor', Ins.xnor)
		// ,new Opcode('066', 'nota', Ins.nota)
		// ,new Opcode('067', 'rroa', Ins.rroa)
		// ,new Opcode('070', 'rsha', Ins.rsha)
		// ,new Opcode('071', 'lroa', Ins.lroa)
		// ,new Opcode('072', 'lsha', Ins.lsha)
}