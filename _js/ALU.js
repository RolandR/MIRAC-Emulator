/*
	Defines the MIRAC Arithmetic Logic Unit
*/
var ALU = {
	add: function(a, b, useFlags){
		a = a.split("");
		b = b.split("");
		
		var carry = "0";
		
		if(useFlags){
			//carry = Flags.c.get();
		}

		var carryIn = carry;
		var lastCarry = "0";
		
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
			if(i == 1){
				lastCarry = carry;
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

			if(lastCarry != carry){
				Flags.o.set("1");
			} else {
				Flags.o.set("0");
			}
		}
		
		return result;
	}
	
	,subtract: function(a, b, useFlags){
		return(
			this.add(
				a,
				this.twosComplement(b, false),
				useFlags
			)
		);
	}
	
	,multiply: function(a, b, useFlags){
		var aDec = binToDec(a);
		var result = "00000000";
		while(aDec--){
			result = this.add(
				b,
				result,
				false
			);
		}
		
		return result;
	}
		
	,twosComplement: function(a, useFlags){
		return(
			this.add(
				 this.not(a, false)
				,"00000001"
				,useFlags
			)
		);
	}
	
	,not: function(a, useFlags){
		var result = "";
		
		a = a.split("");
		
		for(var i in a){
			if(a[i] == "1"){
				result += "0";
			} else {
				result += "1";
			}
		}
		
		if(useFlags){
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
		var result = "";
		
		a = a.split("");
		b = b.split("");
		
		for(var i in a){
			if(a[i] == "1" && b[i] == "1"){
				result += "1";
			} else {
				result += "0";
			}
		}
		
		if(useFlags){
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
	,nand: function(a, b, useFlags){
		return(
			this.not(
				 this.and(a, b, false)
				,useFlags
			)
		);
	}
	
	,or: function(a, b, useFlags){
		var result = "";
		
		a = a.split("");
		b = b.split("");
		
		for(var i in a){
			if(a[i] == "1" || b[i] == "1"){
				result += "1";
			} else {
				result += "0";
			}
		}
		
		if(useFlags){
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
	,nor: function(a, b, useFlags){
		return(
			this.not(
				 this.or(a, b, false)
				,useFlags
			)
		);
	}
	
	,xor: function(a, b, useFlags){
		var result = "";
		
		a = a.split("");
		b = b.split("");
		
		for(var i in a){
			if((a[i] == "1" && b[i] == "0") || (a[i] == "0" && b[i] == "1")){
				result += "1";
			} else {
				result += "0";
			}
		}
		
		if(useFlags){
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
	,xnor: function(a, b, useFlags){
		return(
			this.not(
				 this.xor(a, b, false)
				,useFlags
			)
		);
	}
	
	// abcd -> dabc
	,rotateRight: function(a, useFlags){
		var result = "";
		
		result += a.substring(a.length -1);
		result += a.substring(0, a.length -1);
		
		if(useFlags){
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
	// abcd -> 0abc
	,shiftRight: function(a, useFlags){
		var result = "";
		
		var carry = a.substring(a.length -1);
		
		result += "0";
		result += a.substring(0, a.length -1);
		
		if(useFlags){
			Flags.n.set(result.charAt(0));
			Flags.c.set(carry);
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
		// abcd -> bcda
	,rotateLeft: function(a, useFlags){
		var result = "";
		
		result += a.substring(1, a.length);
		result += a.substring(0, 1);
		
		if(useFlags){
			Flags.n.set(result.charAt(0));
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
	
	// abcd -> bcd0
	,shiftLeft: function(a, useFlags){
		var result = "";
		
		var carry = a.substring(0, 1);
		
		result += a.substring(1, a.length);
		result += "0";
		
		if(useFlags){
			Flags.n.set(result.charAt(0));
			Flags.c.set(carry);
			
			if(result == "00000000"){
				Flags.z.set("1");
			} else {
				Flags.z.set("0");
			}	
		}
		
		return result;
	}
}










