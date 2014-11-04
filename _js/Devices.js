/*
	Defines all periphery devices connected to the MIRAC 
	periphery device bus.
*/
var Devices = {
	 runByOct: function(oct){
		for(var i in Opcodes.ops){
			if(Opcodes.ops[i].oct == oct){
				Opcodes.ops[i].run();
				return true();
			}
		}
		return false;
	}
	,runByBin: function(bin){
		for(var i in Opcodes.ops){
			if(Opcodes.ops[i].bin == bin){
				try{
					Opcodes.ops[i].run();
				} catch(e){
					console.error("Error: "+Opcodes.ops[i].mnemonic);
				}
				return true;
			}
		}
		return false;
	}
	,mnemonicToOct: function(mnemonic){ // mnemonic is a truly broken word... mnemonic. mnemonic...
		mnemonic = mnemonic.toLowerCase();
		for(var i in Opcodes.ops){
			if(Opcodes.ops[i].mnemonic == mnemonic){
				return Opcodes.ops[i].oct;
			}
		}
		return '';
	}
	,devices: [
		 new Opcode('000', 'nope', Ins.nope)
		,new Opcode('001', 'ldam', Ins.ldam)
	]
}